export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/panel/",
        "/api/",
        "/i/",
      ],
    },

    sitemap: "https://dokunuver.com.tr/sitemap.xml",
  };
}
