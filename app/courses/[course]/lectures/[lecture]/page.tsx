import type { Metadata } from "next";

export default async function Page({
  params,
}: {
  params: Promise<{ course: string; lecture: string }>;
}) {
  const { course, lecture } = await params;
  const { default: Lecture, frontmatter } = await import(
    `@/content/lectures/${course}/${lecture}.mdx`
  );

  return (
    <article className="prose prose-lg max-w-4xl mx-auto px-4 py-8">
      {frontmatter && (
        <header className="mb-8 border-b border-gray-200 pb-4">
          <div className="flex items-center gap-3 mb-2">
            {frontmatter.order != null && (
              <span className="bg-blue-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                Lecture {frontmatter.order}
              </span>
            )}
            {frontmatter.availableFrom && (
              <span className="text-xs text-gray-500">
                Available from {frontmatter.availableFrom}
              </span>
            )}
          </div>
          {frontmatter.title && (
            <h1 className="text-3xl font-bold text-gray-900 mt-2 mb-2">
              {frontmatter.title}
            </h1>
          )}
          {frontmatter.description && (
            <p className="text-gray-600 italic">{frontmatter.description}</p>
          )}
          {frontmatter.recommendedStudyFrom &&
            frontmatter.recommendedStudyTo && (
              <p className="text-sm text-gray-500 mt-3">
                📅 Recommended study period:{" "}
                <span className="font-medium text-gray-700">
                  {frontmatter.recommendedStudyFrom}
                </span>
                {" – "}
                <span className="font-medium text-gray-700">
                  {frontmatter.recommendedStudyTo}
                </span>
              </p>
            )}
          {frontmatter.tags && (
            <div className="flex gap-2 mt-3 flex-wrap">
              {frontmatter.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>
      )}
      <Lecture />
    </article>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ course: string; lecture: string }>;
}): Promise<Metadata> {
  const { course, lecture } = await params;
  const { frontmatter } = await import(
    `@/content/lectures/${course}/${lecture}.mdx`
  );

  return {
    title: frontmatter?.title,
    description: frontmatter?.description,
  };
}

export function generateStaticParams() {
  return [{ course: "pb178", lecture: "test-lecture" }];
}

export const dynamicParams = false;
