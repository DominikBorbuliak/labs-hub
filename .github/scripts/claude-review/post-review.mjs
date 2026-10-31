// Publishes Claude's result: resolves addressed threads, then posts one review
// holding the summary and any new inline comments. Set DRY_RUN to print the
// review without writing to GitHub.

import {
  buildReview,
  fetchFiles,
  fetchThreads,
  graphql,
  requireEnv,
  rest,
} from "./lib.mjs";

const RESOLVE_MUTATION = `
  mutation ($threadId: ID!) {
    resolveReviewThread(input: { threadId: $threadId }) {
      thread { id }
    }
  }
`;

const repository = requireEnv("GITHUB_REPOSITORY");
const number = Number(requireEnv("PR_NUMBER"));
const headSha = requireEnv("HEAD_SHA");
const result = JSON.parse(requireEnv("REVIEW_RESULT"));
const dryRun = Boolean(process.env.DRY_RUN);

const [files, threads] = await Promise.all([
  fetchFiles(repository, number),
  fetchThreads(repository, number),
]);

const review = buildReview({ result, threads, files, repository, headSha });

if (dryRun) {
  process.stdout.write(
    `${JSON.stringify(
      {
        resolve: review.toResolve.map(({ id }) => id),
        comments: review.comments,
      },
      null,
      2
    )}\n\n${review.render(review.toResolve)}\n`
  );
  process.exit(0);
}

const resolved = [];
const failedToResolve = [];
for (const thread of review.toResolve) {
  try {
    await graphql(RESOLVE_MUTATION, { threadId: thread.id });
    resolved.push(thread);
  } catch (error) {
    console.error(`::warning::Could not resolve a thread: ${error.message}`);
    failedToResolve.push(thread);
  }
}

const body = review.render(resolved, failedToResolve);
const reviewsPath = `/repos/${repository}/pulls/${number}/reviews`;
const payload = { commit_id: headSha, event: "COMMENT", body };

try {
  await rest(reviewsPath, "POST", { ...payload, comments: review.comments });
} catch (error) {
  // The verdict still has to land if GitHub rejects an inline comment.
  console.error(`::warning::Inline comments rejected: ${error.message}`);
  const inline = review.comments.map(
    ({ path, line, body: comment }) => `**\`${path}:${line}\`**\n\n${comment}`
  );
  await rest(reviewsPath, "POST", {
    ...payload,
    body: [body, ...inline].join("\n\n---\n\n"),
  });
}
