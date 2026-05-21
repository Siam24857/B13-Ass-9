/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      { protocol: "https", hostname: "i.pravatar.cc", pathname: "/**" },
      { protocol: "https", hostname: "lh3.googleusercontent.com", pathname: "/**" },
    ],
  },

  reactCompiler: true,
};

export default nextConfig;