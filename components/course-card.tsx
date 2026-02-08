import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { CourseMeta } from "@/lib/courses";

export function CourseCard({ course }: { course: CourseMeta }) {
  return (
    <Link href={`/courses/${course.slug}`} className="no-underline">
      <Card className="flex flex-col justify-between transition-shadow hover:shadow-md cursor-pointer h-full">
        <CardHeader>
          <CardTitle>{course.title}</CardTitle>
          <CardDescription>{course.name}</CardDescription>
        </CardHeader>
        <CardFooter>
          <Badge variant="outline">{course.semester}</Badge>
        </CardFooter>
      </Card>
    </Link>
  );
}
