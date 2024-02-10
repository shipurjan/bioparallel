/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "export",
    experimental: {
        forceSwcTransforms: true,
        swcTraceProfiling: true,
    },
};

export default nextConfig;
