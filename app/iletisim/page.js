export const metadata = {
  title: "İletişim",
  description:
    "DOKUNUVER ile iletişime geçin. NFC ürünleri, işletmenize özel çözümler ve siparişler hakkında bilgi alın.",
};

export default function IletisimPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        fontFamily: "Arial, sans-serif",
        color: "#101828",
      }}
    >
      {/* HEADER */}
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
            color: "#101828",
            textDecoration: "none",
            fontSize: "20px",
            fontWeight: "800",
            letterSpacing: "-0.5px",
          }}
        >
          DOKUNUVER
        </a>

        <a
          href="/#urunler"
          style={{
            color: "#475467",
            textDecoration: "none",
            fontSize: "14px",
            fontWeight: "600",
          }}
        >
          ← Ana Sayfaya Dön
        </a>
      </header>

      {/* CONTENT */}
      <section
        style={{
          maxWidth: "760px",
          margin: "0 auto",
          padding: "80px 24px 120px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "inline-block",
            background: "#eef4ff",
            color: "#3538cd",
            padding: "8px 14px",
            borderRadius: "999px",
            fontSize: "13px",
            fontWeight: "700",
            marginBottom: "24px",
          }}
        >
          İLETİŞİM
        </div>

        <h1
          style={{
            margin: "0 0 20px",
            fontSize: "clamp(38px, 7vw, 64px)",
            lineHeight: "1.05",
            letterSpacing: "-2px",
          }}
        >
          Bir dokunuşla
          <br />
          iletişime geçin.
        </h1>

        <p
          style={{
            maxWidth: "620px",
            margin: "0 auto",
            color: "#667085",
            fontSize: "18px",
            lineHeight: "1.7",
          }}
        >
          DOKUNUVER NFC ürünleri, işletmenize özel çözümler ve siparişler
          hakkında bilgi almak için bizimle WhatsApp üzerinden iletişime
          geçebilirsiniz.
        </p>

        <div
          style={{
            marginTop: "42px",
            padding: "36px 28px",
            background: "#ffffff",
            border: "1px solid #eaecf0",
            borderRadius: "24px",
            boxShadow: "0 16px 40px rgba(16,24,40,0.06)",
          }}
        >
          <div
            style={{
              fontSize: "32px",
              marginBottom: "14px",
            }}
          >
            💬
          </div>

          <h2
            style={{
              margin: "0 0 10px",
              fontSize: "24px",
            }}
          >
            WhatsApp
          </h2>

          <p
            style={{
              margin: "0 auto 24px",
              color: "#667085",
              lineHeight: "1.6",
            }}
          >
            Ürünlerimiz veya işletmenize uygun NFC çözümü hakkında bize
            doğrudan yazabilirsiniz.
          </p>

          <a
            href="https://wa.me/905075738349?text=Merhaba%20DOKUNUVER%2C%20NFC%20%C3%BCr%C3%BCnleriniz%20hakk%C4%B1nda%20bilgi%20almak%20istiyorum."
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              background: "#101828",
              color: "#ffffff",
              padding: "15px 24px",
              borderRadius: "12px",
              textDecoration: "none",
              fontWeight: "700",
            }}
          >
            WhatsApp'tan Yaz
          </a>
        </div>

        <p
          style={{
            marginTop: "40px",
            color: "#98a2b3",
            fontSize: "14px",
          }}
        >
          DOKUNUVER · Dokun. Bağlan.
        </p>
      </section>
    </main>
  );
}
