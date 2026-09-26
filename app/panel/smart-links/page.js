"use client";

import { useEffect, useState } from "react";
import QRCodeButton from "./QRCodeButton";
import BulkQRCodeButton from "./BulkQRCodeButton";
import LogoutButton from "../LogoutButton";

function formatSmartBatchDate(batchCode) {
  const match =
    /^SMART-(\d{2})(\d{2})(\d{2})-\d+$/.exec(
      batchCode
    );

  if (!match) return "";

  const [, year, month, day] = match;

  return `${day}.${month}.20${year}`;
}

export default function SmartLinksPage() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
const linksPerPage = 20;

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

async function cancelStock(link) {
  const confirmed = window.confirm(
    `${link.code} kodlu stok kartını iptal etmek istediğinize emin misiniz?\n\nBu işlem kartı stoktan çıkaracaktır.`
  );

  if (!confirmed) {
    return;
  }

  try {
    setError("");

    const token = localStorage.getItem("dokunuver_access_token");

    if (!token) {
      setError("Oturum bulunamadı.");
      return;
    }

    const response = await fetch("/api/smart-links", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        code: link.code,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || "Stok kartı iptal edilemedi."
      );
    }

    setLinks((currentLinks) =>
      currentLinks.map((item) =>
        item.code === link.code
          ? {
              ...item,
              status: data.status,
              active: data.active,
            }
          : item
      )
    );
  } catch (err) {
    setError(err.message);
  }
}

const stockLinks = links.filter(
  (link) => link.status === "stock"
);
const statusCounts = {
  total: links.length,

  active: links.filter(
    (link) =>
      link.status === "assigned" &&
      link.active
  ).length,

  passive: links.filter(
    (link) =>
      link.status === "assigned" &&
      !link.active
  ).length,

  stock: links.filter(
    (link) => link.status === "stock"
  ).length,

  cancelled: links.filter(
    (link) => link.status === "cancelled"
  ).length,
};
const stockCounts = {
  total: stockLinks.length,
  google: stockLinks.filter(
    (link) => link.product_type === "google"
  ).length,
  instagram: stockLinks.filter(
    (link) => link.product_type === "instagram"
  ).length,
  whatsapp: stockLinks.filter(
    (link) => link.product_type === "whatsapp"
  ).length,
  ilan: stockLinks.filter(
    (link) => link.product_type === "ilan"
  ).length,
  diger: stockLinks.filter(
    (link) => link.product_type === "diger"
  ).length,
};
const filteredLinks = links.filter((link) => {
  if (
    selectedBatch &&
    link.batch_code !== selectedBatch
  ) {
    return false;
  }

  const searchText = search.toLowerCase().trim();

  const matchesSearch =
  !searchText ||
  (link.business_name || "").toLowerCase().includes(searchText) ||
  (link.code || "").toLowerCase().includes(searchText) ||
  (link.product_type || "").toLowerCase().includes(searchText) ||
  (link.batch_code || "").toLowerCase().includes(searchText);

 const matchesFilter =
  filter === "all" ||
  (filter === "stock" && link.status === "stock") ||
  (filter === "cancelled" && link.status === "cancelled") ||
  (filter === "active" &&
    link.status === "assigned" &&
    link.active) ||
  (filter === "passive" &&
    link.status === "assigned" &&
    !link.active);

return matchesSearch && matchesFilter;
});
  useEffect(() => {
  setCurrentPage(1);
}, [search, filter, selectedBatch]);

const totalPages = Math.ceil(
  filteredLinks.length / linksPerPage
);

const safeCurrentPage = Math.min(
  currentPage,
  Math.max(totalPages, 1)
);

const startIndex =
  (safeCurrentPage - 1) * linksPerPage;

const paginatedLinks = filteredLinks.slice(
  startIndex,
  startIndex + linksPerPage
);
  const productionBatches = Object.values(
  links.reduce((groups, link) => {
    if (!link.batch_code) {
      return groups;
    }

    if (!groups[link.batch_code]) {
      groups[link.batch_code] = {
        batchCode: link.batch_code,
        productType: link.product_type,
        links: [],
      };
    }

    groups[link.batch_code].links.push(link);

    return groups;
  }, {})
).sort((a, b) =>
  b.batchCode.localeCompare(a.batchCode)
);
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
      <>
  <header
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: "20px",
      marginBottom: "38px",
    }}
  >
    <div>
      <div
        style={{
          fontSize: "22px",
          fontWeight: "900",
          letterSpacing: "0.3px",
          color: "#101828",
        }}
      >
        DOKUNUVER
      </div>

      <div
        style={{
          marginTop: "4px",
          color: "#087cf0",
          fontSize: "12px",
          fontWeight: "800",
        }}
      >
        Dokun. Bağlan.
      </div>
    </div>

    <LogoutButton />
  </header>
<div
  style={{
    display: "flex",
    gap: "8px",
    marginBottom: "16px",
    flexWrap: "wrap",
  }}
>
  <a
    href="/panel"
    style={{
      padding: "10px 16px",
      border: "1px solid #d0d5dd",
      borderRadius: "10px",
      background: "#ffffff",
      color: "#344054",
      textDecoration: "none",
      fontSize: "14px",
      fontWeight: "800",
    }}
  >
    IBAN Kartları
  </a>

  <a
    href="/panel/smart-links"
    style={{
      padding: "10px 16px",
      border: "1px solid #087cf0",
      borderRadius: "10px",
      background: "#087cf0",
      color: "#ffffff",
      textDecoration: "none",
      fontSize: "14px",
      fontWeight: "800",
    }}
  >
    Smart Links
  </a>
</div>
  <section
    style={{
      background: "#101828",
      color: "#ffffff",
      borderRadius: "22px",
      padding: "34px",
      marginBottom: "20px",
    }}
  >
    <div
      style={{
        color: "#53b1fd",
        fontSize: "12px",
        fontWeight: "900",
        letterSpacing: "1px",
        marginBottom: "10px",
      }}
    >
      DOKUNUVER PANEL
    </div>

    <h1
      style={{
        margin: "0 0 12px",
        fontSize: "clamp(28px, 4vw, 34px)",
        color: "#ffffff",
      }}
    >
      Smart Links Yönetimi
    </h1>

    <p
      style={{
        margin: 0,
        color: "#d0d5dd",
        fontSize: "15px",
        lineHeight: "1.6",
      }}
    >
      NFC ve QR ürünlerinin dinamik yönlendirme bağlantılarını
      tek noktadan yönetin.
    </p>

    <div
      style={{
        display: "flex",
        gap: "10px",
        flexWrap: "wrap",
        marginTop: "24px",
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
          background: "#ffffff",
          color: "#101828",
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
  </section>
</>
      <div
  style={{
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    marginTop: "20px",
    marginBottom: "12px",
  }}
>
  <div className="stock-summary-card">
    <strong>Toplam</strong>
    <span>{statusCounts.total}</span>
  </div>

  <div className="stock-summary-card">
    <strong>Aktif</strong>
    <span>{statusCounts.active}</span>
  </div>

  <div className="stock-summary-card">
    <strong>Pasif</strong>
    <span>{statusCounts.passive}</span>
  </div>

  <div className="stock-summary-card">
    <strong>Stok</strong>
    <span>{statusCounts.stock}</span>
  </div>

  <div className="stock-summary-card">
    <strong>İptal</strong>
    <span>{statusCounts.cancelled}</span>
  </div>
</div>
<div
  style={{
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    marginTop: "20px",
    marginBottom: "20px",
  }}
>
  <div className="stock-summary-card">
    <strong>Toplam Stok</strong>
    <span>{stockCounts.total}</span>
  </div>

  <div className="stock-summary-card">
    <strong>Google</strong>
    <span>{stockCounts.google}</span>
  </div>

  <div className="stock-summary-card">
    <strong>Instagram</strong>
    <span>{stockCounts.instagram}</span>
  </div>

  <div className="stock-summary-card">
    <strong>WhatsApp</strong>
    <span>{stockCounts.whatsapp}</span>
  </div>

  <div className="stock-summary-card">
    <strong>İlan</strong>
    <span>{stockCounts.ilan}</span>
  </div>

  <div className="stock-summary-card">
    <strong>Diğer</strong>
    <span>{stockCounts.diger}</span>
  </div>
</div>
  {productionBatches.length > 0 && (
  <section
    style={{
      marginBottom: "28px",
      padding: "24px",
      background: "#ffffff",
      border: "1px solid #eaecf0",
      borderRadius: "18px",
    }}
  >
    <div style={{ marginBottom: "18px" }}>
      <h2
        style={{
          margin: 0,
          fontSize: "21px",
        }}
      >
        Üretim Partileri
      </h2>

      <p
        style={{
          margin: "6px 0 0",
          color: "#667085",
          fontSize: "14px",
        }}
      >
        Toplu oluşturulan Smart Link kartlarının üretim geçmişi.
      </p>
    </div>

    <div
      style={{
        display: "grid",
        gap: "12px",
      }}
    >
      {productionBatches.map((batch) => (
        <div
          key={batch.batchCode}
          style={{
            border: "1px solid #eaecf0",
            borderRadius: "14px",
            padding: "18px",
            display: "flex",
            justifyContent: "space-between",
            gap: "16px",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "17px",
                fontWeight: "800",
              }}
            >
              📦 {batch.batchCode}
            </div>

            <div
              style={{
                marginTop: "6px",
                color: "#667085",
                fontSize: "13px",
                fontWeight: "700",
              }}
            >
              {formatSmartBatchDate(batch.batchCode)}
              {" • "}
              {batch.productType?.toLocaleUpperCase("tr-TR")}
              {" • "}
              Toplam: {batch.links.length}
              {" • "}
              Stokta:{" "}
              {
                batch.links.filter(
                  (link) => link.status === "stock"
                ).length
              }
              {" • "}
              Atandı:{" "}
              {
                batch.links.filter(
                  (link) => link.status === "assigned"
                ).length
              }
              {" • "}
              İptal:{" "}
              {
                batch.links.filter(
                  (link) => link.status === "cancelled"
                ).length
              }
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: "10px",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                padding: "7px 11px",
                borderRadius: "999px",
                background: "#fff7ed",
                color: "#c2410c",
                border: "1px solid #fed7aa",
                fontSize: "12px",
                fontWeight: "800",
              }}
            >
              Üretim Partisi
            </div>

            <button
              type="button"
              onClick={() => {
                setSelectedBatch(batch.batchCode);
                setFilter("all");
                setSearch("");

                setTimeout(() => {
                  document
                    .getElementById("smart-link-list")
                    ?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                }, 50);
              }}
              style={{
                border: "1px solid #d0d5dd",
                padding: "10px 16px",
                background: "#ffffff",
                color: "#344054",
                borderRadius: "10px",
                fontSize: "13px",
                fontWeight: "800",
                cursor: "pointer",
              }}
            >
              Kartları Gör
            </button>

            <BulkQRCodeButton
              links={batch.links}
              batchCode={batch.batchCode}
            />
          </div>
        </div>
      ))}

      <div id="smart-link-list" />

      {selectedBatch && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "12px",
            flexWrap: "wrap",
            marginBottom: "18px",
            padding: "14px 16px",
            background: "#eff8ff",
            border: "1px solid #b2ddff",
            borderRadius: "12px",
          }}
        >
          <div
            style={{
              color: "#175cd3",
              fontSize: "14px",
              fontWeight: "800",
            }}
          >
            📦 Seçili Parti: {selectedBatch}
          </div>

          <button
            type="button"
            onClick={() => {
              setSelectedBatch(null);
              setFilter("all");
              setSearch("");
            }}
            style={{
              border: "1px solid #d0d5dd",
              padding: "9px 14px",
              background: "#ffffff",
              color: "#344054",
              borderRadius: "9px",
              fontSize: "13px",
              fontWeight: "800",
              cursor: "pointer",
            }}
          >
            Filtreyi Temizle
          </button>
        </div>
      )}
    </div>
  </section>
)}

          
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
    placeholder="İşletme, kod, ürün veya parti ara..."
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
<option value="cancelled">İptal</option>
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
          {paginatedLinks.map((link) => (
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

{link.batch_code && (
  <div
    style={{
      marginTop: "5px",
      color: "#667085",
      fontSize: "12px",
      fontWeight: "700",
    }}
  >
    Parti: {link.batch_code}
  </div>
)}
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
  : link.status === "cancelled"
  ? "İPTAL"
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

                {link.status === "assigned" && link.target_url && (
  <div>
    <strong>Hedef:</strong> {link.target_url}
  </div>
)}

                {link.status !== "cancelled" && (
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
      {link.status === "stock" ? "Müşteriye Ata" : "Düzenle"}
    </a>

    {link.status === "stock" && (
      <button
        type="button"
        onClick={() => cancelStock(link)}
        style={{
          border: "1px solid #fecdca",
          padding: "10px 16px",
          background: "#fff1f0",
          color: "#b42318",
          borderRadius: "10px",
          fontSize: "14px",
          fontWeight: "800",
          cursor: "pointer",
        }}
      >
        İptal Et
      </button>
    )}

    {link.status === "assigned" && (
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
    )}

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
)}
              </div>
            </div>
          ))}
                      ))}

          {totalPages > 1 && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "12px",
                flexWrap: "wrap",
                marginTop: "8px",
                padding: "16px",
                background: "#f8fafc",
                border: "1px solid #eaecf0",
                borderRadius: "14px",
              }}
            >
              <button
                type="button"
                onClick={() =>
                  setCurrentPage((page) =>
                    Math.max(page - 1, 1)
                  )
                }
                disabled={safeCurrentPage === 1}
                style={{
                  border: "1px solid #d0d5dd",
                  padding: "10px 16px",
                  background: "#ffffff",
                  color: "#344054",
                  borderRadius: "10px",
                  fontSize: "13px",
                  fontWeight: "800",
                  cursor:
                    safeCurrentPage === 1
                      ? "not-allowed"
                      : "pointer",
                  opacity:
                    safeCurrentPage === 1
                      ? 0.5
                      : 1,
                }}
              >
                ← Önceki
              </button>

              <div
                style={{
                  color: "#667085",
                  fontSize: "13px",
                  fontWeight: "700",
                  textAlign: "center",
                }}
              >
                Sayfa {safeCurrentPage} / {totalPages}
                {" • "}
                {filteredLinks.length} kayıt
              </div>

              <button
                type="button"
                onClick={() =>
                  setCurrentPage((page) =>
                    Math.min(page + 1, totalPages)
                  )
                }
                disabled={
                  safeCurrentPage === totalPages
                }
                style={{
                  border: "1px solid #d0d5dd",
                  padding: "10px 16px",
                  background: "#ffffff",
                  color: "#344054",
                  borderRadius: "10px",
                  fontSize: "13px",
                  fontWeight: "800",
                  cursor:
                    safeCurrentPage === totalPages
                      ? "not-allowed"
                      : "pointer",
                  opacity:
                    safeCurrentPage === totalPages
                      ? 0.5
                      : 1,
                }}
              >
                Sonraki →
              </button>
            </div>
          )}
        </div>
      )}
        </div>
      )}
    </main>
  );
}
