"use client";

import { DateTime } from "luxon";

type DateFormat = "short" | "long";

const formats: Record<DateFormat, Intl.DateTimeFormatOptions> = {
  short: { month: "short", day: "numeric" },
  long: { month: "long", day: "numeric", year: "numeric" },
};

export const LocalDate = ({
  dateStr,
  format = "long",
  className,
}: {
  dateStr: string;
  format?: DateFormat;
  className?: string;
}) => {
  const formatted = DateTime.fromISO(dateStr, { zone: "utc" })
    .toLocal()
    .toLocaleString(formats[format]);

  return (
    <time dateTime={dateStr} className={className}>
      {formatted}
    </time>
  );
};
