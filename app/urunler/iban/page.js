export const metadata = {
  title: "IBAN NFC Kartı | DOKUNUVER",
  description:
    "DOKUNUVER IBAN NFC Kartı ile banka, hesap sahibi ve IBAN bilgilerinizi NFC veya QR ile kolayca paylaşın.",
};

export default function IbanPage() {
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
          padding: "70px 24px 100px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "70px",
            alignItems: "center",
          }}
        >
          {/* ÜRÜN GÖRSELİ */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src="/images/iban-nfc.png"
              alt="DOKUNUVER IBAN NFC Kartı"
              style={{
                display: "block",
                width: "100%",
                maxWidth: "500px",
                height: "auto",
                borderRadius: "20px",
                boxShadow: "0 20px 50px rgba(16,24,40,0.12)",
              }}
            />
          </div>

          {/* ÜRÜN BİLGİLERİ */}
          <div>
            <div
              style={{
                display: "inline-block",
                padding: "8px 14px",
                borderRadius: "999px",
                background: "#fef3f2",
                color: "#b42318",
                fontSize: "13px",
                fontWeight: "800",
                marginBottom: "20px",
              }}
            >
              IBAN NFC
            </div>

            <h1
              style={{
                margin: "0",
                fontSize: "clamp(38px, 5vw, 58px)",
                lineHeight: "1.05",
                letterSpacing: "-2px",
              }}
            >
              IBAN Kartı
            </h1>

            <p
              style={{
                margin: "22px 0 0",
                color: "#667085",
                fontSize: "17px",
                lineHeight: "1.7",
              }}
            >
              Banka, hesap sahibi ve IBAN bilgilerinizi müşterilerinizle NFC
              veya QR üzerinden kolayca paylaşın.
            </p>

            {/* FİYAT */}
            <div
              style={{
                marginTop: "30px",
                fontSize: "36px",
                fontWeight: "900",
                color: "#101828",
              }}
            >
              249 TL
            </div>

            <div
              style={{
                marginTop: "5px",
                color: "#667085",
                fontSize: "13px",
              }}
            >
              Kargo alıcıya aittir.
            </div>

            {/* ÜRÜN ÖZELLİKLERİ */}
            <div
              style={{
                marginTop: "28px",
                padding: "22px 0",
                borderTop: "1px solid #eaecf0",
                borderBottom: "1px solid #eaecf0",
                display: "grid",
                gap: "12px",
                color: "#475467",
                fontSize: "14px",
                fontWeight: "600",
              }}
            >
              <div>✓ 10 × 10 cm</div>
              <div>✓ NFC + QR ile kullanım</div>
              <div>✓ Banka ve IBAN bilgilerinize özel hazırlanır</div>
              <div>✓ IBAN bilgileri sonradan güncellenebilir</div>
              <div>✓ Masaüstü stand veya çift taraflı bant seçeneği</div>
            </div>

            {/* BUTONLAR */}
            <div
              style={{
                marginTop: "30px",
                display: "flex",
                gap: "12px",
                flexWrap: "wrap",
              }}
            >
              <a
                href="https://wa.me/905075738349?text=Merhaba%2C%20DOKUNUVER%20IBAN%20Kart%C4%B1%20sipari%C5%9Fi%20vermek%20istiyorum."
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
                WhatsApp'tan Sipariş Ver
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
              maxWidth: "700px",
              marginBottom: "48px",
            }}
          >
            <div
              style={{
                color: "#b42318",
                fontSize: "13px",
                fontWeight: "800",
                marginBottom: "12px",
              }}
            >
              IBAN KARTI
            </div>

            <h2
              style={{
                margin: "0",
                fontSize: "clamp(32px, 5vw, 48px)",
                letterSpacing: "-1.5px",
              }}
            >
              IBAN paylaşmayı kolaylaştırın.
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "18px",
            }}
          >
            <FeatureCard
              number="01"
              title="NFC + QR"
              description="Müşteriniz telefonunu karta yaklaştırabilir veya QR kodu okutarak IBAN sayfanıza ulaşabilir."
            />

            <FeatureCard
              number="02"
              title="Kolay Kopyalama"
              description="IBAN numarası ekranda görüntülenir ve uzun hesap bilgisini elle yazmak yerine kolayca kopyalanabilir."
            />

            <FeatureCard
              number="03"
              title="Güncellenebilir"
              description="Banka veya IBAN bilgileriniz değiştiğinde fiziksel kartı değiştirmeden kayıtlı bilgileriniz güncellenebilir."
            />

            <FeatureCard
              number="04"
              title="Kontrollü Kullanım"
              description="Gerektiğinde IBAN kartınız pasife alınabilir ve daha sonra yeniden aktif hale getirilebilir."
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
          color: "#b42318",
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
