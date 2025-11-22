/** @type {import('next').NextConfig} */
const nextConfig = {
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

module.exports = nextConfig;
