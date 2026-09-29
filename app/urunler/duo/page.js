export const metadata = {
  title: "Duo NFC Kartı | DOKUNUVER",
  description:
    "DOKUNUVER Duo NFC Kartı şu anda test ve geliştirme aşamasındadır.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DuoPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        fontFamily: "Arial, sans-serif",
        color: "#101828",
      }}
    >
      <header
        style={{
          maxWidth: "1180px",
          margin: "0 auto",
          padding: "22px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "20px",
        }}
      >
        <a
          href="/"
          style={{
            textDecoration: "none",
            color: "#101828",
          }}
        >
          <div
            style={{
              fontSize: "24px",
              fontWeight: "900",
              letterSpacing: "-0.7px",
            }}
          >
            DOKUNUVER
          </div>

          <div
            style={{
              fontSize: "12px",
              color: "#087cf0",
              fontWeight: "700",
              marginTop: "2px",
            }}
          >
            Dokun. Bağlan.
          </div>
        </a>

        <a
          href="/#urunler"
          style={{
            textDecoration: "none",
            color: "#475467",
            fontSize: "14px",
            fontWeight: "700",
          }}
        >
          ← Ürünlere Dön
        </a>
      </header>

      <section
        style={{
          maxWidth: "760px",
          margin: "0 auto",
          padding: "100px 24px 140px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "inline-block",
            padding: "8px 14px",
            borderRadius: "999px",
            background: "#fff7ed",
            color: "#c2410c",
            fontSize: "13px",
            fontWeight: "800",
            marginBottom: "22px",
          }}
        >
          GELİŞTİRME AŞAMASINDA
        </div>

        <h1
          style={{
            margin: 0,
            fontSize: "clamp(38px, 6vw, 60px)",
            lineHeight: "1.05",
            letterSpacing: "-2px",
          }}
        >
          Duo NFC Kartı
        </h1>

        <p
          style={{
            margin: "24px auto 0",
            maxWidth: "620px",
            color: "#667085",
            fontSize: "17px",
            lineHeight: "1.7",
          }}
        >
          Duo NFC Kartı şu anda ürün testleri ve kullanım
          doğrulamaları devam ettiği için satışa açık değildir.
          Test süreci tamamlandığında yeniden ürünlerimize
          eklenebilir.
        </p>

        <div
          style={{
            marginTop: "34px",
          }}
        >
          <a
            href="/#urunler"
            style={{
              display: "inline-block",
              textDecoration: "none",
              background: "#101828",
              color: "#ffffff",
              padding: "15px 24px",
              borderRadius: "12px",
              fontSize: "15px",
              fontWeight: "800",
            }}
          >
            Aktif Ürünleri İncele
          </a>
        </div>
      </section>
    </main>
  );
}
