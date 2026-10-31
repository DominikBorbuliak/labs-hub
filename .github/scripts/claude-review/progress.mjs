// Shows the state of a review in the PR's review comment. Takes "reviewing",
// "failed" or "cancelled". A finished review puts its summary there instead.

import { requireEnv, updateReviewComment } from "./lib.mjs";

const repository = requireEnv("GITHUB_REPOSITORY");
const number = Number(requireEnv("PR_NUMBER"));
const runId = requireEnv("GITHUB_RUN_ID");
const [status] = process.argv.slice(2);

const runUrl = `https://github.com/${repository}/actions/runs/${runId}`;
const messages = {
  reviewing: (round) =>
    `⏳ Claude is [reviewing this PR](${runUrl}) · Round ${round}`,
  failed: () =>
    `⚠️ Claude could not finish reviewing this PR. [See the run](${runUrl}).`,
  cancelled: () =>
    "🚫 A newer push cancelled this review. A new one starts if the build passes.",
};

if (!messages[status]) {
  throw new Error(`Unknown status ${status}`);
}
await updateReviewComment(repository, number, messages[status]);
