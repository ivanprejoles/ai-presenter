import webpack from "webpack";

module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "secret-dogfish-425.convex.cloud",
        port: "",
        pathname: "/api/storage/**",
      },
    ],
  },

  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Ignore node:* imports on client side
      config.plugins.push(
        new webpack.IgnorePlugin({
          resourceRegExp: /^node:/,
        })
      );

      // Also fallback for core modules to false
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        "fs/promises": false,
        path: false,
        os: false,
        crypto: false,
      };
    }
    return config;
  },
};
