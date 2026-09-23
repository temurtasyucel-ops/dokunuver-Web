import "./globals.css";

export const metadata = {
  metadataBase: new URL("https://dokunuver.com.tr"),

  title: {
    default: "DOKUNUVER | NFC Çözümleri",
    template: "%s | DOKUNUVER",
  },

  description:
    "Google Yorum, Instagram, WhatsApp, IBAN ve ilanlar için NFC çözümleri. Telefonunuzu yaklaştırın, saniyeler içinde bağlanın.",

  keywords: [
    "DOKUNUVER",
    "NFC",
    "NFC kart",
    "NFC ürünleri",
    "Google yorum NFC",
    "Instagram NFC",
    "WhatsApp NFC",
    "IBAN NFC",
    "NFC çözümleri",
  ],

  openGraph: {
    title: "DOKUNUVER | Dokun. Bağlan.",
    description:
      "İşletmenizi NFC teknolojisiyle dijital dünyaya bağlayın.",
    url: "https://dokunuver.com.tr",
    siteName: "DOKUNUVER",
    locale: "tr_TR",
    type: "website",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
