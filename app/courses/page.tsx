import { getCourses } from "@/lib/courses";
import { CourseCard } from "@/components/course-card";
import { AppBreadcrumbs } from "@/components/app-breadcrumbs";

export default function CoursesPage() {
  const courses = getCourses();

  return (
    <div className="max-w-5xl mx-auto">
      <AppBreadcrumbs items={[{ label: "Courses" }]} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <CourseCard key={course.slug} course={course} />
        ))}
      </div>
    </div>
  );
}
