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
        <div>
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
        </div>

        <a
          href="#urunler"
          style={{
            textDecoration: "none",
            background: "#101828",
            color: "#ffffff",
            padding: "11px 18px",
            borderRadius: "12px",
            fontSize: "14px",
            fontWeight: "700",
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
    padding: "90px 24px 110px",
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
            maxWidth: "850px",
            margin: "0 auto",
            fontSize: "clamp(42px, 7vw, 76px)",
            lineHeight: "1.03",
            letterSpacing: "-3px",
          }}
        >
          Tek dokunuşla
          <br />
          dijital dünyaya bağlan.
        </h1>

        <p
          style={{
            maxWidth: "650px",
            margin: "28px auto 0",
            color: "#667085",
            fontSize: "18px",
            lineHeight: "1.7",
          }}
        >
          DOKUNUVER NFC ürünleriyle müşterilerinizi Google yorumlarına,
          sosyal medya hesaplarınıza, ödeme bilgilerinize ve dijital
          içeriklerinize saniyeler içinde yönlendirin.
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
            NFC Ürünlerini Keşfet
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
  className="hero-nfc"
  style={{
    margin: "70px auto 0",
    width: "150px",
    height: "150px",
            borderRadius: "50%",
            background:
              "linear-gradient(135deg, #087cf0 0%, #6941c6 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 25px 60px rgba(8,124,240,0.25)",
          }}
        >
          <div
            style={{
              width: "90px",
              height: "90px",
              borderRadius: "50%",
              border: "3px solid rgba(255,255,255,0.9)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff",
              fontSize: "36px",
              fontWeight: "700",
            }}
          >
            N
          </div>
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
          margin: "0",
          fontSize: "clamp(32px, 5vw, 48px)",
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
        İşletmenizin ihtiyaç duyduğu dijital bağlantıları NFC teknolojisiyle
        müşterilerinize hızlı ve kolay şekilde ulaştırın.
      </p>
    </div>

    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "18px",
      }}
    >
      <a
  href="/urunler/google-yorum"
  style={{
    textDecoration: "none",
    color: "inherit",
  }}
>
  <ProductCard
    icon="★"
    title="Google Yorum"
    description="Müşterilerinizi Google yorum sayfanıza tek dokunuşla yönlendirin."
  />
</a>

      <a
  href="/urunler/instagram"
  style={{
    textDecoration: "none",
    color: "inherit",
  }}
>
  <ProductCard
    icon="◎"
    title="Instagram"
    description="Instagram profilinizi müşterilerinizle saniyeler içinde paylaşın."
  />
</a>

      <a
  href="/urunler/whatsapp"
  style={{
    textDecoration: "none",
    color: "inherit",
  }}
>
  <ProductCard
    icon="✆"
    title="WhatsApp"
    description="Müşterilerinizin sizinle WhatsApp üzerinden hızlıca iletişime geçmesini sağlayın."
  />
</a>

     <a
  href="/urunler/iban"
  style={{
    textDecoration: "none",
    color: "inherit",
  }}
>
  <ProductCard
    icon="₺"
    title="IBAN"
    description="Ödeme bilgilerinizi yazma hatası olmadan kolayca paylaşın."
  />
</a>

      <a
  href="/urunler/ilan"
  style={{
    textDecoration: "none",
    color: "inherit",
  }}
>
  <ProductCard
    icon="⌂"
    title="İlan"
    description="Araç veya gayrimenkul ilanınızı NFC ile doğrudan müşterilerinize açın."
  />
</a>
    </div>
  </div>
</section>
          {/* NASIL ÇALIŞIR */}
<section
  id="nasil-calisir"
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
        margin: "0",
        fontSize: "clamp(32px, 5vw, 48px)",
        letterSpacing: "-1.5px",
      }}
    >
      Bağlanmak bu kadar kolay.
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
      Uygulama indirmeye veya QR kod okutmaya gerek yok.
      Telefonunuzu DOKUNUVER ürününe yaklaştırmanız yeterli.
    </p>

    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        gap: "20px",
        textAlign: "left",
      }}
    >
      <StepCard
        number="01"
        title="Telefonunu Yaklaştır"
        description="NFC destekli telefonunuzu DOKUNUVER ürününün üzerine yaklaştırın."
      />

      <StepCard
        number="02"
        title="Bağlantıya Dokun"
        description="Telefon ekranında açılan bildirime dokunun. Ekstra bir uygulama gerekmez."
      />

      <StepCard
        number="03"
        title="Anında Bağlan"
        description="Google, Instagram, WhatsApp, IBAN veya ilan bağlantınız saniyeler içinde açılsın."
      />
    </div>
  </div>
</section>
          {/* İLETİŞİM / SİPARİŞ */}
<section
  style={{
    background: "#ffffff",
    padding: "100px 24px",
  }}
>
  <div
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
      İşletmenizi tek dokunuşla bağlayın.
    </h2>

    <p
      style={{
        maxWidth: "600px",
        margin: "20px auto 32px",
        color: "#98a2b3",
        fontSize: "17px",
        lineHeight: "1.7",
      }}
    >
      İşletmenize uygun DOKUNUVER NFC çözümünü belirlemek,
      ürünler hakkında bilgi almak veya sipariş vermek için
      bizimle iletişime geçin.
    </p>

    <a
      href="https://wa.me/905075738349?text=Merhaba%20DOKUNUVER%2C%20NFC%20%C3%BCr%C3%BCnleriniz%20hakk%C4%B1nda%20bilgi%20almak%20istiyorum."
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
      WhatsApp'tan İletişime Geç
    </a>

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
    <div>
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
function ProductCard({ icon, title, description }) {
  return (
  <div
  className="product-card"
  style={{
    padding: "28px",
    border: "1px solid #eaecf0",
    borderRadius: "20px",
    background: "#ffffff",
  }}
>
      <div
        style={{
          width: "48px",
          height: "48px",
          borderRadius: "14px",
          background: "#eaf4ff",
          color: "#087cf0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "22px",
          fontWeight: "800",
          marginBottom: "22px",
        }}
      >
        {icon}
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
          lineHeight: "1.6",
          fontSize: "14px",
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
