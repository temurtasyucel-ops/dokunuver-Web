import "./globals.css";

export const metadata = {
  title: "DOKUNUVER | Dokun. Bağlan.",
  description: "NFC ile işletmenizi dijital dünyaya bağlayın.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
