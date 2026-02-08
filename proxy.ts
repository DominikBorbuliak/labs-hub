import { NextRequest, NextResponse } from "next/server";
import * as lectureAvailability from "@/proxies/lecture-availability";

const proxies = [lectureAvailability];

export const proxy = (request: NextRequest) => {
  for (const { handler } of proxies) {
    const response = handler(request);
    if (response) {
      return response;
    }
  }

  return NextResponse.next();
};

// Matcher must be a static literal (Next.js parses it at compile time).
// When adding a new proxy, add its route pattern here too.
export const config = {
  matcher: ["/courses/:course/lectures/:lecture"],
};
