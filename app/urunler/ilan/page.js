export const metadata = {
  title: "İlan NFC Kartı | DOKUNUVER",
  description:
    "DOKUNUVER İlan NFC Kartı ile ilan bağlantınızı müşterilerinizle NFC veya QR üzerinden kolayca paylaşın.",
};

export default function IlanPage() {
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
              src="/images/ilan-nfc.png"
              alt="DOKUNUVER İlan NFC Kartı"
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
                background: "#fff8db",
                color: "#8a6800",
                fontSize: "13px",
                fontWeight: "800",
                marginBottom: "20px",
              }}
            >
              İLAN NFC
            </div>

            <h1
              style={{
                margin: "0",
                fontSize: "clamp(38px, 5vw, 58px)",
                lineHeight: "1.05",
                letterSpacing: "-2px",
              }}
            >
              İlan Kartı
            </h1>

            <p
              style={{
                margin: "22px 0 0",
                color: "#667085",
                fontSize: "17px",
                lineHeight: "1.7",
              }}
            >
              Araç, gayrimenkul veya paylaşmak istediğiniz diğer ilan
              bağlantılarını NFC veya QR üzerinden kolayca ulaştırın.
              Müşteriniz uzun bağlantıları aramak yerine ilanınıza
              tek dokunuşla ulaşsın.
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
              <div>✓ İlan bağlantınıza özel hazırlanır</div>
              <div>✓ Hazır yapışkanlı arka yüz</div>
<div>✓ Masaüstü stand +50 TL ile eklenebilir</div>
              <div>
                ✓ İlan bağlantısı kart değiştirilmeden güncellenebilir
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
                href="https://wa.me/905075738349?text=Merhaba%2C%20DOKUNUVER%20%C4%B0lan%20NFC%20Kart%C4%B1%20sipari%C5%9Fi%20vermek%20istiyorum."
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
                color: "#8a6800",
                fontSize: "13px",
                fontWeight: "800",
                marginBottom: "12px",
              }}
            >
              İLAN KARTI
            </div>

            <h2
              style={{
                margin: "0",
                fontSize: "clamp(32px, 5vw, 48px)",
                lineHeight: "1.1",
                letterSpacing: "-1.5px",
              }}
            >
              İlanınızı paylaşmayı kolaylaştırın.
            </h2>

            <p
              style={{
                margin: "18px 0 0",
                color: "#667085",
                fontSize: "16px",
                lineHeight: "1.7",
              }}
            >
              İlan numarası, kullanıcı adı veya uzun internet
              adreslerini müşterilerinize tek tek göndermek yerine
              doğrudan ilan sayfanıza yönlendirin.
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
              description="Telefon karta yaklaştırılarak veya QR kod okutularak ilan bağlantınıza kolayca ulaşılabilir."
            />

            <FeatureCard
              number="02"
              title="Uzun Linklere Son"
              description="İlan numarası veya uzun internet adreslerini müşterilerinizle manuel olarak paylaşmanız gerekmez."
            />

            <FeatureCard
              number="03"
              title="İlanınıza Özel"
              description="Kartınız belirlediğiniz ilan bağlantısına özel olarak hazırlanır."
            />

            <FeatureCard
  number="04"
  title="Kullanıma Hazır"
  description="NFC ve QR bağlantıları hazırlanmış, arka yüzü hazır yapışkanlı şekilde teslim edilir. Masaüstü stand +50 TL ile eklenebilir."
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
              color: "#8a6800",
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
            Üç adımda ilanınıza ulaşsınlar.
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
            Kartı uygun bir noktaya yerleştirin. İlanınızı görmek
            isteyen kişi bağlantınıza saniyeler içinde ulaşsın.
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
              description="Kullanıcı NFC destekli telefonunu DOKUNUVER İlan Kartına yaklaştırır."
            />

            <StepCard
              number="02"
              title="Bağlantıyı Aç"
              description="Telefonda çıkan NFC bildirimine dokunur. İsterse kart üzerindeki QR kodunu da kullanabilir."
            />

            <StepCard
              number="03"
              title="İlanı Görüntüle"
              description="Belirlediğiniz ilan sayfası açılır ve kullanıcı ilan detaylarını doğrudan görüntüleyebilir."
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
              border: "1px solid #eadb9c",
              borderRadius: "22px",
              padding: "30px",
              background: "#fffdf5",
            }}
          >
            <div
              style={{
                display: "inline-block",
                background: "#fff8db",
                color: "#8a6800",
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
              İlanınız değişse bile kartınız aynı kalır.
            </h2>

            <p
              style={{
                margin: 0,
                color: "#667085",
                fontSize: "15px",
                lineHeight: "1.8",
              }}
            >
              Mevcut ilanınız sona erdiğinde veya yeni bir ilana
              yönlendirmek istediğinizde fiziksel NFC kartınızı yeniden
              üretmeniz gerekmez. DOKUNUVER bağlantısındaki hedef ilan
              adresi güncellenerek mevcut kart kullanılmaya devam edebilir.
            </p>
          </div>
        </div>
      </section>

      {/* KULLANIM ALANLARI */}
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
                color: "#8a6800",
                fontSize: "12px",
                fontWeight: "800",
                marginBottom: "14px",
              }}
            >
              KULLANIM ALANLARI
            </div>

            <h2
              style={{
                margin: "0 0 14px",
                fontSize: "25px",
              }}
            >
              Tek bir ilan türüyle sınırlı değildir.
            </h2>

            <p
              style={{
                margin: 0,
                color: "#667085",
                fontSize: "15px",
                lineHeight: "1.8",
              }}
            >
              Araç, gayrimenkul veya müşterilerinize doğrudan
              göstermek istediğiniz uygun bir ilan bağlantısı için
              kullanılabilir. NFC kartı, belirlediğiniz internet
              adresine yönlendirme yapar.
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
              color: "#f5d565",
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
            İlanınızı tek dokunuş uzağa taşıyın.
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
            Sipariş için WhatsApp üzerinden bize ulaşın. Kullanmak
            istediğiniz ilan bağlantısını aldıktan sonra NFC ve QR
            bağlantılarınızı hazırlayıp kartınızı kullanıma hazır
            hale getirelim.
          </p>

          <a
            href="https://wa.me/905075738349?text=Merhaba%2C%20DOKUNUVER%20%C4%B0lan%20NFC%20Kart%C4%B1%20sipari%C5%9Fi%20vermek%20istiyorum."
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
          color: "#8a6800",
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
          background: "#fff8db",
          color: "#8a6800",
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
