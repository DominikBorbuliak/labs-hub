// Publishes Claude's result: resolves addressed threads, posts new findings as
// an inline review, then replaces the summary comment. The summary is a regular
// comment because a submitted review cannot be deleted, and a new comment still
// notifies people, which editing one would not. Set DRY_RUN to print the result
// without writing to GitHub.

import {
  buildReview,
  deleteComments,
  fetchFiles,
  fetchOutdatedComments,
  fetchThreads,
  graphql,
  postComment,
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

const rejected = [];
if (review.comments.length > 0) {
  try {
    await rest(`/repos/${repository}/pulls/${number}/reviews`, "POST", {
      commit_id: headSha,
      event: "COMMENT",
      // GitHub requires a body here. The verdict is in the summary comment.
      body: "New findings are below. The summary is in the comment after this review.",
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

// The new summary goes first, so a failure never leaves the PR without one.
const outdated = await fetchOutdatedComments(repository, number);
await postComment(repository, number, summary);

// The summary is out, so leftover comments must not fail this job.
try {
  await deleteComments(repository, outdated);
} catch (error) {
  console.error(`::warning::Could not remove old comments: ${error.message}`);
}
