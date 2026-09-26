export const metadata = {
  title: "İletişim | DOKUNUVER",
  description:
    "DOKUNUVER NFC ürünleri, işletmenize özel çözümler ve siparişler hakkında bilgi almak için bizimle iletişime geçin.",
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
          href="/"
          style={{
            color: "#475467",
            textDecoration: "none",
            fontSize: "14px",
            fontWeight: "700",
            whiteSpace: "nowrap",
          }}
        >
          ← Ana Sayfaya Dön
        </a>
      </header>

      {/* HERO */}
      <section
        style={{
          maxWidth: "820px",
          margin: "0 auto",
          padding: "80px 24px 70px",
          textAlign: "center",
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
            marginBottom: "24px",
          }}
        >
          İLETİŞİM
        </div>

        <h1
          style={{
            margin: "0",
            fontSize: "clamp(38px, 7vw, 64px)",
            lineHeight: "1.05",
            letterSpacing: "-2px",
          }}
        >
          DOKUNUVER hakkında
          <br />
          bize ulaşın.
        </h1>

        <p
          style={{
            maxWidth: "640px",
            margin: "24px auto 0",
            color: "#667085",
            fontSize: "18px",
            lineHeight: "1.7",
          }}
        >
          Ürünlerimiz hakkında bilgi almak, işletmenize uygun NFC
          çözümünü belirlemek veya sipariş vermek için WhatsApp
          üzerinden bizimle iletişime geçebilirsiniz.
        </p>
      </section>

      {/* WHATSAPP */}
      <section
        style={{
          maxWidth: "760px",
          margin: "0 auto",
          padding: "0 24px 60px",
        }}
      >
        <div
          style={{
            padding: "40px 28px",
            background: "#ffffff",
            border: "1px solid #eaecf0",
            borderRadius: "24px",
            boxShadow: "0 16px 40px rgba(16,24,40,0.06)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: "58px",
              height: "58px",
              margin: "0 auto 18px",
              borderRadius: "18px",
              background: "#ecfdf3",
              color: "#067647",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "27px",
            }}
          >
            💬
          </div>

          <h2
            style={{
              margin: "0 0 12px",
              fontSize: "27px",
            }}
          >
            WhatsApp üzerinden yazın
          </h2>

          <p
            style={{
              maxWidth: "540px",
              margin: "0 auto 26px",
              color: "#667085",
              fontSize: "15px",
              lineHeight: "1.7",
            }}
          >
            Google Yorum, Instagram, WhatsApp, IBAN, İlan veya Duo NFC
            ürünleri hakkında bilgi alabilir ve siparişinizi
            oluşturabilirsiniz.
          </p>

          <a
            href="https://wa.me/905075738349?text=Merhaba%20DOKUNUVER%2C%20NFC%20%C3%BCr%C3%BCnleriniz%20hakk%C4%B1nda%20bilgi%20almak%20istiyorum."
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              background: "#25D366",
              color: "#ffffff",
              padding: "16px 26px",
              borderRadius: "13px",
              textDecoration: "none",
              fontSize: "15px",
              fontWeight: "800",
            }}
          >
            WhatsApp&apos;tan Yaz
          </a>
        </div>
      </section>

      {/* SÜREÇ */}
      <section
        style={{
          maxWidth: "960px",
          margin: "0 auto",
          padding: "20px 24px 100px",
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: "36px",
          }}
        >
          <div
            style={{
              color: "#087cf0",
              fontSize: "13px",
              fontWeight: "800",
              marginBottom: "10px",
            }}
          >
            SİPARİŞ SÜRECİ
          </div>

          <h2
            style={{
              margin: 0,
              fontSize: "clamp(28px, 5vw, 40px)",
              letterSpacing: "-1px",
            }}
          >
            Sipariş vermek çok kolay.
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "18px",
          }}
        >
          <StepCard
            number="01"
            title="Ürünü Belirleyin"
            description="İhtiyacınıza uygun DOKUNUVER ürününü seçin."
          />

          <StepCard
            number="02"
            title="Bilgileri İletin"
            description="Kullanılacak bağlantı veya bilgileri WhatsApp üzerinden bize gönderin."
          />

          <StepCard
            number="03"
            title="Hazırlayalım"
            description="NFC ve QR bağlantıları hazırlanmış ürününüzü kullanıma hazır hale getirelim."
          />
        </div>

        <div
          style={{
            marginTop: "32px",
            textAlign: "center",
            color: "#667085",
            fontSize: "13px",
            lineHeight: "1.7",
          }}
        >
          Tekli kartlar 249 TL • Duo NFC 349 TL • Kargo alıcıya aittir.
        </div>
      </section>

      {/* FOOTER */}
      <footer
        style={{
          background: "#ffffff",
          borderTop: "1px solid #eaecf0",
          padding: "32px 24px",
        }}
      >
        <div
          style={{
            maxWidth: "1180px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "20px",
            flexWrap: "wrap",
          }}
        >
          <a
            href="/"
            style={{
              textDecoration: "none",
            }}
          >
            <div
              style={{
                fontSize: "18px",
                fontWeight: "900",
                color: "#101828",
              }}
            >
              DOKUNUVER
            </div>

            <div
              style={{
                marginTop: "4px",
                fontSize: "12px",
                fontWeight: "700",
                color: "#087cf0",
              }}
            >
              Dokun. Bağlan.
            </div>
          </a>

          <div
            style={{
              display: "flex",
              gap: "20px",
              flexWrap: "wrap",
            }}
          >
            <a
              href="/iletisim"
              style={{
                color: "#475467",
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: "600",
              }}
            >
              İletişim
            </a>

            <a
              href="/gizlilik"
              style={{
                color: "#475467",
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: "600",
              }}
            >
              Gizlilik
            </a>
          </div>

          <div
            style={{
              fontSize: "13px",
              color: "#667085",
            }}
          >
            © 2026 DOKUNUVER. Tüm hakları saklıdır.
          </div>
        </div>
      </footer>
    </main>
  );
}

function StepCard({ number, title, description }) {
  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid #eaecf0",
        borderRadius: "20px",
        padding: "26px",
      }}
    >
      <div
        style={{
          width: "42px",
          height: "42px",
          borderRadius: "12px",
          background: "#eaf4ff",
          color: "#087cf0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "13px",
          fontWeight: "900",
          marginBottom: "20px",
        }}
      >
        {number}
      </div>

      <h3
        style={{
          margin: "0 0 9px",
          fontSize: "18px",
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
