import { getCourses } from "@/lib/courses";
import { CourseCard } from "@/components/course-card";
import { AppBreadcrumbs } from "@/components/app-breadcrumbs";

export default function CoursesPage() {
  const courses = getCourses();

  return (
    <main className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <AppBreadcrumbs items={[{ label: "Courses" }]} />
      <h1 className="text-3xl font-bold mb-6">Courses</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <CourseCard key={course.slug} course={course} />
        ))}
      </div>
    </main>
  );
}
