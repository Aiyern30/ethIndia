/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["images.unsplash.com"],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        "magic-sdk": false,
        "@magic-ext/oauth": false,
      };
    }
    return config;
  },
};

export default nextConfig; 
