import fs from "node:fs";
import path from "node:path";

export interface CourseMeta {
  slug: string;
  title: string;
  name: string;
  semester: string;
}

export function getCourses(): CourseMeta[] {
  const filePath = path.join(process.cwd(), "content/courses-metadata.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as CourseMeta[];
}

export function getCourse(slug: string): CourseMeta | undefined {
  return getCourses().find((c) => c.slug === slug);
}
