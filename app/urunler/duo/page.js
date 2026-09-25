export const metadata = {
  title: "Duo NFC Kartı | DOKUNUVER",
  description:
    "DOKUNUVER Duo NFC Kartı ile iki farklı dijital bağlantıyı tek kartta bir araya getirin. Google + Instagram veya WhatsApp + IBAN seçeneklerinden birini seçin.",
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
              src="/images/duo-nfc.png"
              alt="DOKUNUVER Duo NFC Kartı"
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
                background: "#eaf4ff",
                color: "#087cf0",
                fontSize: "13px",
                fontWeight: "800",
                marginBottom: "20px",
              }}
            >
              DUO NFC
            </div>

            <h1
              style={{
                margin: "0",
                fontSize: "clamp(38px, 5vw, 58px)",
                lineHeight: "1.05",
                letterSpacing: "-2px",
              }}
            >
              Duo NFC Kartı
            </h1>

            <p
              style={{
                margin: "22px 0 0",
                color: "#667085",
                fontSize: "17px",
                lineHeight: "1.7",
              }}
            >
              İki farklı dijital bağlantıyı, iki ayrı NFC alanı ve QR
              kodlarıyla tek DOKUNUVER kartında bir araya getirin.
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
              349 TL
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
              <div>✓ 2 ayrı NFC alanı</div>
              <div>✓ 2 ayrı QR kod</div>
              <div>✓ İki bağlantı tek kartta</div>
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
                href="https://wa.me/905075738349?text=Merhaba%2C%20DOKUNUVER%20Duo%20NFC%20Kart%C4%B1%20sipari%C5%9Fi%20vermek%20istiyorum."
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

      {/* DUO SEÇENEKLERİ */}
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
                color: "#087cf0",
                fontSize: "13px",
                fontWeight: "800",
                marginBottom: "12px",
              }}
            >
              DUO SEÇENEKLERİ
            </div>

            <h2
              style={{
                margin: "0",
                fontSize: "clamp(32px, 5vw, 48px)",
                letterSpacing: "-1.5px",
              }}
            >
              İşletmenize uygun Duo'yu seçin.
            </h2>

            <p
              style={{
                margin: "18px 0 0",
                color: "#667085",
                fontSize: "17px",
                lineHeight: "1.7",
              }}
            >
              Duo NFC Kartı iki farklı seçenekle hazırlanır.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "20px",
            }}
          >
            <DuoOption
              number="01"
              title="Google + Instagram"
              description="Google yorum bağlantınızı ve Instagram profilinizi tek kart üzerinde müşterilerinize sunun."
              first="Google Yorum"
              second="Instagram"
            />

            <DuoOption
              number="02"
              title="WhatsApp + IBAN"
              description="WhatsApp iletişim bağlantınızı ve IBAN bilgilerinizi tek kart üzerinde bir araya getirin."
              first="WhatsApp"
              second="IBAN"
            />
          </div>
        </div>
      </section>

      {/* AVANTAJLAR */}
      <section
        style={{
          background: "#f8fafc",
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
                color: "#087cf0",
                fontSize: "13px",
                fontWeight: "800",
                marginBottom: "12px",
              }}
            >
              DUO NFC KARTI
            </div>

            <h2
              style={{
                margin: "0",
                fontSize: "clamp(32px, 5vw, 48px)",
                letterSpacing: "-1.5px",
              }}
            >
              İki ihtiyacı tek kartta birleştirin.
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
              title="İki NFC Alanı"
              description="Kart üzerindeki iki ayrı NFC alanı iki farklı dijital bağlantı için kullanılır."
            />

            <FeatureCard
              number="02"
              title="NFC + QR"
              description="Her bağlantıya NFC alanının yanı sıra kendi QR kodu üzerinden de ulaşılabilir."
            />

            <FeatureCard
              number="03"
              title="Tek Kart"
              description="İki farklı bağlantıyı iki ayrı fiziksel ürün yerine tek DOKUNUVER kartında sunabilirsiniz."
            />

            <FeatureCard
              number="04"
              title="Kullanıma Hazır"
              description="NFC ve QR bağlantıları hazırlanmış şekilde teslim edilir; işletmenizde doğrudan kullanmaya başlayabilirsiniz."
            />
          </div>
        </div>
      </section>
    </main>
  );
}

function DuoOption({ number, title, description, first, second }) {
  return (
    <div
      style={{
        padding: "30px",
        background: "#ffffff",
        border: "1px solid #eaecf0",
        borderRadius: "20px",
      }}
    >
      <div
        style={{
          color: "#087cf0",
          fontSize: "13px",
          fontWeight: "900",
          marginBottom: "20px",
        }}
      >
        {number}
      </div>

      <h3
        style={{
          margin: "0 0 12px",
          fontSize: "22px",
        }}
      >
        {title}
      </h3>

      <p
        style={{
          margin: "0 0 24px",
          color: "#667085",
          fontSize: "14px",
          lineHeight: "1.7",
        }}
      >
        {description}
      </p>

      <div
        style={{
          padding: "14px 16px",
          background: "#f8fafc",
          borderRadius: "12px",
          fontSize: "14px",
          fontWeight: "800",
          textAlign: "center",
        }}
      >
        {first}
        <span
          style={{
            color: "#087cf0",
            margin: "0 10px",
          }}
        >
          +
        </span>
        {second}
      </div>
    </div>
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
