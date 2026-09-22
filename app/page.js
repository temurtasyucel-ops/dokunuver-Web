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
    </main>
  );
}
