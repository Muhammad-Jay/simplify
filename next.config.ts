import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactStrictMode: true,
    typescript: {
        ignoreBuildErrors: true,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    api: {
        bodyParser: {
            sizeLimit: '5mb', // Increase to 5MB or more as needed
        },
    }
  /* config options here */
};

export default nextConfig;
