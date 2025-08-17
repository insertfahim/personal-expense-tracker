import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    typescript: {
        // !! WARN !!
        // Dangerously allow production builds to successfully complete even if
        // your project has type errors.
        // !! WARN !!
        ignoreBuildErrors: true,
    },
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
