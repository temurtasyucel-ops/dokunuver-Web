export const metadata = {
  title: "DOKUNUVER | NFC Kart ve Dijital Bağlantı Çözümleri",
  description:
    "Google Yorum, Instagram, WhatsApp, IBAN, İlan ve Duo NFC kartlarıyla işletmenizin dijital bağlantılarını müşterilerinize NFC ve QR üzerinden ulaştırın.",
};

const products = [
  {
    href: "/urunler/google-yorum",
    image: "/images/google-yorum-nfc.png",
    title: "Google Yorum Kartı",
    description:
      "Müşterilerinizi Google yorum sayfanıza NFC veya QR ile kolayca yönlendirin.",
    price: "249 TL",
    detail: "10 × 10 cm • NFC + QR",
  },
  {
    href: "/urunler/instagram",
    image: "/images/instagram-nfc.png",
    title: "Instagram Kartı",
    description:
      "Instagram profilinizi müşterilerinizle NFC veya QR üzerinden kolayca paylaşın.",
    price: "249 TL",
    detail: "10 × 10 cm • NFC + QR",
  },
  {
    href: "/urunler/whatsapp",
    image: "/images/whatsapp-nfc.png",
    title: "WhatsApp Kartı",
    description:
      "Müşterilerinizin numaranızı kaydetmeden WhatsApp bağlantınıza ulaşmasını kolaylaştırın.",
    price: "249 TL",
    detail: "10 × 10 cm • NFC + QR",
  },
  {
    href: "/urunler/iban",
    image: "/images/iban-nfc.png",
    title: "IBAN Kartı",
    description:
      "Doğrulanmış banka, hesap sahibi ve IBAN bilgilerinizi NFC veya QR üzerinden kolayca paylaşın.",
    price: "249 TL",
    detail: "10 × 10 cm • NFC + QR",
  },
  {
    href: "/urunler/ilan",
    image: "/images/ilan-nfc.png",
    title: "İlan Kartı",
    description:
      "İlan bağlantınızı NFC veya QR ile müşterilerinize doğrudan ulaştırın.",
    price: "249 TL",
    detail: "10 × 10 cm • NFC + QR",
  },
  {
    href: "/urunler/duo",
    image: "/images/duo-nfc.png",
    title: "Duo NFC Kartı",
    description:
      "Google + Instagram veya WhatsApp + IBAN seçeneklerinden ikisini tek kartta bir araya getirin.",
    price: "349 TL",
    detail: "10 × 10 cm • 2 NFC + 2 QR",
  },
];

export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        fontFamily: "Arial, sans-serif",
        color: "#101828",
      }}
    >
      <style>{`
        html {
          scroll-behavior: smooth;
        }

        .product-card {
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease,
            border-color 0.2s ease;
        }

        .product-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 40px rgba(16, 24, 40, 0.08);
          border-color: #d0d5dd !important;
        }

        @media (max-width: 900px) {
          .products-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
        }

        @media (max-width: 640px) {
          .site-header {
            padding: 18px 18px !important;
          }

          .header-button {
            padding: 10px 13px !important;
            font-size: 13px !important;
          }

          .hero-section {
            padding: 64px 18px 70px !important;
          }

          .hero-section h1 {
            letter-spacing: -2px !important;
          }

          .products-section,
          .how-section,
          .benefits-section,
          .contact-section {
            padding: 72px 18px !important;
          }

          .products-grid {
            grid-template-columns: 1fr !important;
          }

          .benefits-grid {
            grid-template-columns: 1fr !important;
          }

          .contact-box {
            padding: 48px 22px !important;
            border-radius: 22px !important;
          }

          .product-image-area {
  padding: 20px !important;
  height: 300px !important;
}

          .product-content {
            padding: 22px !important;
          }

          .site-footer-inner {
            flex-direction: column !important;
            align-items: flex-start !important;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          html {
            scroll-behavior: auto;
          }

          .product-card {
            transition: none;
          }

          .product-card:hover {
            transform: none;
          }
        }
      `}</style>

      {/* HEADER */}
      <header
        className="site-header"
        style={{
          maxWidth: "1180px",
          margin: "0 auto",
          padding: "22px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "18px",
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
          className="header-button"
          href="#urunler"
          style={{
            textDecoration: "none",
            background: "#101828",
            color: "#ffffff",
            padding: "11px 18px",
            borderRadius: "12px",
            fontSize: "14px",
            fontWeight: "700",
            whiteSpace: "nowrap",
          }}
        >
          Ürünleri İncele
        </a>
      </header>

      {/* HERO */}
      <section
        className="hero-section"
        style={{
          maxWidth: "1180px",
          margin: "0 auto",
          padding: "90px 24px 95px",
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
          NFC ÇÖZÜMLERİ
        </div>

        <h1
          style={{
            maxWidth: "900px",
            margin: "0 auto",
            fontSize: "clamp(42px, 7vw, 76px)",
            lineHeight: "1.03",
            letterSpacing: "-3px",
          }}
        >
          İşletmenizi
          <br />
          tek dokunuşla bağlayın.
        </h1>

        <p
          style={{
            maxWidth: "720px",
            margin: "28px auto 0",
            color: "#667085",
            fontSize: "18px",
            lineHeight: "1.7",
          }}
        >
          Google yorumlarından Instagram ve WhatsApp&apos;a, ödeme
          bilgilerinden ilanlarınıza kadar dijital bağlantılarınızı NFC
          ve QR ile müşterilerinize ulaştırın.
        </p>

        <div
          style={{
            marginTop: "36px",
            display: "flex",
            justifyContent: "center",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          <a
            href="#urunler"
            style={{
              textDecoration: "none",
              background: "#087cf0",
              color: "#ffffff",
              padding: "15px 24px",
              borderRadius: "13px",
              fontWeight: "800",
              fontSize: "15px",
            }}
          >
            Ürünleri İncele
          </a>

          <a
            href="#nasil-calisir"
            style={{
              textDecoration: "none",
              background: "#ffffff",
              color: "#344054",
              padding: "15px 24px",
              borderRadius: "13px",
              border: "1px solid #d0d5dd",
              fontWeight: "800",
              fontSize: "15px",
            }}
          >
            Nasıl Çalışır?
          </a>
        </div>

        <div
          style={{
            marginTop: "42px",
            display: "flex",
            justifyContent: "center",
            gap: "24px",
            flexWrap: "wrap",
            color: "#667085",
            fontSize: "13px",
            fontWeight: "700",
          }}
        >
          <span>✓ NFC + QR</span>
          <span>✓ İşletmenize özel hazırlanır</span>
          <span>✓ Stand veya yapışkanlı kullanım</span>
        </div>
      </section>

      {/* ÜRÜNLER */}
      <section
        id="urunler"
        className="products-section"
        style={{
          background: "#ffffff",
          padding: "100px 24px",
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
              marginBottom: "50px",
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
              DOKUNUVER ÜRÜNLERİ
            </div>

            <h2
              style={{
                margin: 0,
                fontSize: "clamp(32px, 5vw, 48px)",
                lineHeight: "1.1",
                letterSpacing: "-1.5px",
              }}
            >
              Bir dokunuş,
              <br />
              birçok çözüm.
            </h2>

            <p
              style={{
                marginTop: "18px",
                color: "#667085",
                fontSize: "17px",
                lineHeight: "1.7",
              }}
            >
              İşletmenizin ihtiyaç duyduğu dijital bağlantıları NFC
              teknolojisiyle müşterilerinize hızlı ve kolay şekilde
              ulaştırın.
            </p>
          </div>

          <div
            className="products-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: "18px",
            }}
          >
            {products.map((product) => (
              <a
                key={product.href}
                href={product.href}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                <ProductCard
                  image={product.image}
                  title={product.title}
                  description={product.description}
                  price={product.price}
                  detail={product.detail}
                />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* NASIL ÇALIŞIR */}
      <section
        id="nasil-calisir"
        className="how-section"
        style={{
          background: "#f8fafc",
          padding: "100px 24px",
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
              margin: 0,
              fontSize: "clamp(32px, 5vw, 48px)",
              lineHeight: "1.1",
              letterSpacing: "-1.5px",
            }}
          >
            Üç adımda kullanıma hazır.
          </h2>

          <p
            style={{
              maxWidth: "600px",
              margin: "18px auto 50px",
              color: "#667085",
              fontSize: "17px",
              lineHeight: "1.7",
            }}
          >
            Ürününüzü seçin, bilgilerinizi iletin. DOKUNUVER kartınızı
            işletmenize özel hazırlayalım.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "20px",
              textAlign: "left",
            }}
          >
            <StepCard
              number="01"
              title="Ürününü Seç"
              description="Google, Instagram, WhatsApp, IBAN, İlan veya Duo ürünlerinden ihtiyacınıza uygun olanı seçin."
            />

            <StepCard
              number="02"
              title="Bilgilerini İlet"
              description="Ürününüzde kullanılacak bağlantı veya bilgileri WhatsApp üzerinden bize iletin."
            />

            <StepCard
              number="03"
              title="Dokun ve Bağlan"
              description="Size özel hazırlanan DOKUNUVER ürününü NFC veya QR ile kullanmaya başlayın."
            />
          </div>
        </div>
      </section>

      {/* NEDEN DOKUNUVER */}
      <section
        className="benefits-section"
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
              maxWidth: "680px",
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
              NEDEN DOKUNUVER?
            </div>

            <h2
              style={{
                margin: "0 0 16px",
                fontSize: "clamp(32px, 5vw, 48px)",
                lineHeight: "1.1",
                letterSpacing: "-1.5px",
              }}
            >
              Dijital bağlantıları
              <br />
              daha kolay hale getirin.
            </h2>

            <p
              style={{
                margin: 0,
                color: "#667085",
                fontSize: "17px",
                lineHeight: "1.7",
              }}
            >
              Google, Instagram, WhatsApp, IBAN ve ilan
              bağlantılarınızı fiziksel DOKUNUVER ürünleriyle
              müşterilerinizin erişimine sunun.
            </p>
          </div>

          <div
            className="benefits-grid"
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "18px",
            }}
          >
            <BenefitCard
              number="01"
              title="NFC + QR"
              description="Müşterileriniz bağlantınıza ister telefonunu yaklaştırarak ister QR kodu okutarak ulaşabilir."
            />

            <BenefitCard
              number="02"
              title="Uygulama Gerektirmez"
              description="Desteklenen telefonlarda ekstra bir uygulama indirmeden NFC bağlantısına ulaşılabilir."
            />

            <BenefitCard
              number="03"
              title="İşletmenize Özel"
              description="DOKUNUVER ürününüz işletmenizin kullanmak istediği dijital bağlantı veya bilgilere özel hazırlanır."
            />

            <BenefitCard
              number="04"
              title="Kullanıma Hazır"
              description="NFC ve QR bağlantıları hazırlanmış şekilde teslim edilir; ürününüzü doğrudan kullanmaya başlayabilirsiniz."
            />
          </div>
        </div>
      </section>

      {/* SİPARİŞ */}
      <section
        className="contact-section"
        style={{
          background: "#ffffff",
          padding: "100px 24px",
        }}
      >
        <div
          className="contact-box"
          style={{
            maxWidth: "1180px",
            margin: "0 auto",
            background: "#101828",
            borderRadius: "28px",
            padding: "70px 32px",
            textAlign: "center",
            color: "#ffffff",
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
              maxWidth: "700px",
              margin: "0 auto",
              fontSize: "clamp(32px, 5vw, 50px)",
              lineHeight: "1.1",
              letterSpacing: "-1.5px",
            }}
          >
            DOKUNUVER&apos;ınızı seçin,
            <br />
            siparişinizi oluşturalım.
          </h2>

          <p
            style={{
              maxWidth: "620px",
              margin: "20px auto 32px",
              color: "#98a2b3",
              fontSize: "17px",
              lineHeight: "1.7",
            }}
          >
            Ürününüzü seçtikten sonra WhatsApp üzerinden bize ulaşın.
            İşletmenize özel bilgileri birlikte hazırlayalım ve
            DOKUNUVER ürününüzü kullanıma hazır hale getirelim.
          </p>

          <a
            href="https://wa.me/905075738349?text=Merhaba%20DOKUNUVER%2C%20NFC%20%C3%BCr%C3%BCnlerinizden%20sipari%C5%9F%20vermek%20istiyorum."
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
            WhatsApp&apos;tan Sipariş Ver
          </a>

          <div
            style={{
              marginTop: "18px",
              color: "#98a2b3",
              fontSize: "12px",
            }}
          >
            Tekli kartlar 249 TL • Duo NFC 349 TL • Kargo alıcıya aittir.
          </div>
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
          className="site-footer-inner"
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
              alignItems: "center",
              gap: "20px",
              flexWrap: "wrap",
            }}
          >
            <a
              href="/iletisim"
              style={{
                fontSize: "14px",
                fontWeight: "600",
                color: "#475467",
                textDecoration: "none",
              }}
            >
              İletişim
            </a>

            <a
              href="/gizlilik"
              style={{
                fontSize: "14px",
                fontWeight: "600",
                color: "#475467",
                textDecoration: "none",
              }}
            >
              Gizlilik
            </a>
                <a
  href="/kvkk"
  style={{
    fontSize: "14px",
    fontWeight: "600",
    color: "#475467",
    textDecoration: "none",
  }}
>
  KVKK
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

function ProductCard({
  image,
  title,
  description,
  price,
  detail,
}) {
  return (
    <div
      className="product-card"
      style={{
        height: "100%",
        border: "1px solid #eaecf0",
        borderRadius: "20px",
        background: "#ffffff",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        className="product-image-area"
        style={{
          background: "#f8fafc",
          padding: "28px",
          height: "330px",
          boxSizing: "border-box",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <img
          src={image}
          alt={`DOKUNUVER ${title}`}
          style={{
            display: "block",
            width: "auto",
            height: "auto",
            maxWidth: "100%",
            maxHeight: "100%",
            objectFit: "contain",
            borderRadius: "14px",
          }}
        />
      </div>

      <div
        className="product-content"
        style={{
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          flex: 1,
        }}
      >
        <h3
          style={{
            margin: "0 0 10px",
            fontSize: "20px",
            color: "#101828",
          }}
        >
          {title}
        </h3>

        <p
          style={{
            margin: 0,
            color: "#667085",
            lineHeight: "1.6",
            fontSize: "14px",
          }}
        >
          {description}
        </p>

        <div
          style={{
            marginTop: "22px",
            fontSize: "26px",
            fontWeight: "900",
            color: "#101828",
          }}
        >
          {price}
        </div>

        <div
          style={{
            marginTop: "6px",
            color: "#667085",
            fontSize: "13px",
            fontWeight: "600",
          }}
        >
          {detail}
        </div>

        <div
          style={{
            marginTop: "5px",
            color: "#98a2b3",
            fontSize: "12px",
          }}
        >
          Stand veya yapışkanlı kullanım • Kargo alıcıya aittir.
        </div>

        <div
          style={{
            marginTop: "auto",
            paddingTop: "22px",
          }}
        >
          <div
            style={{
              paddingTop: "18px",
              borderTop: "1px solid #eaecf0",
              color: "#087cf0",
              fontSize: "14px",
              fontWeight: "800",
            }}
          >
            Ürünü İncele →
          </div>
        </div>
      </div>
    </div>
  );
}
function StepCard({ number, title, description }) {
  return (
    <div
      className="step-card"
      style={{
        background: "#ffffff",
        border: "1px solid #eaecf0",
        borderRadius: "20px",
        padding: "32px",
      }}
    >
      <div
        style={{
          color: "#087cf0",
          fontSize: "13px",
          fontWeight: "900",
          marginBottom: "28px",
        }}
      >
        {number}
      </div>

      <h3
        style={{
          margin: "0 0 10px",
          fontSize: "20px",
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

function BenefitCard({ number, title, description }) {
  return (
    <div
      className="benefit-card"
      style={{
        padding: "28px",
        background: "#f8fafc",
        border: "1px solid #eaecf0",
        borderRadius: "20px",
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
          marginBottom: "22px",
        }}
      >
        {number}
      </div>

      <h3
        style={{
          margin: "0 0 10px",
          fontSize: "19px",
          color: "#101828",
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
