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
              src="/images/duo-nfc.png"
              alt="DOKUNUVER Duo NFC Kartı"
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
              İki farklı dijital bağlantıyı, iki ayrı NFC alanı ve
              iki ayrı QR koduyla tek DOKUNUVER kartında bir araya
              getirin. Müşteriniz ihtiyacına göre kart üzerindeki
              ilgili alana dokunsun.
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
              <div>✓ İki farklı işlev tek kartta</div>
              <div>
                ✓ Google + Instagram veya WhatsApp + IBAN
              </div>
              <div>
                ✓ Masaüstü stand veya çift taraflı bant seçeneği
              </div>
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
              maxWidth: "720px",
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
                lineHeight: "1.1",
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
              Duo NFC Kartı iki farklı ürün kombinasyonuyla
              hazırlanır.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "20px",
            }}
          >
            <DuoOption
              number="01"
              title="Google + Instagram"
              description="Google yorum bağlantınızı ve Instagram profilinizi tek kart üzerinde müşterilerinize sunun."
              first="Google Yorum"
              second="Instagram"
              detail="Her iki bağlantı da DOKUNUVER Smart Link altyapısıyla fiziksel kart değiştirilmeden güncellenebilir."
            />

            <DuoOption
              number="02"
              title="WhatsApp + IBAN"
              description="WhatsApp iletişim bağlantınızı ve doğrulanmış IBAN bilgilerinizi tek kart üzerinde bir araya getirin."
              first="WhatsApp"
              second="IBAN"
              detail="WhatsApp numarası güncellenebilir. IBAN tarafında ise doğrulanan banka, hesap sahibi ve IBAN bilgileri kilitlenir."
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
                lineHeight: "1.1",
                letterSpacing: "-1.5px",
              }}
            >
              İki ihtiyacı tek kartta birleştirin.
            </h2>

            <p
              style={{
                margin: "18px 0 0",
                color: "#667085",
                fontSize: "16px",
                lineHeight: "1.7",
              }}
            >
              İki ayrı fiziksel kart kullanmak yerine müşterilerinize
              iki farklı işlevi tek bir DOKUNUVER ürünü üzerinden
              sunabilirsiniz.
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
              title="İki NFC Alanı"
              description="Kart üzerindeki iki ayrı NFC alanı iki farklı dijital bağlantı için kullanılır."
            />

            <FeatureCard
              number="02"
              title="İki QR Kodu"
              description="Her bağlantının kendi QR kodu bulunur. NFC kullanmak istemeyen müşteriler de ilgili bağlantıya ulaşabilir."
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

      {/* NASIL ÇALIŞIR */}
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
            textAlign: "center",
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
            İki bağlantı, tek kart.
          </h2>

          <p
            style={{
              maxWidth: "650px",
              margin: "18px auto 48px",
              color: "#667085",
              fontSize: "16px",
              lineHeight: "1.7",
            }}
          >
            Kart üzerindeki iki alan birbirinden bağımsız çalışır.
            Müşteriniz kullanmak istediği hizmetin NFC alanına
            telefonunu yaklaştırır.
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
              title="İlgili Alanı Seç"
              description="Müşteriniz kart üzerinde kullanmak istediği Google, Instagram, WhatsApp veya IBAN alanını seçer."
            />

            <StepCard
              number="02"
              title="Telefonu Yaklaştır"
              description="Telefonunu seçtiği NFC alanına yaklaştırır veya ilgili QR kodunu okutur."
            />

            <StepCard
              number="03"
              title="Bağlantıya Ulaş"
              description="Seçilen hizmete ait bağlantı açılır. Kartın diğer NFC alanı ise kendi bağlantısından bağımsız olarak çalışmaya devam eder."
            />
          </div>
        </div>
      </section>

      {/* DUO YÖNETİM MANTIĞI */}
      <section
        style={{
          background: "#f8fafc",
          padding: "90px 24px",
        }}
      >
        <div
          style={{
            maxWidth: "1000px",
            margin: "0 auto",
          }}
        >
          <div
            style={{
              textAlign: "center",
              marginBottom: "42px",
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
              BAĞLANTI YÖNETİMİ
            </div>

            <h2
              style={{
                margin: 0,
                fontSize: "clamp(30px, 5vw, 44px)",
                lineHeight: "1.1",
                letterSpacing: "-1.3px",
              }}
            >
              Her Duo seçeneği kendi kurallarına göre çalışır.
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "20px",
            }}
          >
            <InfoCard
              title="Google + Instagram"
              accent="#087cf0"
              background="#eaf4ff"
              description="Google yorum ve Instagram bağlantıları DOKUNUVER Smart Link altyapısı üzerinden yönetilir. Hedef bağlantılar değişirse fiziksel kartın yeniden üretilmesi gerekmez."
            />

            <InfoCard
              title="WhatsApp + IBAN"
              accent="#067647"
              background="#ecfdf3"
              description="WhatsApp bağlantısı gerektiğinde güncellenebilir. IBAN tarafındaki banka, hesap sahibi ve IBAN bilgileri ise doğrulama işleminden sonra kilitlenir ve normal yönetim işlemleriyle değiştirilemez."
            />
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
              color: "#53b1fd",
              fontSize: "13px",
              fontWeight: "800",
              marginBottom: "14px",
            }}
          >
            DOKUNUVER
          </div>

          <h2
            style={{
              maxWidth: "720px",
              margin: "0 auto",
              fontSize: "clamp(30px, 5vw, 46px)",
              lineHeight: "1.1",
              letterSpacing: "-1.4px",
            }}
          >
            İki dijital bağlantıyı tek kartta birleştirin.
          </h2>

          <p
            style={{
              maxWidth: "650px",
              margin: "20px auto 30px",
              color: "#98a2b3",
              fontSize: "16px",
              lineHeight: "1.7",
            }}
          >
            Sipariş için WhatsApp üzerinden bize ulaşın.
            Google + Instagram veya WhatsApp + IBAN Duo
            seçeneklerinden hangisini istediğinizi belirtin;
            kartınızı kullanıma hazır şekilde hazırlayalım.
          </p>

          <a
            href="https://wa.me/905075738349?text=Merhaba%2C%20DOKUNUVER%20Duo%20NFC%20Kart%C4%B1%20sipari%C5%9Fi%20vermek%20istiyorum."
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

function DuoOption({
  number,
  title,
  description,
  first,
  second,
  detail,
}) {
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

      <div
        style={{
          marginTop: "18px",
          paddingTop: "18px",
          borderTop: "1px solid #eaecf0",
          color: "#667085",
          fontSize: "13px",
          lineHeight: "1.7",
        }}
      >
        {detail}
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

function InfoCard({
  title,
  description,
  accent,
  background,
}) {
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
          display: "inline-block",
          padding: "7px 11px",
          borderRadius: "999px",
          background,
          color: accent,
          fontSize: "12px",
          fontWeight: "900",
          marginBottom: "16px",
        }}
      >
        {title}
      </div>

      <p
        style={{
          margin: 0,
          color: "#667085",
          fontSize: "14px",
          lineHeight: "1.8",
        }}
      >
        {description}
      </p>
    </div>
  );
}
