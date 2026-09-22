export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f7f9fc",
        fontFamily: "Arial, sans-serif",
        padding: "24px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "520px",
          textAlign: "center",
          background: "#ffffff",
          padding: "48px 28px",
          borderRadius: "28px",
          boxShadow: "0 12px 40px rgba(0,0,0,0.08)",
        }}
      >
        <div
          style={{
            width: "72px",
            height: "72px",
            margin: "0 auto 22px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #087cf0, #6c4cff)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: "34px",
          }}
        >
          ◉
        </div>

        <h1
          style={{
            fontSize: "38px",
            margin: "0",
            color: "#101828",
            letterSpacing: "-1px",
          }}
        >
          DOKUNUVER
        </h1>

        <p
          style={{
            fontSize: "20px",
            fontWeight: "600",
            color: "#087cf0",
            marginTop: "8px",
          }}
        >
          Dokun. Bağlan.
        </p>

        <p
          style={{
            fontSize: "17px",
            lineHeight: "1.6",
            color: "#667085",
            margin: "28px 0",
          }}
        >
          NFC teknolojisiyle işletmenizi dijital dünyaya
          tek dokunuşla bağlayın.
        </p>

        <a
          href="/i/demo"
          style={{
            display: "block",
            background: "#087cf0",
            color: "#ffffff",
            padding: "16px 22px",
            borderRadius: "14px",
            textDecoration: "none",
            fontWeight: "700",
            fontSize: "16px",
          }}
        >
          IBAN Kartını Test Et
        </a>

        <p
          style={{
            marginTop: "35px",
            fontSize: "12px",
            color: "#98a2b3",
          }}
        >
          DOKUNUVER NFC Platform
        </p>
      </div>
    </main>
  );
}
