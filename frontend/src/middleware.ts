import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    // Get token from cookies or authorization header
    const token =
        request.cookies.get("token")?.value ||
        request.headers.get("authorization")?.replace("Bearer ", "");

    // Define protected routes
    const protectedPaths = ["/dashboard", "/add-expense", "/expenses"];
    const authPaths = ["/login", "/register"];

    const { pathname } = request.nextUrl;

    // Redirect authenticated users away from auth pages
    if (token && authPaths.includes(pathname)) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // Redirect unauthenticated users to login for protected routes
    if (!token && protectedPaths.includes(pathname)) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/add-expense/:path*",
        "/expenses/:path*",
        "/login",
        "/register",
    ],
};
