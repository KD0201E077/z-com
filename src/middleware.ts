import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function middleware() {
  const session = await auth();
  if (!session) {
    return NextResponse.redirect("http://localhost:3000/i/flow/login");
  }
}

export const config = {
  //로그인 해야만 접근할 수 있는 페이지
  matcher: [
    "/compose/tweet",
    "/home",
    "/explore",
    "/messages",
    "/search",
    "/api/users/:path*",
  ],
};
