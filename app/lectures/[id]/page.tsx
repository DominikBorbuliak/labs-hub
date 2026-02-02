export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { default: Lecture } = await import(`@/content/lectures/${id}.mdx`);

  return <Lecture />;
}

export function generateStaticParams() {
  return [{ id: "1" }];
}

export const dynamicParams = false;
