import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(_request: NextRequest) {
    // Temporarily disable middleware to allow client-side authentication handling
    // TODO: Implement proper cookie-based authentication for server-side protection
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
