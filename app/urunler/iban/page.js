export const metadata = {
  title: "IBAN NFC Kartı | DOKUNUVER",
  description:
    "DOKUNUVER IBAN NFC Kartı ile banka, hesap sahibi ve IBAN bilgilerinizi NFC veya QR üzerinden kolayca paylaşın.",
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
            whiteSpace: "nowrap",
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
            gridTemplateColumns:
              "repeat(auto-fit, minmax(320px, 1fr))",
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
                boxShadow:
                  "0 20px 50px rgba(16,24,40,0.12)",
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
              Banka, hesap sahibi ve IBAN bilgilerinizi
              müşterilerinizle NFC veya QR üzerinden kolayca
              paylaşın. Müşteriniz ödeme bilgilerinize tek
              dokunuşla ulaşsın ve gerekli bilgileri kolayca
              kopyalayabilsin.
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
              250 TL
            </div>

            <div
              style={{
                marginTop: "5px",
                color: "#667085",
                fontSize: "13px",
              }}
            >
              Hazır yapışkanlı arka yüz dahildir • Masaüstü stand +50 TL • Kargo alıcıya aittir.
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
              <div>✓ Hesap sahibi ve IBAN kolayca kopyalanabilir</div>
              <div>✓ Doğrulama sonrasında bilgiler kilitlenir</div>
              <div>✓ Hazır yapışkanlı arka yüz</div>
<div>✓ Masaüstü stand +50 TL ile eklenebilir</div>
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
                href="https://wa.me/905075738349?text=Merhaba%2C%20DOKUNUVER%20IBAN%20NFC%20Kart%C4%B1%20sipari%C5%9Fi%20vermek%20istiyorum."
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
                lineHeight: "1.1",
                letterSpacing: "-1.5px",
              }}
            >
              IBAN paylaşmayı kolaylaştırın.
            </h2>

            <p
              style={{
                margin: "18px 0 0",
                color: "#667085",
                fontSize: "16px",
                lineHeight: "1.7",
              }}
            >
              Uzun IBAN numaralarının elle yazılması veya farklı
              kanallardan gönderilmesi yerine ödeme bilgilerinizi
              tek bir sayfada sunun.
            </p>
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
              title="NFC + QR"
              description="Müşteriniz telefonunu karta yaklaştırabilir veya QR kodu okutarak IBAN sayfanıza ulaşabilir."
            />

            <FeatureCard
              number="02"
              title="Kolay Kopyalama"
              description="Hesap sahibi ve IBAN bilgileri ekrandan kolayca kopyalanabilir; uzun bilgileri elle yazma ihtiyacı azalır."
            />

            <FeatureCard
              number="03"
              title="Doğrulanır ve Kilitlenir"
              description="Banka, hesap sahibi ve IBAN bilgileriniz kontrol edilip doğrulandıktan sonra kilitlenir ve normal yönetim işlemleriyle değiştirilemez."
            />

            <FeatureCard
              number="04"
              title="Kontrollü Kullanım"
              description="Gerektiğinde IBAN kartınız pasife alınabilir ve daha sonra yeniden aktif hale getirilebilir."
            />
          </div>
        </div>
      </section>

      {/* NASIL ÇALIŞIR */}
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
            textAlign: "center",
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
            NASIL ÇALIŞIR?
          </div>

          <h2
            style={{
              margin: "0",
              fontSize: "clamp(32px, 5vw, 48px)",
              lineHeight: "1.1",
              letterSpacing: "-1.5px",
            }}
          >
            Üç adımda ödeme bilgilerinize erişim.
          </h2>

          <p
            style={{
              maxWidth: "620px",
              margin: "18px auto 48px",
              color: "#667085",
              fontSize: "16px",
              lineHeight: "1.7",
            }}
          >
            Kartı işletmenizde uygun bir noktaya yerleştirin.
            Müşteriniz doğrulanmış ödeme bilgilerinize kolayca
            ulaşsın.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "18px",
              textAlign: "left",
            }}
          >
            <StepCard
              number="01"
              title="Telefonu Yaklaştır"
              description="Müşteriniz NFC destekli telefonunu DOKUNUVER IBAN kartına yaklaştırır."
            />

            <StepCard
              number="02"
              title="Ödeme Sayfasını Aç"
              description="Telefonda çıkan NFC bildirimine dokunur. İsterse kart üzerindeki QR kodunu da kullanabilir."
            />

            <StepCard
              number="03"
              title="Bilgileri Kopyala"
              description="Banka, hesap sahibi ve IBAN bilgilerini görüntüler; hesap sahibini veya IBAN'ı kolayca kopyalayabilir."
            />
          </div>
        </div>
      </section>

      {/* DOĞRULAMA VE KİLİT */}
      <section
        style={{
          background: "#ffffff",
          padding: "90px 24px",
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
              border: "1px solid #fecdca",
              borderRadius: "22px",
              padding: "30px",
              background: "#fffafa",
            }}
          >
            <div
              style={{
                display: "inline-block",
                background: "#fef3f2",
                color: "#b42318",
                padding: "7px 12px",
                borderRadius: "999px",
                fontSize: "12px",
                fontWeight: "800",
                marginBottom: "16px",
              }}
            >
              DOĞRULAMA VE KİLİT
            </div>

            <h2
              style={{
                margin: "0 0 14px",
                fontSize: "25px",
              }}
            >
              Finansal bilgiler son kontrolden sonra kilitlenir.
            </h2>

            <p
              style={{
                margin: 0,
                color: "#667085",
                fontSize: "15px",
                lineHeight: "1.8",
              }}
            >
              IBAN kartı müşteriye atandıktan sonra banka, hesap
              sahibi ve IBAN bilgileri kontrol edilir. Bilgiler
              doğrulandıktan sonra kart kilitlenir ve bu finansal
              bilgiler normal yönetim işlemleriyle değiştirilemez.
              Böylece kullanım sırasında yanlışlıkla bilgi
              değiştirilmesi riski azaltılır.
            </p>
          </div>
        </div>
      </section>

      {/* KULLANICI EKRANI */}
      <section
        style={{
          background: "#f8fafc",
          padding: "90px 24px",
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
              background: "#ffffff",
              border: "1px solid #eaecf0",
              borderRadius: "22px",
              padding: "30px",
            }}
          >
            <div
              style={{
                display: "inline-block",
                background: "#ecfdf3",
                color: "#067647",
                padding: "7px 12px",
                borderRadius: "999px",
                fontSize: "12px",
                fontWeight: "800",
                marginBottom: "16px",
              }}
            >
              DOĞRULANMIŞ ÖDEME BİLGİLERİ
            </div>

            <h2
              style={{
                margin: "0 0 14px",
                fontSize: "25px",
              }}
            >
              Müşteriniz ne gördüğünü açıkça bilir.
            </h2>

            <p
              style={{
                margin: 0,
                color: "#667085",
                fontSize: "15px",
                lineHeight: "1.8",
              }}
            >
              IBAN sayfasında banka, hesap sahibi ve IBAN bilgileri
              açık şekilde gösterilir. Ayrıca bilgilerin doğrulanıp
              kilitlendiği ve doğrulama tarihi kullanıcıya
              gösterilir. Ödeme yapmadan önce bilgilerin kontrol
              edilmesi gerektiği de sayfada hatırlatılır.
            </p>
          </div>
        </div>
      </section>

      {/* SİPARİŞ CTA */}
      <section
        style={{
          background: "#ffffff",
          padding: "90px 24px 100px",
        }}
      >
        <div
          style={{
            maxWidth: "1180px",
            margin: "0 auto",
            background: "#101828",
            borderRadius: "28px",
            padding: "60px 28px",
            color: "#ffffff",
            textAlign: "center",
          }}
        >
          <div
            style={{
              color: "#fda29b",
              fontSize: "13px",
              fontWeight: "800",
              marginBottom: "14px",
            }}
          >
            DOKUNUVER
          </div>

          <h2
            style={{
              maxWidth: "700px",
              margin: "0 auto",
              fontSize: "clamp(30px, 5vw, 46px)",
              lineHeight: "1.1",
              letterSpacing: "-1.4px",
            }}
          >
            Ödeme bilgilerinizi tek dokunuş uzağa taşıyın.
          </h2>

          <p
            style={{
              maxWidth: "620px",
              margin: "20px auto 30px",
              color: "#98a2b3",
              fontSize: "16px",
              lineHeight: "1.7",
            }}
          >
            Sipariş için WhatsApp üzerinden bize ulaşın. Banka,
            hesap sahibi ve IBAN bilgilerinizi doğruladıktan sonra
            kartınızı kullanıma hazır şekilde hazırlayalım.
          </p>

          <a
            href="https://wa.me/905075738349?text=Merhaba%2C%20DOKUNUVER%20IBAN%20NFC%20Kart%C4%B1%20sipari%C5%9Fi%20vermek%20istiyorum."
            target="_blank"
            rel="noreferrer"
            style={{
              display: "inline-block",
              textDecoration: "none",
              background: "#25D366",
              color: "#ffffff",
              padding: "16px 26px",
              borderRadius: "13px",
              fontSize: "15px",
              fontWeight: "800",
            }}
          >
            WhatsApp'tan Sipariş Ver
          </a>
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

function StepCard({ number, title, description }) {
  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid #eaecf0",
        borderRadius: "20px",
        padding: "28px",
      }}
    >
      <div
        style={{
          width: "42px",
          height: "42px",
          borderRadius: "12px",
          background: "#fef3f2",
          color: "#b42318",
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
