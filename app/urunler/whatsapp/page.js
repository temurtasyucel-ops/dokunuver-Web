import { getSiteContent } from "../../../lib/site-content-server";
import { money } from "../../../lib/site-content.mjs";
import { ProductPrice, CampaignBanner } from "../../components/SiteCommerce";
export const dynamic = "force-dynamic";

export const metadata = {
  title: "WhatsApp NFC Kartı | DOKUNUVER",
  description:
    "DOKUNUVER WhatsApp NFC Kartı ile müşterilerinizin işletmenizle WhatsApp üzerinden NFC veya QR ile kolayca iletişime geçmesini sağlayın.",
};

export default async function WhatsAppPage() {
  const content = await getSiteContent();
  const { settings } = content;
  const product = content.products.find(p => p.id === "whatsapp");
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
      <CampaignBanner banner={content.banner} />

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
  "repeat(auto-fit, minmax(280px, 1fr))",
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
              src={product.image}
              alt="DOKUNUVER WhatsApp NFC Kartı"
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
                background: "#ecfdf3",
                color: "#067647",
                fontSize: "13px",
                fontWeight: "800",
                marginBottom: "20px",
              }}
            >
              WHATSAPP NFC
            </div>

            <h1
              style={{
                margin: "0",
                fontSize: "clamp(38px, 5vw, 58px)",
                lineHeight: "1.05",
                letterSpacing: "-2px",
              }}
            >
              {product.title}
            </h1>

            <p
              style={{
                margin: "22px 0 0",
                color: "#667085",
                fontSize: "17px",
                lineHeight: "1.7",
              }}
            >
              {product.description}
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
              <ProductPrice product={product} />
            </div>

            <div
              style={{
                marginTop: "5px",
                color: "#667085",
                fontSize: "13px",
              }}
            >
              Hazır yapışkanlı arka yüz dahildir • Masaüstü stand +{money(settings.stand_price)} • {settings.shipping_text}
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
              <div>✓ WhatsApp numaranıza özel hazırlanır</div>
              <div>✓ Hazır yapışkanlı arka yüz</div>
<div>✓ Masaüstü stand +{money(settings.stand_price)} ile eklenebilir</div>
              <div>
                ✓ WhatsApp numarası kart değiştirilmeden güncellenebilir
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
                href="https://wa.me/905075738349?text=Merhaba%2C%20DOKUNUVER%20WhatsApp%20NFC%20Kart%C4%B1%20sipari%C5%9Fi%20vermek%20istiyorum."
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
              WHATSAPP KARTI
            </div>

            <h2
              style={{
                margin: "0",
                fontSize: "clamp(32px, 5vw, 48px)",
                lineHeight: "1.1",
                letterSpacing: "-1.5px",
              }}
            >
              Müşterileriniz size daha kolay ulaşsın.
            </h2>

            <p
              style={{
                margin: "18px 0 0",
                color: "#667085",
                fontSize: "16px",
                lineHeight: "1.7",
              }}
            >
              Telefon numaranızın elle yazılması veya rehbere
              kaydedilmesi gibi ekstra adımları azaltın.
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
              description="Müşteriniz telefonunu karta yaklaştırabilir veya QR kodu okutarak WhatsApp bağlantınıza ulaşabilir."
            />

            <FeatureCard
              number="02"
              title="Numara Yazmaya Gerek Yok"
              description="Müşteriniz telefon numaranızı manuel olarak yazmadan veya rehbere kaydetmeden WhatsApp bağlantınıza ulaşabilir."
            />

            <FeatureCard
              number="03"
              title="WhatsApp'a Yönlendirme"
              description="Kartınız işletmenizin kullanacağı WhatsApp iletişim bağlantısına özel olarak hazırlanır."
            />

            <FeatureCard
  number="04"
  title="Kullanıma Hazır"
  description={`NFC ve QR bağlantıları hazırlanmış, arka yüzü hazır yapışkanlı şekilde teslim edilir. Masaüstü stand +${money(settings.stand_price)} ile eklenebilir.`}
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
              color: "#067647",
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
            Üç adımda WhatsApp iletişimi.
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
            Müşteriniz iletişim kanalınıza saniyeler içinde ulaşsın.
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
              description="Müşteriniz NFC destekli telefonunu DOKUNUVER WhatsApp kartına yaklaştırır."
            />

            <StepCard
              number="02"
              title="Bağlantıyı Aç"
              description="Telefonda çıkan NFC bildirimine dokunur. İsterse kart üzerindeki QR kodunu da kullanabilir."
            />

            <StepCard
              number="03"
              title="WhatsApp'a Ulaş"
              description="İşletmenizin WhatsApp bağlantısı açılır ve müşteriniz sizinle iletişime geçebilir."
            />
          </div>
        </div>
      </section>

      {/* SMART LINK */}
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
              border: "1px solid #d0d5dd",
              borderRadius: "22px",
              padding: "30px",
              background: "#ffffff",
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
              DOKUNUVER SMART LINK
            </div>

            <h2
              style={{
                margin: "0 0 14px",
                fontSize: "25px",
              }}
            >
              Numaranız değişse bile kartınız aynı kalır.
            </h2>

            <p
              style={{
                margin: 0,
                color: "#667085",
                fontSize: "15px",
                lineHeight: "1.8",
              }}
            >
              İşletmenizin WhatsApp numarası değişirse fiziksel
              NFC kartınızı yeniden üretmeniz gerekmez. DOKUNUVER
              bağlantısındaki WhatsApp hedefi güncellenerek mevcut
              kart kullanılmaya devam edebilir.
            </p>
          </div>
        </div>
      </section>

      {/* SİPARİŞ CTA */}
      <section
        style={{
          background: "#ffffff",
          padding: "20px 24px 100px",
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
              color: "#6ce9a6",
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
            WhatsApp iletişiminizi tek dokunuş uzağa taşıyın.
          </h2>

          <p
            style={{
              maxWidth: "600px",
              margin: "20px auto 30px",
              color: "#98a2b3",
              fontSize: "16px",
              lineHeight: "1.7",
            }}
          >
            Sipariş için WhatsApp üzerinden bize ulaşın.
            Kullanmak istediğiniz WhatsApp numarasını aldıktan
            sonra NFC ve QR bağlantılarınızı hazırlayıp kartınızı
            kullanıma hazır hale getirelim.
          </p>

          <a
            href="https://wa.me/905075738349?text=Merhaba%2C%20DOKUNUVER%20WhatsApp%20NFC%20Kart%C4%B1%20sipari%C5%9Fi%20vermek%20istiyorum."
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
          background: "#ecfdf3",
          color: "#067647",
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

