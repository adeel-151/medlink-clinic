import { withAuth } from "next-auth/middleware";
import { NextRequest } from "next/server";

const middleware = withAuth({
  pages: {
    signIn: '/auth/login',
  }
});

export default function proxy(req: NextRequest, event: any) {
  return (middleware as any)(req, event);
}

export const config = {
  matcher: ["/dashboard/:path*"]
}
