/** @type {import('next').NextConfig} */
const nextConfig = {
  //   reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
        pathname: "/a/dv6kwxfdfm/**",
      },
    ],
  },
};

export default nextConfig;
