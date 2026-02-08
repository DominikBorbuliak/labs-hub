import fs from "node:fs";
import path from "node:path";

export type CourseMetadata = {
  slug: string;
  title: string;
  name: string;
  semester: string;
};

export function getCourses(): CourseMetadata[] {
  const filePath = path.join(process.cwd(), "content/courses-metadata.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as CourseMetadata[];
}

export function getCourse(slug: string): CourseMetadata | undefined {
  return getCourses().find((c) => c.slug === slug);
}
