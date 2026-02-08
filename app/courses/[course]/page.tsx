import fs from "node:fs";
import path from "node:path";
import { getCourseLectures } from "@/lib/lectures";
import { LectureCard } from "@/components/lecture-card";

export function generateStaticParams() {
  const lecturesDir = path.join(process.cwd(), "content/lectures");
  return fs
    .readdirSync(lecturesDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => ({ course: entry.name }));
}

export const dynamicParams = false;

export default async function CoursePage({
  params,
}: {
  params: Promise<{ course: string }>;
}) {
  const { course } = await params;
  const lectures = await getCourseLectures(course);

  return (
    <main className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-6">{course.toUpperCase()}</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {lectures.map((lecture) => (
          <LectureCard key={lecture.slug} lecture={lecture} course={course} />
        ))}
      </div>
    </main>
  );
}
