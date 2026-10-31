// Publishes Claude's result: resolves addressed threads, posts new findings as
// an inline review, then edits the summary into the PR's review comment. It is
// a regular comment because submitted reviews cannot be replaced. Set DRY_RUN to
// print the result without writing to GitHub.

import {
  buildReview,
  fetchFiles,
  fetchThreads,
  graphql,
  requireEnv,
  rest,
  updateReviewComment,
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

const rejected = [];
if (review.comments.length > 0) {
  try {
    await rest(`/repos/${repository}/pulls/${number}/reviews`, "POST", {
      commit_id: headSha,
      event: "COMMENT",
      // GitHub documents a body as required here. The summary has its own comment.
      body: "",
      comments: review.comments,
    });
  } catch (error) {
    // One bad comment fails the whole review. Posting them singly keeps the
    // rest as threads, the only thing later runs track.
    console.error(`::warning::Inline comments rejected: ${error.message}`);
    for (const comment of review.comments) {
      try {
        await rest(`/repos/${repository}/pulls/${number}/comments`, "POST", {
          ...comment,
          commit_id: headSha,
        });
      } catch (commentError) {
        console.error(`::warning::Comment rejected: ${commentError.message}`);
        rejected.push(comment);
      }
    }
  }
}

const inline = rejected.map(
  ({ path, line, body: comment }) => `**\`${path}:${line}\`**\n\n${comment}`
);
const summary = [review.render(resolved, failedToResolve), ...inline].join(
  "\n\n---\n\n"
);

await updateReviewComment(repository, number, summary);
