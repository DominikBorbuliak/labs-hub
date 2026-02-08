import { NextRequest, NextResponse } from "next/server";
import schedule from "@/content/lecture-schedule.json";

const lectureSchedule = schedule as Record<string, string>;

export const matcher = "/courses/:course/lectures/:lecture";

export const handler = (request: NextRequest): NextResponse | null => {
  const match = request.nextUrl.pathname.match(
    /^\/courses\/([^/]+)\/lectures\/([^/]+)$/
  );
  if (!match) {
    return null;
  }

  const key = `${match[1]}/${match[2]}`;
  const availableFrom = lectureSchedule[key];

  if (availableFrom) {
    const today = new Date().toISOString().split("T")[0];
    if (today < availableFrom) {
      const url = request.nextUrl.clone();
      url.pathname = "/_not-found";
      return NextResponse.rewrite(url);
    }
  }

  return null;
};
