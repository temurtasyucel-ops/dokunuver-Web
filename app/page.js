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
          bilgilerinden ilanlarınıza kadar dijital bağlantılarınızı NFC ve QR
          ile müşterilerinize ulaştırın.
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
  className="products-grid"
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: "18px",
  }}
>
      <a
  href="/urunler/google-yorum"
  style={{ textDecoration: "none", color: "inherit" }}
>
  <ProductCard
    image="/images/google-yorum-nfc.png"
    title="Google Yorum Kartı"
    description="Müşterilerinizi Google yorum sayfanıza NFC veya QR ile kolayca yönlendirin."
    price="249 TL"
  />
</a>

<a
  href="/urunler/instagram"
  style={{ textDecoration: "none", color: "inherit" }}
>
  <ProductCard
    image="/images/instagram-nfc.png"
    title="Instagram Kartı"
    description="Instagram profilinizi müşterilerinizle NFC veya QR üzerinden kolayca paylaşın."
    price="249 TL"
  />
</a>

<a
  href="/urunler/whatsapp"
  style={{ textDecoration: "none", color: "inherit" }}
>
  <ProductCard
    image="/images/whatsapp-nfc.png"
    title="WhatsApp Kartı"
    description="Müşterilerinizin sizinle WhatsApp üzerinden hızlıca iletişime geçmesini sağlayın."
    price="249 TL"
  />
</a>

<a
  href="/urunler/iban"
  style={{ textDecoration: "none", color: "inherit" }}
>
  <ProductCard
    image="/images/iban-nfc.png"
    title="IBAN Kartı"
    description="Ödeme bilgilerinizi yazma hatası olmadan NFC veya QR ile kolayca paylaşın."
    price="249 TL"
  />
</a>

<a
  href="/urunler/ilan"
  style={{ textDecoration: "none", color: "inherit" }}
>
  <ProductCard
    image="/images/ilan-nfc.png"
    title="İlan Kartı"
    description="İlan bağlantınızı NFC veya QR ile müşterilerinize doğrudan ulaştırın."
    price="249 TL"
  />
</a>

<a
  href="/urunler/duo"
  style={{ textDecoration: "none", color: "inherit" }}
>
  <ProductCard
    image="/images/duo-nfc.png"
    title="Duo NFC Kartı"
    description="İki farklı dijital bağlantıyı tek DOKUNUVER ürününde bir araya getirin."
    price="349 TL"
  />
</a>
      
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
        maxWidth: "650px",
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
        DOKUNUVER NFC çözümleriyle müşterileriniz ihtiyaç duydukları
        bağlantılara hızlı ve kolay şekilde ulaşır.
      </p>
    </div>

   <div
  className="benefits-grid"
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "18px",
  }}
>
      <BenefitCard
        number="01"
        title="Tek Dokunuş"
        description="Telefonu NFC ürününe yaklaştırmak bağlantıyı açmak için yeterlidir."
      />

      <BenefitCard
        number="02"
        title="Uygulama Gerektirmez"
        description="Müşterileriniz ekstra bir uygulama indirmeden bağlantınıza ulaşabilir."
      />

      <BenefitCard
        number="03"
        title="İşletmenize Özel"
        description="NFC ürününüz işletmenizin kullanmak istediği dijital bağlantıya göre hazırlanır."
      />

      <BenefitCard
        number="04"
        title="Kolay Kullanım"
        description="Google, Instagram, WhatsApp, IBAN ve ilan bağlantılarını paylaşmayı kolaylaştırır."
      />
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
function ProductCard({ image, title, description, price = "249 TL" }) {
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
        style={{
          background: "#f8fafc",
          padding: "32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          aspectRatio: "1 / 1",
        }}
      >
        <img
          src={image}
          alt={`DOKUNUVER ${title}`}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            borderRadius: "14px",
          }}
        />
      </div>

      <div
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
            margin: "0",
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
          NFC + QR • Stand veya yapışkanlı kullanım
        </div>

        <div
          style={{
            marginTop: "22px",
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
