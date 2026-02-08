import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { CourseMetadata } from "@/lib/courses";

export const CourseCard = ({ course }: { course: CourseMetadata }) => {
  return (
    <Link href={`/courses/${course.slug}`} className="no-underline">
      <Card className="flex flex-col justify-between transition-shadow hover:shadow-md cursor-pointer h-full">
        <CardHeader>
          <CardTitle>{course.code}</CardTitle>
          <CardDescription>{course.name}</CardDescription>
        </CardHeader>
        <CardFooter>
          <Badge variant="outline">{course.semester}</Badge>
        </CardFooter>
      </Card>
    </Link>
  );
};
