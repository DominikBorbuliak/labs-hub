export default function CoursesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="px-4 py-8 sm:px-6 lg:px-8">{children}</main>
  );
}
