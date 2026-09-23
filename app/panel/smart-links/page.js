"use client";

import { useEffect, useState } from "react";

export default function SmartLinksPage() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadLinks();
  }, []);

  async function loadLinks() {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("dokunuver_access_token");

      if (!token) {
        setError("Oturum bulunamadı.");
        return;
      }

      const response = await fetch("/api/smart-links", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Smart Link kayıtları alınamadı.");
      }

      setLinks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        maxWidth: "1180px",
        margin: "0 auto",
        padding: "50px 24px 80px",
        fontFamily: "Arial, sans-serif",
        color: "#101828",
      }}
    >
      <div style={{ marginBottom: "40px" }}>
        <div
          style={{
            color: "#087cf0",
            fontSize: "13px",
            fontWeight: "900",
            letterSpacing: "1px",
            marginBottom: "12px",
          }}
        >
          DOKUNUVER PANEL
        </div>

        <h1
          style={{
            margin: "0 0 12px",
            fontSize: "clamp(32px, 5vw, 46px)",
          }}
        >
          Smart Links
        </h1>

        <p
          style={{
            margin: 0,
            color: "#667085",
            fontSize: "16px",
          }}
        >
          NFC ve QR ürünlerinin dinamik yönlendirme bağlantılarını yönetin.
        </p>
      </div>

      {loading && <p>Yükleniyor...</p>}

      {!loading && error && (
        <div
          style={{
            padding: "18px",
            background: "#fff1f0",
            border: "1px solid #fecdca",
            borderRadius: "12px",
            color: "#b42318",
          }}
        >
          {error}
        </div>
      )}

      {!loading && !error && links.length === 0 && (
        <div
          style={{
            padding: "32px",
            background: "#f8fafc",
            border: "1px solid #eaecf0",
            borderRadius: "18px",
          }}
        >
          Henüz Smart Link bulunmuyor.
        </div>
      )}

      {!loading && !error && links.length > 0 && (
        <div
          style={{
            display: "grid",
            gap: "16px",
          }}
        >
          {links.map((link) => (
            <div
              key={link.id}
              style={{
                background: "#ffffff",
                border: "1px solid #eaecf0",
                borderRadius: "18px",
                padding: "22px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "20px",
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: "18px",
                      fontWeight: "800",
                      marginBottom: "6px",
                    }}
                  >
                    {link.business_name || "İsimsiz Kart"}
                  </div>

                  <div
                    style={{
                      color: "#667085",
                      fontSize: "14px",
                    }}
                  >
                    Kod: {link.code}
                  </div>
                </div>

                <div
                  style={{
                    padding: "7px 12px",
                    borderRadius: "999px",
                    background: link.active ? "#ecfdf3" : "#f2f4f7",
                    color: link.active ? "#027a48" : "#667085",
                    fontSize: "12px",
                    fontWeight: "800",
                    height: "fit-content",
                  }}
                >
                  {link.active ? "AKTİF" : "PASİF"}
                </div>
              </div>

              <div
                style={{
                  marginTop: "18px",
                  paddingTop: "18px",
                  borderTop: "1px solid #eaecf0",
                  color: "#475467",
                  fontSize: "14px",
                  lineHeight: "1.7",
                  wordBreak: "break-word",
                }}
              >
                <div>
                  <strong>Ürün:</strong> {link.product_type}
                </div>

                <div>
                  <strong>DOKUNUVER Link:</strong>{" "}
                  dokunuver.com.tr/x/{link.code}
                </div>

                <div>
                  <strong>Hedef:</strong> {link.target_url}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
