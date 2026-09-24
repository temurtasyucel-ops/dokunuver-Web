"use client";

import { useEffect, useState } from "react";
import QRCodeButton from "./QRCodeButton";
import BulkQRCodeButton from "./BulkQRCodeButton";

export default function SmartLinksPage() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
const [filter, setFilter] = useState("all");

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

  async function toggleStatus(link) {
    try {
      setError("");

      const token = localStorage.getItem("dokunuver_access_token");

     if (!token) {
  setError("Oturum bulunamadı.");
  return;
}

      const response = await fetch("/api/smart-links", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          code: link.code,
          active: !link.active,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Smart Link durumu değiştirilemedi."
        );
      }

      setLinks((currentLinks) =>
        currentLinks.map((item) =>
          item.code === link.code
            ? { ...item, active: data.active }
            : item
        )
      );
      } catch (err) {
    setError(err.message);
  }
}

const filteredLinks = links.filter((link) => {
  const searchText = search.toLowerCase().trim();

  const matchesSearch =
    !searchText ||
    (link.business_name || "").toLowerCase().includes(searchText) ||
    (link.code || "").toLowerCase().includes(searchText) ||
    (link.product_type || "").toLowerCase().includes(searchText);

  const matchesFilter =
  filter === "all" ||
  (filter === "stock" && link.status === "stock") ||
  (filter === "active" &&
    link.status !== "stock" &&
    link.active) ||
  (filter === "passive" &&
    link.status !== "stock" &&
    !link.active);

  return matchesSearch && matchesFilter;
});

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
            <div
  style={{
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    marginTop: "22px",
  }}
>
  <a
    href="/panel/smart-links/new"
    style={{
      display: "inline-block",
      padding: "12px 18px",
      background: "#087cf0",
      color: "#ffffff",
      textDecoration: "none",
      borderRadius: "10px",
      fontSize: "14px",
      fontWeight: "800",
    }}
  >
    + Yeni Smart Link
  </a>

  <a
    href="/panel/smart-links/bulk"
    style={{
      display: "inline-block",
      padding: "12px 18px",
      background: "#101828",
      color: "#ffffff",
      textDecoration: "none",
      borderRadius: "10px",
      fontSize: "14px",
      fontWeight: "800",
    }}
  >
    + Toplu Stok Oluştur
  </a>
</div>
      <div style={{ marginTop: "12px" }}>
  <BulkQRCodeButton links={links} />
</div>
      </div>

<div
  style={{
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    marginBottom: "28px",
  }}
>
  <input
    type="text"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    placeholder="İşletme adı veya kod ara..."
    style={{
      flex: "1 1 280px",
      padding: "12px 14px",
      border: "1px solid #d0d5dd",
      borderRadius: "10px",
      fontSize: "14px",
      color: "#101828",
      background: "#ffffff",
      boxSizing: "border-box",
    }}
  />

  <select
    value={filter}
    onChange={(e) => setFilter(e.target.value)}
    style={{
      padding: "12px 14px",
      border: "1px solid #d0d5dd",
      borderRadius: "10px",
      fontSize: "14px",
      color: "#344054",
      background: "#ffffff",
      cursor: "pointer",
    }}
  >
    <option value="all">Tümü</option>
<option value="stock">Stok</option>
<option value="active">Aktif</option>
<option value="passive">Pasif</option>
  </select>
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
{!loading &&
  !error &&
  links.length > 0 &&
  filteredLinks.length === 0 && (
    <div
      style={{
        padding: "32px",
        background: "#f8fafc",
        border: "1px solid #eaecf0",
        borderRadius: "18px",
        color: "#667085",
        textAlign: "center",
        fontSize: "15px",
      }}
    >
      Aramanızla veya seçtiğiniz filtreyle eşleşen Smart Link bulunamadı.
    </div>
  )}
      {!loading && !error && filteredLinks.length > 0 && (
        <div
          style={{
            display: "grid",
            gap: "16px",
          }}
        >
          {filteredLinks.map((link) => (
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
                    {link.status === "stock"
  ? "Stok Kartı"
  : link.business_name || "İsimsiz Kart"}
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
                  {link.status === "stock"
  ? "STOK"
  : link.active
  ? "AKTİF"
  : "PASİF"}
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

                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    flexWrap: "wrap",
                    marginTop: "18px",
                  }}
                >
                  <a
                    href={`/panel/smart-links/edit/${link.code}`}
                    style={{
                      display: "inline-block",
                      padding: "10px 16px",
                      background: "#087cf0",
                      color: "#ffffff",
                      textDecoration: "none",
                      borderRadius: "10px",
                      fontSize: "14px",
                      fontWeight: "800",
                    }}
                  >
                    Düzenle
                  </a>

                  <button
                    type="button"
                    onClick={() => toggleStatus(link)}
                    style={{
                      border: "1px solid #d0d5dd",
                      padding: "10px 16px",
                      background: "#ffffff",
                      color: link.active ? "#b42318" : "#027a48",
                      borderRadius: "10px",
                      fontSize: "14px",
                      fontWeight: "800",
                      cursor: "pointer",
                    }}
                  >
                    {link.active ? "Pasife Al" : "Aktif Et"}
                  </button>

                    <button
  type="button"
  onClick={() => {
    const nfcLink = `https://dokunuver.com.tr/x/${link.code}`;
    navigator.clipboard.writeText(nfcLink);
    alert("NFC linki kopyalandı.");
  }}
  style={{
    border: "1px solid #d0d5dd",
    padding: "10px 16px",
    background: "#ffffff",
    color: "#344054",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: "800",
    cursor: "pointer",
  }}
>
  NFC Linkini Kopyala
</button>

    
                    <QRCodeButton code={link.code} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
