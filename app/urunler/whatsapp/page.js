export default function WhatsAppPage() {
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
              background: "#ecfdf3",
              color: "#067647",
              fontSize: "13px",
              fontWeight: "800",
              marginBottom: "24px",
            }}
          >
            WHATSAPP NFC
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
              color: "#25D366",
              boxShadow: "0 12px 35px rgba(16,24,40,0.08)",
            }}
          >
            ✆
          </div>

          <h1
            style={{
              margin: "0",
              fontSize: "clamp(40px, 7vw, 68px)",
              lineHeight: "1.05",
              letterSpacing: "-2.5px",
            }}
          >
            İletişime geçmek
            <br />
            tek dokunuş kadar kolay.
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
            Müşteriniz telefonunu DOKUNUVER WhatsApp kartına yaklaştırır
            ve belirlediğiniz WhatsApp iletişim bağlantısına doğrudan
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
              href="https://wa.me/905075738349?text=Merhaba%20DOKUNUVER%2C%20WhatsApp%20NFC%20%C3%BCr%C3%BCn%C3%BC%20hakk%C4%B1nda%20bilgi%20almak%20istiyorum."
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

      {/* AVANTAJLAR */}
      <section
        style={{
          background: "#ffffff",
          padding: "90px 24px",
        }}
      >
        <div
          style={{
            maxWidth: "1180px",
            margin: "0 auto",
          }}
        >
          <div
            style={{
              maxWidth: "650px",
              marginBottom: "48px",
            }}
          >
            <div
              style={{
                color: "#067647",
                fontSize: "13px",
                fontWeight: "800",
                marginBottom: "12px",
              }}
            >
              NEDEN DOKUNUVER?
            </div>

            <h2
              style={{
                margin: "0",
                fontSize: "clamp(32px, 5vw, 48px)",
                letterSpacing: "-1.5px",
              }}
            >
              Müşterileriniz size daha kolay ulaşsın.
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "18px",
            }}
          >
            <FeatureCard
              number="01"
              title="Tek Dokunuş"
              description="Müşteriniz telefonunu NFC ürününe yaklaştırarak WhatsApp bağlantınıza ulaşır."
            />

            <FeatureCard
              number="02"
              title="Numara Yazmaya Gerek Yok"
              description="Telefon numarasını manuel olarak kaydetmeden iletişim bağlantısına ulaşılabilir."
            />

            <FeatureCard
              number="03"
              title="Hazır Mesaj"
              description="İsterseniz WhatsApp bağlantınızı müşterinin karşısına önceden hazırlanmış bir mesajla açabilirsiniz."
            />

            <FeatureCard
              number="04"
              title="İşletmenize Özel"
              description="NFC kartınız işletmenizin kullanacağı WhatsApp iletişim bağlantısına özel hazırlanır."
            />
          </div>
        </div>
      </section>
    </main>
  );
}

function FeatureCard({ number, title, description }) {
  return (
    <div
      style={{
        border: "1px solid #eaecf0",
        borderRadius: "20px",
        padding: "28px",
        background: "#ffffff",
      }}
    >
      <div
        style={{
          color: "#067647",
          fontSize: "13px",
          fontWeight: "900",
          marginBottom: "24px",
        }}
      >
        {number}
      </div>

      <h3
        style={{
          margin: "0 0 10px",
          fontSize: "19px",
        }}
      >
        {title}
      </h3>

      <p
        style={{
          margin: "0",
          color: "#667085",
          fontSize: "14px",
          lineHeight: "1.7",
        }}
      >
        {description}
      </p>
    </div>
  );
}
