export default function GoogleYorumPage() {
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

      {/* ÜRÜN */}
      <section
        style={{
          maxWidth: "1180px",
          margin: "0 auto",
          padding: "80px 24px 110px",
        }}
      >
        <div
          style={{
            maxWidth: "760px",
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          <div
            style={{
              display: "inline-block",
              padding: "8px 14px",
              borderRadius: "999px",
              background: "#eaf4ff",
              color: "#087cf0",
              fontSize: "13px",
              fontWeight: "800",
              marginBottom: "24px",
            }}
          >
            GOOGLE YORUM NFC
          </div>

          <div
            style={{
              width: "86px",
              height: "86px",
              margin: "0 auto 28px",
              borderRadius: "24px",
              background: "#ffffff",
              border: "1px solid #eaecf0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "38px",
              color: "#087cf0",
              boxShadow: "0 12px 35px rgba(16,24,40,0.08)",
            }}
          >
            ★
          </div>

          <h1
            style={{
              margin: "0",
              fontSize: "clamp(40px, 7vw, 68px)",
              lineHeight: "1.05",
              letterSpacing: "-2.5px",
            }}
          >
            Yorum almak
            <br />
            artık çok daha kolay.
          </h1>

          <p
            style={{
              maxWidth: "650px",
              margin: "26px auto 0",
              color: "#667085",
              fontSize: "18px",
              lineHeight: "1.7",
            }}
          >
            Müşteriniz telefonunu DOKUNUVER Google Yorum kartına
            yaklaştırır ve işletmenizin Google yorum sayfasına doğrudan
            ulaşır.
          </p>

          <div
            style={{
              marginTop: "38px",
              display: "flex",
              justifyContent: "center",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            <a
              href="https://wa.me/905075738349?text=Merhaba%20DOKUNUVER%2C%20Google%20Yorum%20NFC%20%C3%BCr%C3%BCn%C3%BC%20hakk%C4%B1nda%20bilgi%20almak%20istiyorum."
              target="_blank"
              rel="noreferrer"
              style={{
                textDecoration: "none",
                background: "#25D366",
                color: "#ffffff",
                padding: "16px 25px",
                borderRadius: "13px",
                fontSize: "15px",
                fontWeight: "800",
              }}
            >
              WhatsApp'tan Bilgi Al
            </a>

            <a
              href="/#urunler"
              style={{
                textDecoration: "none",
                background: "#ffffff",
                color: "#344054",
                padding: "16px 25px",
                borderRadius: "13px",
                border: "1px solid #d0d5dd",
                fontSize: "15px",
                fontWeight: "800",
              }}
            >
              Diğer Ürünler
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
