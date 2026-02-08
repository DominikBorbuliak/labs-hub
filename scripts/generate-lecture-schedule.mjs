import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const lecturesDir = join(process.cwd(), "content/lectures");
const schedule = {};

for (const course of readdirSync(lecturesDir, { withFileTypes: true })) {
  if (!course.isDirectory()) {
    continue;
  }

  for (const file of readdirSync(join(lecturesDir, course.name))) {
    if (!file.endsWith(".mdx")) {
      continue;
    }

    const content = readFileSync(join(lecturesDir, course.name, file), "utf-8");
    const fm = content.match(/^---\s*\n([\s\S]*?)\n---/);
    const availableFrom = fm?.[1]?.match(
      /^availableFrom:\s*"?(\d{4}-\d{2}-\d{2})"?/m
    )?.[1];

    if (availableFrom) {
      schedule[`${course.name}/${file.replace(/\.mdx$/, "")}`] = availableFrom;
    }
  }
}

writeFileSync(
  join(process.cwd(), "content/lecture-schedule.json"),
  JSON.stringify(schedule, null, 2) + "\n"
);
