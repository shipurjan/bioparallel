/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "export",
    experimental: {
        forceSwcTransforms: true,
        swcTraceProfiling: true,
    },
    images: {
        unoptimized: true,
    },
    transpilePackages: ["@tauri-apps/api"],
};

export default nextConfig;
