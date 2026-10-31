// Writes the PR state Claude reads, as it has no GitHub access of its own.

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

import {
  STATE_DIR,
  composePrompt,
  fetchFiles,
  fetchThreads,
  renderDiff,
  requireEnv,
  rest,
  selectReviews,
} from "./lib.mjs";

const PROMPTS_DIR = join(import.meta.dirname, "prompts");

const readPrompt = (name) => readFile(join(PROMPTS_DIR, name), "utf8");

const repository = requireEnv("GITHUB_REPOSITORY");
const number = Number(requireEnv("PR_NUMBER"));

const [pr, files, threads] = await Promise.all([
  rest(`/repos/${repository}/pulls/${number}`),
  fetchFiles(repository, number),
  fetchThreads(repository, number),
]);

const state = {
  pull_request: {
    number,
    title: pr.title,
    description: pr.body,
    author: pr.user.login,
    base: pr.base.ref,
    head_sha: pr.head.sha,
  },
  our_threads: threads.filter(({ ours }) => ours),
  other_threads: threads.filter(({ ours }) => !ours),
};

const reviews = JSON.parse(
  await readFile(join(import.meta.dirname, "reviews.json"), "utf8")
);
const selected = selectReviews(reviews, files);
const focuses = await Promise.all(
  selected.map(async (review) => ({
    ...review,
    text: await readPrompt(review.prompt),
  }))
);
const prompt = composePrompt(await readPrompt("base.md"), focuses);

await mkdir(STATE_DIR, { recursive: true });
await writeFile(join(STATE_DIR, "state.json"), JSON.stringify(state, null, 2));
await writeFile(join(STATE_DIR, "diff.txt"), renderDiff(files));
await writeFile(join(STATE_DIR, "prompt.md"), prompt);

const titles = selected.map(({ title }) => title).join(", ");
process.stdout.write(`Review types: ${titles || "none"}\n`);
