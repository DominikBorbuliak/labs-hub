import type { Metadata } from "next";
import fs from "node:fs";
import path from "node:path";
import { getCourse } from "@/lib/courses";
import { AppBreadcrumbs } from "@/components/app-breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CalendarDays } from "lucide-react";

const formatDate = (dateStr: string): string => {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ course: string; lecture: string }>;
}): Promise<Metadata> => {
  const { course, lecture } = await params;
  const { frontmatter } = await import(
    `@/content/lectures/${course}/${lecture}.mdx`
  );

  return {
    title: frontmatter?.title,
    description: frontmatter?.description,
  };
};

export const generateStaticParams = () => {
  const lecturesDir = path.join(process.cwd(), "content/lectures");
  const courses = fs
    .readdirSync(lecturesDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);

  return courses.flatMap((course) => {
    const courseDir = path.join(lecturesDir, course);
    return fs
      .readdirSync(courseDir)
      .filter((file) => file.endsWith(".mdx"))
      .map((file) => ({
        course,
        lecture: file.replace(/\.mdx$/, ""),
      }));
  });
};

export const dynamicParams = false;

const Page = async ({
  params,
}: {
  params: Promise<{ course: string; lecture: string }>;
}) => {
  const { course, lecture } = await params;
  const { default: Lecture, frontmatter } = await import(
    `@/content/lectures/${course}/${lecture}.mdx`
  );
  const courseMeta = getCourse(course);
  const courseTitle = courseMeta?.title ?? course.toUpperCase();

  return (
    <article className="prose prose-lg dark:prose-invert max-w-4xl mx-auto">
      <AppBreadcrumbs
        items={[
          { label: "Courses", href: "/courses" },
          { label: courseTitle, href: `/courses/${course}` },
          { label: frontmatter?.title ?? lecture },
        ]}
      />
      {frontmatter && (
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            {frontmatter.order != null && (
              <Badge>Lecture {frontmatter.order}</Badge>
            )}
            {frontmatter.availableFrom && (
              <span className="text-xs text-muted-foreground">
                Available from {formatDate(frontmatter.availableFrom)}
              </span>
            )}
          </div>
          {frontmatter.title && (
            <h1 className="text-3xl font-bold mt-2 mb-2">
              {frontmatter.title}
            </h1>
          )}
          {frontmatter.description && (
            <p className="text-muted-foreground italic">
              {frontmatter.description}
            </p>
          )}
          {frontmatter.recommendedStudyFrom &&
            frontmatter.recommendedStudyTo && (
              <p className="text-sm text-muted-foreground mt-3 flex items-center gap-1.5">
                <CalendarDays className="size-4" />
                Recommended study period:{" "}
                <span className="font-medium text-foreground">
                  {formatDate(frontmatter.recommendedStudyFrom)}
                </span>
                {" – "}
                <span className="font-medium text-foreground">
                  {formatDate(frontmatter.recommendedStudyTo)}
                </span>
              </p>
            )}
          {frontmatter.tags && (
            <div className="flex gap-2 mt-3 flex-wrap">
              {frontmatter.tags.map((tag: string) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
          <Separator className="mt-4" />
        </header>
      )}
      <Lecture />
    </article>
  );
};

export default Page;
