export default function sitemap() {
  const baseUrl = "https://dokunuver.com.tr";

  return [
    {
      url: baseUrl,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/urunler/google-yorum`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/urunler/instagram`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/urunler/whatsapp`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/urunler/iban`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/urunler/ilan`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}
