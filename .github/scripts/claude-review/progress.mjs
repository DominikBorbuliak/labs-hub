// Shows the state of a review on the PR. Takes "reviewing", "failed" or
// "cancelled". A finished review removes the comment in post-review.mjs.

import { clearProgress, requireEnv, setProgress } from "./lib.mjs";

const repository = requireEnv("GITHUB_REPOSITORY");
const number = Number(requireEnv("PR_NUMBER"));
const runId = requireEnv("GITHUB_RUN_ID");
const [status] = process.argv.slice(2);

const runUrl = `https://github.com/${repository}/actions/runs/${runId}`;
const messages = {
  reviewing: `🔄 Claude is [reviewing this PR](${runUrl}). The summary will replace this comment.`,
  failed: `⚠️ Claude could not finish reviewing this PR. [See the run](${runUrl}).`,
};

if (status === "cancelled") {
  await clearProgress(repository, number);
} else if (messages[status]) {
  await setProgress(repository, number, messages[status]);
} else {
  throw new Error(`Unknown status ${status}`);
}
