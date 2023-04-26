/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "tcorvus-post-images-bucket.s3.eu-north-1.amazonaws.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "tcorvus-profile-images-bucket.s3.eu-north-1.amazonaws.com",
        port: "",
      },
    ],
  },
};

module.exports = nextConfig;
