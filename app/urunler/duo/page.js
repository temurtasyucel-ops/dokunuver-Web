export const metadata = {
  title: "Duo NFC",
  description:
    "DOKUNUVER Duo NFC ile iki farklı dijital bağlantıyı tek üründe bir araya getirin. Google Yorum, Instagram, WhatsApp ve diğer bağlantıları birlikte kullanın.",
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
          ← Ürünlere Dön
        </a>
      </header>

      {/* HERO */}
      <section
        style={{
          padding: "70px 24px 90px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            maxWidth: "900px",
            margin: "0 auto",
          }}
        >
          <div
            style={{
              display: "inline-block",
              background: "#eaf4ff",
              color: "#087cf0",
              padding: "8px 14px",
              borderRadius: "999px",
              fontSize: "13px",
              fontWeight: "800",
              marginBottom: "30px",
            }}
          >
            DUO NFC
          </div>

<img
  src="/images/duo-nfc.png"
  alt="DOKUNUVER Duo NFC"
  style={{
    display: "block",
    width: "100%",
    maxWidth: "420px",
    height: "auto",
    margin: "0 auto 40px",
    borderRadius: "24px",
  }}
/>

          <h1
            style={{
              margin: "0 0 22px",
              fontSize: "clamp(42px, 7vw, 68px)",
              lineHeight: "1.05",
              letterSpacing: "-2px",
            }}
          >
            İki bağlantı.
            <br />
            Tek DOKUNUVER.
          </h1>

          <p
            style={{
              maxWidth: "680px",
              margin: "0 auto",
              color: "#667085",
              fontSize: "18px",
              lineHeight: "1.7",
            }}
          >
            Duo NFC ile iki farklı dijital bağlantıyı tek üründe bir araya
            getirin. Müşterileriniz ihtiyaç duydukları bağlantıya hızlı ve
            kolay şekilde ulaşsın.
          </p>

          <a
            href="https://wa.me/905075738349?text=Merhaba%20DOKUNUVER%2C%20Duo%20NFC%20%C3%BCr%C3%BCn%C3%BC%20hakk%C4%B1nda%20bilgi%20almak%20istiyorum."
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              marginTop: "34px",
              background: "#101828",
              color: "#ffffff",
              padding: "16px 26px",
              borderRadius: "12px",
              textDecoration: "none",
              fontWeight: "700",
            }}
          >
            WhatsApp'tan Bilgi Al
          </a>
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
                color: "#087cf0",
                fontSize: "13px",
                fontWeight: "900",
                letterSpacing: "1px",
                marginBottom: "14px",
              }}
            >
              NEDEN DUO NFC?
            </div>

            <h2
              style={{
                margin: "0 0 16px",
                fontSize: "clamp(32px, 5vw, 48px)",
                lineHeight: "1.1",
                letterSpacing: "-1.5px",
              }}
            >
              İki ihtiyacı tek üründe birleştirin.
            </h2>

            <p
              style={{
                margin: 0,
                color: "#667085",
                fontSize: "17px",
                lineHeight: "1.7",
              }}
            >
              İşletmenizin en çok kullandığı iki dijital bağlantıyı aynı
              DOKUNUVER ürününde müşterilerinize sunun.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "18px",
            }}
          >
            <FeatureCard
              number="01"
              title="İki NFC Noktası"
              description="Tek ürün üzerinde iki farklı NFC bağlantısı kullanın."
            />

            <FeatureCard
              number="02"
              title="Size Özel Kombinasyon"
              description="İhtiyacınıza uygun iki dijital bağlantıyı bir araya getirin."
            />

            <FeatureCard
              number="03"
              title="Tek Ürün"
              description="İki farklı kullanım için ayrı ürünler yerine tek bir çözüm kullanın."
            />

            <FeatureCard
              number="04"
              title="Kolay Kullanım"
              description="Müşteriniz istediği NFC alanına telefonunu yaklaştırarak ilgili bağlantıya ulaşır."
            />
          </div>
        </div>
      </section>

      {/* ÖRNEK KOMBİNASYONLAR */}
      <section
        style={{
          padding: "90px 24px",
          background: "#f8fafc",
        }}
      >
        <div
          style={{
            maxWidth: "900px",
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          <div
            style={{
              color: "#087cf0",
              fontSize: "13px",
              fontWeight: "900",
              letterSpacing: "1px",
              marginBottom: "14px",
            }}
          >
            ÖRNEK KOMBİNASYONLAR
          </div>

          <h2
            style={{
              margin: "0 0 38px",
              fontSize: "clamp(30px, 5vw, 44px)",
            }}
          >
            İşletmenize uygun ikiliyi seçin.
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "18px",
            }}
          >
            <CombinationCard
              first="Google Yorum"
              second="Instagram"
            />

            <CombinationCard
              first="IBAN"
              second="WhatsApp"
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
        padding: "28px",
        background: "#f8fafc",
        border: "1px solid #eaecf0",
        borderRadius: "20px",
      }}
    >
      <div
        style={{
          color: "#087cf0",
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
          margin: 0,
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

function CombinationCard({ first, second }) {
  return (
    <div
      style={{
        padding: "30px 22px",
        background: "#ffffff",
        border: "1px solid #eaecf0",
        borderRadius: "20px",
        fontSize: "18px",
        fontWeight: "800",
      }}
    >
      {first}
      <span
        style={{
          color: "#087cf0",
          margin: "0 12px",
        }}
      >
        +
      </span>
      {second}
    </div>
  );
}
