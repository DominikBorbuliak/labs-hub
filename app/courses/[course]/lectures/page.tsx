import { redirect } from "next/navigation";

export default async function LecturesPage({
  params,
}: {
  params: Promise<{ course: string }>;
}) {
  const { course } = await params;
  redirect(`/courses/${course}`);
}
