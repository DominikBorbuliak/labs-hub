import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="max-w-4xl mx-auto">
      <Skeleton className="h-5 w-64 mb-4" />
      <div className="flex items-center gap-3 mb-2">
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-4 w-36" />
      </div>
      <Skeleton className="h-9 w-3/4 mb-2" />
      <Skeleton className="h-5 w-full mb-3" />
      <Skeleton className="h-4 w-48 mb-3" />
      <div className="flex gap-2 mb-4">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-5 w-20 rounded-full" />
        <Skeleton className="h-5 w-24 rounded-full" />
      </div>
      <Skeleton className="h-px w-full mb-6" />
      <div className="space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-32 w-full rounded-lg" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  );
}
