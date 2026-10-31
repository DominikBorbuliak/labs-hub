// Shared helpers for the Claude review workflow. Pure functions are exported
// separately from API calls so the rendering logic can be run offline.

export const STATE_DIR = ".claude-review";

const API_URL = "https://api.github.com";
const FINDING_MARKER = /<!-- claude-review:([A-Za-z0-9_-]+) -->/;
const OUR_AUTHOR = "github-actions";

const VERDICTS = {
  approve: "🟢 Approval recommended",
  changes: "🟡 Changes recommended",
  discussion: "🔵 Needs a closer look",
};
const SEVERITIES = {
  high: "🔴 High",
  medium: "🟠 Medium",
  low: "⚪ Low",
};

export const requireEnv = (name) => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable ${name}`);
  }
  return value;
};

const request = async (path, options = {}) => {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${requireEnv("GITHUB_TOKEN")}`,
      "Content-Type": "application/json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`${options.method ?? "GET"} ${path}: ${text}`);
  }
  return response.json();
};

export const rest = (path, method, body) =>
  request(path, { method, body: body && JSON.stringify(body) });

export const graphql = async (query, variables) => {
  const { data, errors } = await rest("/graphql", "POST", {
    query,
    variables,
  });
  if (errors?.length) {
    throw new Error(errors.map(({ message }) => message).join("; "));
  }
  return data;
};

export const fetchFiles = async (repository, number) => {
  const files = [];
  for (let page = 1; ; page++) {
    const batch = await rest(
      `/repos/${repository}/pulls/${number}/files?per_page=100&page=${page}`
    );
    files.push(...batch);
    if (batch.length < 100) {
      return files;
    }
  }
};

const THREADS_QUERY = `
  query ($owner: String!, $name: String!, $number: Int!, $cursor: String) {
    repository(owner: $owner, name: $name) {
      pullRequest(number: $number) {
        reviewThreads(first: 100, after: $cursor) {
          pageInfo { hasNextPage endCursor }
          nodes {
            id
            isResolved
            isOutdated
            path
            line
            comments(first: 50) {
              nodes { author { login } body url }
            }
          }
        }
      }
    }
  }
`;

export const encodeMarker = ({ severity, title }) => {
  const payload = JSON.stringify({ severity, title });
  const encoded = Buffer.from(payload).toString("base64url");
  return `<!-- claude-review:${encoded} -->`;
};

const decodeMarker = (body) => {
  const match = body.match(FINDING_MARKER);
  if (!match) {
    return null;
  }
  try {
    return JSON.parse(Buffer.from(match[1], "base64url").toString());
  } catch {
    return null;
  }
};

export const normalizeThread = ({
  id,
  isResolved,
  isOutdated,
  path,
  line,
  comments,
}) => {
  const [first] = comments.nodes;
  const marker =
    first?.author?.login === OUR_AUTHOR && decodeMarker(first.body);
  return {
    id,
    is_resolved: isResolved,
    is_outdated: isOutdated,
    path,
    line,
    url: first?.url,
    ours: Boolean(marker),
    severity: marker ? marker.severity : undefined,
    title: marker ? marker.title : undefined,
    comments: comments.nodes.map(({ author, body }) => ({
      author: author?.login ?? "ghost",
      body: body.replace(FINDING_MARKER, "").trim(),
    })),
  };
};

export const fetchThreads = async (repository, number) => {
  const [owner, name] = repository.split("/");
  const threads = [];
  let cursor = null;
  for (;;) {
    const data = await graphql(THREADS_QUERY, { owner, name, number, cursor });
    const { nodes, pageInfo } = data.repository.pullRequest.reviewThreads;
    threads.push(...nodes.map(normalizeThread));
    if (!pageInfo.hasNextPage) {
      return threads;
    }
    cursor = pageInfo.endCursor;
  }
};

// Splits a GitHub patch into rows that know their new-file line number.
export const parsePatch = (patch = "") => {
  const rows = [];
  let hunk = -1;
  let newLine = 0;
  for (const text of patch ? patch.split("\n") : []) {
    const header = text.match(/^@@ -\d+(?:,\d+)? \+(\d+)(?:,\d+)? @@/);
    if (header) {
      hunk += 1;
      newLine = Number(header[1]);
      rows.push({ text, hunk });
    } else if (text.startsWith("-") || text.startsWith("\\")) {
      rows.push({ text, hunk });
    } else {
      rows.push({ text, hunk, line: newLine });
      newLine += 1;
    }
  }
  return rows;
};

export const renderDiff = (files) =>
  files
    .map(({ filename, status, patch }) => {
      const rows = patch
        ? parsePatch(patch).map(
            ({ line, text }) => `${String(line ?? "").padStart(6)} ${text}`
          )
        : ["(no textual diff available)"];
      return [`=== ${filename} (${status})`, ...rows].join("\n");
    })
    .join("\n\n");

// Keeps the review types with at least one changed file, and which files.
export const selectReviews = (reviews, files) =>
  reviews
    .map((review) => ({
      ...review,
      files: files
        .map(({ filename }) => filename)
        .filter((filename) => new RegExp(review.match).test(filename)),
    }))
    .filter(({ files: matched }) => matched.length > 0);

export const composePrompt = (base, focuses) =>
  [
    base.trim(),
    ...focuses.map(({ title, files, text }) =>
      [
        `## ${title}`,
        `Applies to: ${files.map((file) => `\`${file}\``).join(", ")}`,
        text.trim(),
      ].join("\n\n")
    ),
  ].join("\n\n");

// Picks where a finding can attach. GitHub rejects the whole review if any
// comment targets a line outside the diff, so a stray line number moves to the
// closest line in the file and the comment says where it really belongs.
export const anchorFinding = (finding, files) => {
  const file = files.find(({ filename }) => filename === finding.path);
  const rows = parsePatch(file?.patch).filter(({ line }) => line !== undefined);
  if (rows.length === 0) {
    return null;
  }
  const exact = rows.find(({ line }) => line === finding.line);
  if (exact) {
    const start = rows.find(({ line }) => line === finding.start_line);
    const isRange = start?.hunk === exact.hunk && start.line < exact.line;
    return { line: exact.line, start_line: isRange ? start.line : undefined };
  }
  const distance = ({ line }) => Math.abs(line - finding.line);
  const nearest = rows.reduce((a, b) => (distance(b) < distance(a) ? b : a));
  return { line: nearest.line, note: `Refers to line ${finding.line}.` };
};

const isDuplicate = (finding, threads) =>
  threads.some(
    ({ path, title }) =>
      path === finding.path &&
      title?.trim().toLowerCase() === finding.title.trim().toLowerCase()
  );

const issueLine = ({ severity, title, url, suffix }) =>
  `- ${SEVERITIES[severity] ?? SEVERITIES.medium} [${title}](${url})${suffix}`;

const section = (label, items, open) =>
  [
    `<details${open ? " open" : ""}>`,
    `<summary><strong>${label}</strong></summary>`,
    "",
    ...items,
    "",
    "</details>",
  ].join("\n");

const count = (items, noun) =>
  `${items.length} ${noun}${items.length === 1 ? "" : "s"}`;

// Turns Claude's result into a review, trusting only ids and paths that the
// current PR state confirms.
export const buildReview = ({
  result,
  threads,
  files,
  repository,
  headSha,
}) => {
  const ours = threads.filter(({ ours: isOurs }) => isOurs);
  const openThreads = ours.filter(({ is_resolved }) => !is_resolved);
  const reasons = new Map(
    result.resolved_threads.map(({ thread_id, reason }) => [thread_id, reason])
  );
  const toResolve = openThreads.filter(({ id }) => reasons.has(id));
  const stillOpen = openThreads.filter(({ id }) => !reasons.has(id));

  const comments = [];
  const newIssues = [];
  const unplaced = [];
  for (const finding of result.findings) {
    if (isDuplicate(finding, ours)) {
      continue;
    }
    const anchor = anchorFinding(finding, files);
    if (!anchor) {
      unplaced.push(finding);
      continue;
    }
    const { severity, title, body, path } = finding;
    comments.push({
      path,
      line: anchor.line,
      start_line: anchor.start_line,
      side: "RIGHT",
      body: [
        encodeMarker(finding),
        `**${title}** · ${SEVERITIES[severity]}`,
        "",
        ...(anchor.note ? [anchor.note, ""] : []),
        body,
      ].join("\n"),
    });
    newIssues.push({
      severity,
      title,
      url: `https://github.com/${repository}/blob/${headSha}/${path}#L${anchor.line}`,
      suffix: " · New",
    });
  }

  const openIssues = [
    ...newIssues,
    ...stillOpen.map(({ severity, title, url }) => ({
      severity,
      title,
      url,
      suffix: "",
    })),
  ];
  const blocking = [...openIssues, ...unplaced].some(
    ({ severity }) => severity !== "low"
  );
  const verdict =
    result.verdict === "approve" && blocking ? "changes" : result.verdict;

  return {
    comments,
    toResolve,
    reasons,
    render: (resolved, failedToResolve = []) => {
      const open = [
        ...openIssues.map(issueLine),
        ...failedToResolve.map(({ severity, title, url }) =>
          issueLine({ severity, title, url, suffix: "" })
        ),
        ...unplaced.map(
          ({ severity, title, path, line, body }) =>
            `- ${SEVERITIES[severity]} **${title}** (\`${path}:${line}\`): ${body}`
        ),
      ];
      return [
        "<!-- claude-review-overview -->",
        "",
        `### ${VERDICTS[verdict]}`,
        "",
        result.summary,
        "",
        open.length > 0
          ? section(count(open, "open issue"), open, true)
          : "**No open issues** 🎉",
        ...(resolved.length > 0
          ? [
              "",
              section(
                `${count(resolved, "issue")} resolved since last review`,
                resolved.map(({ severity, title, url, id }) =>
                  issueLine({
                    severity,
                    title,
                    url,
                    suffix: `: ${reasons.get(id)}`,
                  })
                ),
                false
              ),
            ]
          : []),
      ].join("\n");
    },
  };
};
