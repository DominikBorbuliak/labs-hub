import fs from "node:fs";
import path from "node:path";
import { getCourseLectures } from "@/lib/lectures";
import { getCourse } from "@/lib/courses";
import { LectureCard } from "@/components/lecture-card";
import { AppBreadcrumbs } from "@/components/app-breadcrumbs";

export const generateStaticParams = () => {
  const lecturesDir = path.join(process.cwd(), "content/lectures");
  return fs
    .readdirSync(lecturesDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => ({ course: entry.name }));
};

export const dynamicParams = false;

const CoursePage = async ({
  params,
}: {
  params: Promise<{ course: string }>;
}) => {
  const { course } = await params;
  const lectures = await getCourseLectures(course);
  const courseMeta = getCourse(course);
  const courseTitle = courseMeta?.title ?? course.toUpperCase();

  return (
    <div className="max-w-5xl mx-auto">
      <AppBreadcrumbs
        items={[{ label: "Courses", href: "/courses" }, { label: courseTitle }]}
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {lectures.map((lecture) => (
          <LectureCard key={lecture.slug} lecture={lecture} course={course} />
        ))}
      </div>
    </div>
  );
};

export default CoursePage;
