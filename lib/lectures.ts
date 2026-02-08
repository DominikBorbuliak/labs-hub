import fs from "node:fs";
import path from "node:path";

export interface LectureMeta {
  slug: string;
  title: string;
  description: string;
  order: number;
  recommendedStudyFrom: string;
  recommendedStudyTo: string;
  availableFrom: string;
  tags: string[];
}

export async function getCourseLectures(
  course: string
): Promise<LectureMeta[]> {
  const lecturesDir = path.join(process.cwd(), "content/lectures", course);
  const files = fs
    .readdirSync(lecturesDir)
    .filter((file) => file.endsWith(".mdx"));

  const lectures = await Promise.all(
    files.map(async (file) => {
      const slug = file.replace(/\.mdx$/, "");
      const { frontmatter } = await import(
        `@/content/lectures/${course}/${slug}.mdx`
      );
      return {
        slug,
        title: frontmatter.title,
        description: frontmatter.description,
        order: frontmatter.order,
        recommendedStudyFrom: frontmatter.recommendedStudyFrom,
        recommendedStudyTo: frontmatter.recommendedStudyTo,
        availableFrom: frontmatter.availableFrom,
        tags: frontmatter.tags ?? [],
      } satisfies LectureMeta;
    })
  );

  return lectures.sort((a, b) => a.order - b.order);
}
