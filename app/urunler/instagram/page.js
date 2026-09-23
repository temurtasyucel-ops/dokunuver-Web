export const metadata = {
  title: "Instagram NFC",
  description:
    "DOKUNUVER Instagram NFC ile müşterileriniz telefonlarını karta yaklaştırarak Instagram profilinize kolayca ulaşabilir.",
};

export default function InstagramPage() {
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
              background: "#f4ebff",
              color: "#7f56d9",
              fontSize: "13px",
              fontWeight: "800",
              marginBottom: "24px",
            }}
          >
            INSTAGRAM NFC
          </div>

<div
  style={{
    maxWidth: "430px",
    margin: "0 auto 38px",
  }}
>
  <img
    src="/images/instagram-nfc.png"
    alt="DOKUNUVER Instagram NFC kartı"
    style={{
      display: "block",
      width: "100%",
      height: "auto",
      borderRadius: "24px",
      boxShadow: "0 20px 50px rgba(16,24,40,0.12)",
    }}
  />
</div>

          <h1
            style={{
              margin: "0",
              fontSize: "clamp(40px, 7vw, 68px)",
              lineHeight: "1.05",
              letterSpacing: "-2.5px",
            }}
          >
            Instagram profiliniz
            <br />
            tek dokunuş uzağınızda.
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
            Müşteriniz telefonunu DOKUNUVER Instagram kartına yaklaştırır
            ve Instagram profilinize doğrudan ulaşır.
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
              href="https://wa.me/905075738349?text=Merhaba%20DOKUNUVER%2C%20Instagram%20NFC%20%C3%BCr%C3%BCn%C3%BC%20hakk%C4%B1nda%20bilgi%20almak%20istiyorum."
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
                color: "#7f56d9",
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
              Profilinizi paylaşmayı kolaylaştırın.
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
              description="Müşteriniz telefonunu NFC ürününe yaklaştırarak profil bağlantınıza ulaşır."
            />

            <FeatureCard
              number="02"
              title="Uygulama Gerektirmez"
              description="NFC bağlantısının açılması için ek bir uygulama indirmeye gerek yoktur."
            />

            <FeatureCard
              number="03"
              title="Doğrudan Profiliniz"
              description="Kullanıcıyı belirlediğiniz Instagram profil bağlantısına yönlendirin."
            />

            <FeatureCard
              number="04"
              title="Her Zaman Hazır"
              description="Masa, kasa veya işletmenizin uygun bir noktasında sürekli kullanabilirsiniz."
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
          color: "#7f56d9",
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
