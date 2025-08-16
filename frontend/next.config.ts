import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    async rewrites() {
        return [
            {
                source: "/api/:path*",
                destination:
                    process.env.NODE_ENV === "production"
                        ? "/api/:path*" // In production, use Vercel serverless functions
                        : "http://localhost:5000/api/:path*", // In development, proxy to local backend
            },
        ];
    },
};

export default nextConfig;
