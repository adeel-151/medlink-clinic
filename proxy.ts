import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const path = request.nextUrl.pathname;
  
  if (!token) {
    const url = new URL('/', request.url);
    return NextResponse.redirect(url);
  }
  
  const role = token.role as string;
  
  if (role === "PATIENT") {
    const allowedPatientPaths = ["/dashboard", "/dashboard/appointments", "/dashboard/settings"];
    if (!allowedPatientPaths.includes(path)) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"]
}
