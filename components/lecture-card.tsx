"use client";

import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { LectureMetadata } from "@/lib/lectures";
import { CalendarDays, Lock } from "lucide-react";
import { DateTime } from "luxon";

const isInRange = (from: string, to: string): boolean => {
  const now = DateTime.utc().startOf("day");
  return (
    now >= DateTime.fromISO(from, { zone: "utc" }) &&
    now <= DateTime.fromISO(to, { zone: "utc" })
  );
};

const isAvailable = (availableFrom: string): boolean => {
  const now = DateTime.utc().startOf("day");
  return now >= DateTime.fromISO(availableFrom, { zone: "utc" });
};

const formatDate = (dateStr: string): string => {
  return DateTime.fromISO(dateStr, { zone: "utc" })
    .toLocal()
    .toLocaleString({ month: "short", day: "numeric" });
};

export const LectureCard = ({
  lecture,
  course,
}: {
  lecture: LectureMetadata;
  course: string;
}) => {
  const available = isAvailable(lecture.availableFrom);
  const inStudyRange = isInRange(
    lecture.recommendedStudyFrom,
    lecture.recommendedStudyTo
  );

  const content = (
    <Card
      className={cn(
        "flex flex-col justify-between transition-shadow h-full",
        available && "hover:shadow-md cursor-pointer",
        !available && "cursor-not-allowed",
        !inStudyRange && "opacity-50"
      )}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {!available && (
            <Lock className="size-4 shrink-0 text-muted-foreground" />
          )}
          <span>{lecture.title}</span>
        </CardTitle>
        <CardDescription className="line-clamp-2">
          {lecture.description}
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex flex-col items-start gap-2">
        <div className="flex w-full flex-wrap gap-1.5">
          {lecture.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <CalendarDays className="size-3.5" />
          <span>
            {formatDate(lecture.recommendedStudyFrom)} –{" "}
            {formatDate(lecture.recommendedStudyTo)}
          </span>
        </div>
      </CardFooter>
    </Card>
  );

  if (!available) {
    return content;
  }

  return (
    <Link
      href={`/courses/${course}/lectures/${lecture.slug}`}
      className="no-underline"
    >
      {content}
    </Link>
  );
};
