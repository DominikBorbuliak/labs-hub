import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const lecturesDir = join(process.cwd(), "content/lectures");
const schedule = {};

const courses = readdirSync(lecturesDir, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .sort((a, b) => a.name.localeCompare(b.name));

for (const course of courses) {
  const files = readdirSync(join(lecturesDir, course.name))
    .filter((f) => f.endsWith(".mdx"))
    .sort((a, b) => a.localeCompare(b));

  for (const file of files) {
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

const sorted = Object.fromEntries(
  Object.entries(schedule).sort(([a], [b]) => a.localeCompare(b))
);

writeFileSync(
  join(process.cwd(), "content/lecture-schedule.json"),
  JSON.stringify(sorted, null, 2) + "\n"
);
