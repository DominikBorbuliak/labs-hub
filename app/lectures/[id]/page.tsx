export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { default: Lecture } = await import(`@/content/lectures/${id}.mdx`);

  return (
    <article className="prose prose-lg max-w-4xl mx-auto px-4 py-8">
      <Lecture />
    </article>
  );
}

export function generateStaticParams() {
  return [{ id: "1" }];
}

export const dynamicParams = false;
