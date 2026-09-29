"use client";

import { useEffect, useState } from "react";
import JSZip from "jszip";
import QRCode from "qrcode";
import LogoutButton from "./LogoutButton";

export default function AdminPanel() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [creatingStock, setCreatingStock] = useState(false);
  const [creatingBulkStock, setCreatingBulkStock] = useState(false);
  const [downloadingStockQr, setDownloadingStockQr] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [showAllBatches, setShowAllBatches] = useState(false);
  

  const cardsPerPage = 20;

  useEffect(() => {
    loadCards();
  }, []);

  async function loadCards() {
    try {
      const token = localStorage.getItem("dokunuver_access_token");

      if (!token) {
        window.location.href = "/panel/login";
        return;
      }

      const response = await fetch("/api/iban-cards", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

      const data = await response.json();

      if (response.status === 401) {
        localStorage.removeItem("dokunuver_access_token");
        localStorage.removeItem("dokunuver_refresh_token");
        window.location.href = "/panel/login";
        return;
      }

      if (!response.ok) {
        throw new Error(data.error || "Kartlar getirilemedi.");
      }

      setCards(Array.isArray(data.cards) ? data.cards : []);
    } catch (error) {
      console.error("Kartlar yüklenirken hata oluştu:", error);
      setCards([]);
    } finally {
      setLoading(false);
    }
  }

  async function createStockCard() {
    const confirmed = window.confirm(
      "Yeni bir boş IBAN stok kartı oluşturulsun mu?\n\n" +
        "Kart müşteri bilgisi olmadan oluşturulacak ve pasif durumda olacaktır."
    );

    if (!confirmed) return;

    try {
      setCreatingStock(true);

      const token = localStorage.getItem("dokunuver_access_token");

      if (!token) {
        window.location.href = "/panel/login";
        return;
      }

      const response = await fetch("/api/iban-cards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          mode: "stock",
        }),
      });

      const data = await response.json();

      if (response.status === 401) {
        localStorage.removeItem("dokunuver_access_token");
        localStorage.removeItem("dokunuver_refresh_token");
        window.location.href = "/panel/login";
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.error || "Stok IBAN kartı oluşturulamadı."
        );
      }

      await loadCards();

      alert(
        `Stok kartı başarıyla oluşturuldu.\n\nKart Kodu: ${data.card.code}`
      );
    } catch (error) {
      alert(error.message);
    } finally {
      setCreatingStock(false);
    }
  }
async function createBulkStockCards() {
  const quantityText = window.prompt(
    "Kaç adet stok IBAN kartı oluşturmak istiyorsunuz?\n\n1 ile 100 arasında bir sayı girin.",
    "10"
  );

  if (quantityText === null) return;

  const quantity = Number(quantityText);

  if (
    !Number.isInteger(quantity) ||
    quantity < 1 ||
    quantity > 100
  ) {
    alert("Lütfen 1 ile 100 arasında geçerli bir adet girin.");
    return;
  }

  const confirmed = window.confirm(
    `${quantity} adet boş IBAN stok kartı oluşturulacak.\n\nDevam etmek istiyor musunuz?`
  );

  if (!confirmed) return;

  try {
    setCreatingBulkStock(true);

    const token = localStorage.getItem(
      "dokunuver_access_token"
    );

    if (!token) {
      window.location.href = "/panel/login";
      return;
    }

    const response = await fetch("/api/iban-cards", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        mode: "stock_bulk",
        quantity,
      }),
    });

    const data = await response.json();

    if (response.status === 401) {
      localStorage.removeItem("dokunuver_access_token");
      localStorage.removeItem("dokunuver_refresh_token");
      window.location.href = "/panel/login";
      return;
    }

    if (!response.ok) {
      throw new Error(
        data.error || "Toplu stok kartları oluşturulamadı."
      );
    }

    

await loadCards();

alert(
  `${data.count} adet stok IBAN kartı başarıyla oluşturuldu.\n\nÜretim Partisi: ${data.batch_code}`
);
  } catch (error) {
    alert(error.message);
  } finally {
    setCreatingBulkStock(false);
  }
}
  async function downloadStockQrZip() {
  const stockCards = cards.filter(
    (card) => card.status === "stock"
  );

  if (stockCards.length === 0) {
    alert("İndirilecek stok IBAN kartı bulunmuyor.");
    return;
  }

  const confirmed = window.confirm(
    `${stockCards.length} adet stok IBAN kartının QR kodları ZIP olarak indirilecek.\n\nDevam etmek istiyor musunuz?`
  );

  if (!confirmed) return;

  try {
    setDownloadingStockQr(true);

    const zip = new JSZip();

    for (const card of stockCards) {
      const url = `https://dokunuver.com.tr/i/${card.code}`;

      const qrDataUrl = await QRCode.toDataURL(url, {
        width: 1000,
        margin: 2,
        errorCorrectionLevel: "H",
      });

      const base64Data = qrDataUrl.split(",")[1];

      zip.file(
        `DOKUNUVER-IBAN-${card.code}-QR.png`,
        base64Data,
        { base64: true }
      );
    }

    const zipBlob = await zip.generateAsync({
      type: "blob",
    });

    const downloadUrl = URL.createObjectURL(zipBlob);

    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download =
      `DOKUNUVER-IBAN-STOK-QR-${stockCards.length}-ADET.zip`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    console.error("Toplu QR ZIP oluşturma hatası:", error);
    alert("QR ZIP dosyası oluşturulamadı.");
  } finally {
    setDownloadingStockQr(false);
  }
}




  async function downloadBatchQrZip(batch) {
  if (!batch?.cards?.length) {
    alert("Bu üretim partisinde kart bulunamadı.");
    return;
  }

  const confirmed = window.confirm(
    `${batch.batchCode} partisindeki ${batch.cards.length} kartın QR kodları ZIP olarak indirilecek.\n\nDevam etmek istiyor musunuz?`
  );

  if (!confirmed) return;

  try {
    setDownloadingStockQr(true);

    const zip = new JSZip();

    for (const card of batch.cards) {
      const url = `https://dokunuver.com.tr/i/${card.code}`;

      const qrDataUrl = await QRCode.toDataURL(url, {
        width: 1000,
        margin: 2,
        errorCorrectionLevel: "H",
      });

      const base64Data = qrDataUrl.split(",")[1];

      zip.file(
        `DOKUNUVER-IBAN-${card.code}-QR.png`,
        base64Data,
        { base64: true }
      );
    }

    const zipBlob = await zip.generateAsync({
      type: "blob",
    });

    const downloadUrl = URL.createObjectURL(zipBlob);

    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download =
      `DOKUNUVER-${batch.batchCode}-${batch.cards.length}-ADET.zip`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    console.error("Üretim partisi QR ZIP hatası:", error);
    alert("Üretim partisi QR ZIP dosyası oluşturulamadı.");
  } finally {
    setDownloadingStockQr(false);
  }
}
  async function downloadPrintIban(card) {
  try {
    const token = localStorage.getItem(
      "dokunuver_access_token"
    );

    if (!token) {
      window.location.href = "/panel/login";
      return;
    }

    const response = await fetch(
      `/api/print-iban/${encodeURIComponent(card.code)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 401) {
      localStorage.removeItem(
        "dokunuver_access_token"
      );

      localStorage.removeItem(
        "dokunuver_refresh_token"
      );

      window.location.href = "/panel/login";
      return;
    }

    if (!response.ok) {
      let message =
        "IBAN baskı görseli oluşturulamadı.";

      try {
        const data = await response.json();

        if (data?.error) {
          message = data.error;
        }
      } catch {
        // JSON dönmezse varsayılan mesaj kullanılır.
      }

      throw new Error(message);
    }

    const blob = await response.blob();

    const downloadUrl =
      URL.createObjectURL(blob);

    const downloadLink =
      document.createElement("a");

    downloadLink.href = downloadUrl;

    downloadLink.download =
      `DOKUNUVER-IBAN-${card.code}.png`;

    document.body.appendChild(
      downloadLink
    );

    downloadLink.click();

    document.body.removeChild(
      downloadLink
    );

    URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    console.error(
      "IBAN baskı görseli indirme hatası:",
      error
    );

    alert(
      error.message ||
        "IBAN baskı görseli oluşturulamadı."
    );
  }
}
  async function toggleCardStatus(card) {
    const action = card.active ? "pasife almak" : "aktif etmek";

    const cardName =
      card.business_name ||
      (card.status === "stock" ? `Stok ${card.code}` : card.code);

    const confirmed = window.confirm(
      `${cardName} kartını ${action} istediğinize emin misiniz?`
    );

    if (!confirmed) {
      return;
    }

    try {
      const token = localStorage.getItem("dokunuver_access_token");

      if (!token) {
        window.location.href = "/panel/login";
        return;
      }

      const response = await fetch("/api/iban-cards", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          code: card.code,
          active: !card.active,
        }),
      });

      const data = await response.json();

      if (response.status === 401) {
        localStorage.removeItem("dokunuver_access_token");
        localStorage.removeItem("dokunuver_refresh_token");
        window.location.href = "/panel/login";
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.error || "Kart durumu değiştirilemedi."
        );
      }

      setCards((currentCards) =>
        currentCards.map((item) =>
          item.code === card.code
            ? { ...item, active: !card.active }
            : item
        )
      );
    } catch (error) {
      alert(error.message);
    }
  }

  const filteredCards = cards.filter((card) => {
    if (
  selectedBatch &&
  card.batch_code !== selectedBatch
) {
  return false;
}
  if (filter === "active" && !card.active) return false;

  if (
    filter === "passive" &&
    (card.active || card.status === "stock")
  )
    return false;

  if (filter === "stock" && card.status !== "stock")
    return false;

    const searchText = search.trim().toLocaleLowerCase("tr-TR");

    if (!searchText) return true;

    return (
  card.business_name
    ?.toLocaleLowerCase("tr-TR")
    .includes(searchText) ||
  card.code
    ?.toLocaleLowerCase("tr-TR")
    .includes(searchText) ||
  card.account_holder
    ?.toLocaleLowerCase("tr-TR")
    .includes(searchText) ||
  card.bank_name
    ?.toLocaleLowerCase("tr-TR")
    .includes(searchText) ||
  card.batch_code
    ?.toLocaleLowerCase("tr-TR")
    .includes(searchText)
);
  });

  const totalPages = Math.ceil(
    filteredCards.length / cardsPerPage
  );

  const startIndex = (currentPage - 1) * cardsPerPage;
  const endIndex = startIndex + cardsPerPage;

  const paginatedCards = filteredCards.slice(
    startIndex,
    endIndex
  );
const productionBatches = Object.values(
  cards.reduce((groups, card) => {
    if (!card.batch_code) {
      return groups;
    }

    if (!groups[card.batch_code]) {
      groups[card.batch_code] = {
        batchCode: card.batch_code,
        cards: [],
      };
    }

    groups[card.batch_code].cards.push(card);

    return groups;
  }, {})
).sort((a, b) =>
  b.batchCode.localeCompare(a.batchCode)
);

const visibleProductionBatches = showAllBatches
  ? productionBatches
  : productionBatches.slice(0, 5);
  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <header style={styles.header}>
          <div>
            <div style={styles.brand}>DOKUNUVER</div>
            <div style={styles.slogan}>Dokun. Bağlan.</div>
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
      border: "1px solid #087cf0",
      borderRadius: "10px",
      background: "#087cf0",
      color: "#ffffff",
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
      border: "1px solid #d0d5dd",
      borderRadius: "10px",
      background: "#ffffff",
      color: "#344054",
      textDecoration: "none",
      fontSize: "14px",
      fontWeight: "800",
    }}
  >
    Smart Links
  </a>
</div>
        <section style={styles.hero}>
          <div>
            <p style={styles.eyebrow}>DOKUNUVER PANEL</p>

            <h1 style={styles.title}>NFC Kart Yönetimi</h1>

            <p style={styles.description}>
              DOKUNUVER NFC ürünlerini ve müşteri bağlantılarını
              tek noktadan yönetin.
            </p>
          </div>

          <div
            style={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >
            <button
              type="button"
              onClick={() =>
                (window.location.href = "/panel/new")
              }
              style={styles.newButton}
            >
              + Yeni IBAN Kartı
            </button>

            <button
              type="button"
              onClick={createStockCard}
              disabled={creatingStock}
              style={{
                ...styles.newButton,
                background: "#ffffff",
                color: "#101828",
                opacity: creatingStock ? 0.6 : 1,
              }}
            >
              {creatingStock
                ? "Stok Oluşturuluyor..."
                : "+ Stok IBAN Kartı Oluştur"}
            </button>
<button
  type="button"
  onClick={createBulkStockCards}
  disabled={creatingBulkStock}
  style={{
    ...styles.newButton,
    background: "#ffffff",
    color: "#101828",
    opacity: creatingBulkStock ? 0.6 : 1,
  }}
>
  {creatingBulkStock
  ? "Toplu Stok Oluşturuluyor..."
  : "+ Toplu Stok Oluştur"}
</button>

<button
  type="button"
  onClick={downloadStockQrZip}
  disabled={downloadingStockQr}
  style={{
    ...styles.newButton,
    background: "#ffffff",
    color: "#101828",
    opacity: downloadingStockQr ? 0.6 : 1,
  }}
>
  {downloadingStockQr
    ? "QR ZIP Hazırlanıyor..."
    : "↓ Stok QR'larını İndir (.ZIP)"}
</button>
            
          </div>
        </section>

        <section style={styles.stats}>
          <Stat
            label="Toplam IBAN Kartı"
            value={cards.length}
          />

          <Stat
            label="Aktif Kart"
            value={
              cards.filter((card) => card.active).length
            }
          />

          <Stat
            label="Pasif Kart"
            value={
              cards.filter(
  (card) =>
    !card.active && card.status !== "stock"
).length
            }
          />
            <Stat
  label="Stok Kartı"
  value={
    cards.filter(
      (card) => card.status === "stock"
    ).length
  }
/>
        </section>
            {productionBatches.length > 0 && (
  <section style={styles.section}>
    <div style={styles.sectionHeader}>
      <h2 style={styles.sectionTitle}>
        Üretim Partileri
      </h2>

      <p style={styles.sectionDescription}>
        Toplu oluşturulan IBAN kartlarının üretim geçmişi.
      </p>
    </div>

    <div style={styles.cardList}>
      {visibleProductionBatches.map((batch) => (
        <div
          key={batch.batchCode}
          style={styles.customerCard}
        >
          <div style={styles.customerTop}>
            <div>
              <div style={styles.customerName}>
                📦 {batch.batchCode}
              </div>

             <div style={styles.code}>
  {formatBatchDate(batch.batchCode)}
  {" • "}
  Toplam: {batch.cards.length}
  {" • "}
  Stokta: {
    batch.cards.filter(
      (card) => card.status === "stock"
    ).length
  }
  {" • "}
  Atandı: {
    batch.cards.filter(
      (card) => card.status === "assigned"
    ).length
  }
  {" • "}
  Kilitli: {
    batch.cards.filter(
      (card) => card.status === "locked"
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
    justifyContent: "flex-end",
  }}
>
  <div style={styles.stock}>
    Üretim Partisi
  </div>
<button
  type="button"
  onClick={() => {
    setSelectedBatch(batch.batchCode);
    setFilter("all");
    setCurrentPage(1);

    setTimeout(() => {
      document
        .getElementById("iban-kartlari")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 50);
  }}
  style={styles.filterButton}
>
  Kartları Gör
</button>
  <button
    type="button"
    onClick={() => downloadBatchQrZip(batch)}
    disabled={downloadingStockQr}
    style={{
      ...styles.filterButton,
      opacity: downloadingStockQr ? 0.6 : 1,
    }}
  >
        ↓ QR'ları İndir
  </button>
</div>
          </div>
        </div>
      ))}

      {productionBatches.length > 5 && (
        <button
          type="button"
          onClick={() =>
            setShowAllBatches((current) => !current)
          }
          style={{
            width: "100%",
            marginTop: "4px",
            border: "1px solid #d0d5dd",
            padding: "12px 16px",
            background: "#f8fafc",
            color: "#344054",
            borderRadius: "10px",
            fontSize: "13px",
            fontWeight: "800",
            cursor: "pointer",
          }}
        >
          {showAllBatches
            ? "Son 5 Üretim Partisini Göster"
            : `Tüm Üretim Partilerini Gör (${productionBatches.length})`}
        </button>
      )}

    </div>
  </section>
)}
  

        <section
  id="iban-kartlari"
  style={styles.section}
>
  <div style={styles.sectionHeader}>
    <div>
      <h2 style={styles.sectionTitle}>
        IBAN Kartları
      </h2>

      <p style={styles.sectionDescription}>
        Oluşturulan müşteri kartlarını görüntüleyin.
      </p>
    </div>
  </div>
{selectedBatch && (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "12px",
      flexWrap: "wrap",
      marginBottom: "20px",
      padding: "14px 16px",
      background: "#eff8ff",
      border: "1px solid #b2ddff",
      borderRadius: "12px",
    }}
  >
    <div
      style={{
        fontSize: "14px",
        fontWeight: "800",
        color: "#175cd3",
      }}
    >
      📦 Seçili Parti: {selectedBatch}
    </div>

    <button
      type="button"
      onClick={() => {
        setSelectedBatch(null);
        setFilter("all");
        setCurrentPage(1);
      }}
      style={styles.filterButton}
    >
      Filtreyi Temizle
    </button>
  </div>
)}
          <div
            style={{
              display: "flex",
              gap: "10px",
              marginBottom: "22px",
              flexWrap: "wrap",
            }}
          >
            <button
              type="button"
              onClick={() => {
  setFilter("all");
  setSelectedBatch(null);
  setCurrentPage(1);
}}
              style={{
                ...styles.filterButton,
                ...(filter === "all" && !selectedBatch
  ? styles.filterButtonActive
  : {}),
              }}
            >
              Tümü ({cards.length})
            </button>

            <button
              type="button"
              onClick={() => {
                setFilter("active");
                setCurrentPage(1);
              }}
              style={{
                ...styles.filterButton,
                ...(filter === "active"
                  ? styles.filterButtonActive
                  : {}),
              }}
            >
              Aktif (
              {
                cards.filter((card) => card.active)
                  .length
              }
              )
            </button>

            <button
              type="button"
              onClick={() => {
                setFilter("passive");
                setCurrentPage(1);
              }}
              style={{
                ...styles.filterButton,
                ...(filter === "passive"
                  ? styles.filterButtonActive
                  : {}),
              }}
            >
              Pasif (
              {
                cards.filter(
  (card) => !card.active && card.status !== "stock"
).length
              }
              )
            </button>
                <button
  type="button"
  onClick={() => {
    setFilter("stock");
    setCurrentPage(1);
  }}
  style={{
    ...styles.filterButton,
    ...(filter === "stock"
      ? styles.filterButtonActive
      : {}),
  }}
>
  📦 Stokta (
  {
    cards.filter(
      (card) => card.status === "stock"
    ).length
  }
  )
</button>
          </div>

          <div style={{ marginBottom: "22px" }}>
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="İşletme, kart kodu, parti, hesap sahibi veya banka ara..."
              style={styles.searchInput}
            />
          </div>

          {loading ? (
            <div style={styles.empty}>
              Kartlar yükleniyor...
            </div>
          ) : cards.length === 0 ? (
            <div style={styles.empty}>
              Henüz IBAN kartı bulunmuyor.
            </div>
          ) : (
            <div style={styles.cardList}>
              {paginatedCards.map((card) => (
                <div
                  key={card.id}
                  style={styles.customerCard}
                >
                  <div style={styles.customerTop}>
                    <div>
                      <div style={styles.customerName}>
                        {card.business_name ||
                          (card.status === "stock"
                            ? "Stok IBAN Kartı"
                            : "İsimsiz Kart")}
                      </div>

                      <div style={styles.code}>
  /i/{card.code}
</div>

{card.batch_code && (
  <div
    style={{
      marginTop: "5px",
      color: "#667085",
      fontSize: "12px",
      fontWeight: "700",
    }}
  >
    Parti: {card.batch_code}
  </div>
)}
                    </div>

                    <div
                      style={{
                        display: "flex",
                        gap: "8px",
                        alignItems: "center",
                        flexWrap: "wrap",
                        justifyContent: "flex-end",
                      }}
                    >
                      {card.status === "stock" && (
                        <div style={styles.stock}>
                          📦 Stokta
                        </div>
                      )}

                      {card.locked && (
                        <div style={styles.locked}>
                          🔒 Kilitli
                        </div>
                      )}

                      {card.status !== "stock" && (
  <div
    style={
      card.active
        ? styles.active
        : styles.passive
    }
  >
    {card.active
      ? "Aktif"
      : "Pasif"}
  </div>
)}
                    </div>
                  </div>

                  <div style={styles.infoGrid}>
                    <Info
                      label="Banka"
                      value={card.bank_name}
                    />

                    <Info
                      label="Hesap Sahibi"
                      value={card.account_holder}
                    />

                    <Info
                      label="IBAN"
                      value={card.iban}
                    />
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: "16px",
                      alignItems: "center",
                      marginTop: "20px",
                      flexWrap: "wrap",
                    }}
                  >
                    {card.status !== "stock" && (
                      <a
                        href={`/i/${card.code}`}
                        target="_blank"
                        rel="noreferrer"
                        style={styles.openButton}
                      >
                        Kartı Görüntüle
                      </a>
                    )}

                    <a
                      href={`/panel/edit/${card.code}`}
                      style={styles.editButton}
                    >
                      {card.status === "stock"
                        ? "Müşteriye Ata"
                        : "Düzenle"}
                    </a>
<button
  type="button"
  onClick={() =>
    downloadPrintIban(card)
  }
  style={{
    border: "1px solid #fca5a5",
    padding: "10px 16px",
    background: "#fff1f2",
    color: "#b42318",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: "800",
    cursor: "pointer",
  }}
>
  ↓ Baskı Görseli İndir
</button>

                    {card.status !== "stock" && (
                      <button
                        type="button"
                        onClick={() =>
                          toggleCardStatus(card)
                        }
                        style={{
                          ...styles.statusButton,
                          ...(card.active
                            ? styles.deactivateButton
                            : styles.activateButton),
                        }}
                      >
                        {card.active
                          ? "Pasife Al"
                          : "Aktif Et"}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "8px",
                marginTop: "24px",
                flexWrap: "wrap",
              }}
            >
              <button
                type="button"
                onClick={() =>
                  setCurrentPage((page) =>
                    Math.max(page - 1, 1)
                  )
                }
                disabled={currentPage === 1}
                style={styles.paginationButton}
              >
                Önceki
              </button>

              {Array.from(
                { length: totalPages },
                (_, index) => {
                  const page = index + 1;

                  return (
                    <button
                      key={page}
                      type="button"
                      onClick={() =>
                        setCurrentPage(page)
                      }
                      style={{
                        ...styles.paginationButton,
                        ...(currentPage === page
                          ? styles.paginationButtonActive
                          : {}),
                      }}
                    >
                      {page}
                    </button>
                  );
                }
              )}

              <button
                type="button"
                onClick={() =>
                  setCurrentPage((page) =>
                    Math.min(
                      page + 1,
                      totalPages
                    )
                  )
                }
                disabled={
                  currentPage === totalPages
                }
                style={styles.paginationButton}
              >
                Sonraki
              </button>
            </div>
          )}
        </section>

        <footer style={styles.footer}>
          DOKUNUVER NFC Platform
        </footer>
      </div>
    </main>
  );
}

function Stat({ label, value }) {
  return (
    <div style={styles.statCard}>
      <div style={styles.statValue}>{value}</div>
      <div style={styles.statLabel}>{label}</div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <div style={styles.infoLabel}>{label}</div>
      <div style={styles.infoValue}>
        {value || "-"}
      </div>
    </div>
  );
}
function formatBatchDate(batchCode) {
  const match = /^IBAN-(\d{2})(\d{2})(\d{2})-\d+$/.exec(
    batchCode
  );

  if (!match) return "";

  const [, year, month, day] = match;

  return `${day}.${month}.20${year}`;
}
const styles = {
  page: {
    minHeight: "100vh",
    background: "#f5f7fb",
    fontFamily: "Arial, sans-serif",
    color: "#101828",
  },

  container: {
    width: "calc(100% - 40px)",
    maxWidth: "1180px",
    margin: "0 auto",
    padding: "30px 0 50px",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "40px",
  },

  brand: {
    fontWeight: "900",
    fontSize: "22px",
  },

  slogan: {
    color: "#087cf0",
    fontWeight: "700",
    fontSize: "12px",
    marginTop: "3px",
  },

  adminBadge: {
    background: "#ffffff",
    border: "1px solid #e4e7ec",
    padding: "10px 14px",
    borderRadius: "12px",
    fontSize: "13px",
    fontWeight: "700",
  },

  hero: {
    background: "#101828",
    color: "#ffffff",
    borderRadius: "24px",
    padding: "35px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "25px",
    flexWrap: "wrap",
  },

  eyebrow: {
    color: "#84c5ff",
    fontWeight: "800",
    fontSize: "12px",
    letterSpacing: "1px",
    margin: "0 0 10px",
  },

  title: {
    fontSize: "34px",
    margin: 0,
  },

  description: {
    color: "#d0d5dd",
    maxWidth: "550px",
    lineHeight: "1.6",
    marginBottom: 0,
  },

  newButton: {
  border: 0,
  background: "#087cf0",
  color: "#ffffff",
  padding: "15px 20px",
  borderRadius: "12px",
  fontWeight: "800",
  fontSize: "14px",
  cursor: "pointer",
  flex: "1 1 210px",
  textAlign: "center",
},

  stats: {
  display: "grid",
  gridTemplateColumns:
  "repeat(auto-fit, minmax(150px, 1fr))",
  gap: "16px",
  marginTop: "20px",
},

  statCard: {
    background: "#ffffff",
    borderRadius: "18px",
    padding: "22px",
    border: "1px solid #eaecf0",
  },

  statValue: {
    fontSize: "30px",
    fontWeight: "900",
  },

  statLabel: {
    color: "#667085",
    marginTop: "6px",
    fontSize: "14px",
  },

  section: {
    marginTop: "20px",
    background: "#ffffff",
    borderRadius: "22px",
    padding: "25px",
    border: "1px solid #eaecf0",
  },

  sectionHeader: {
    marginBottom: "20px",
  },

  sectionTitle: {
    margin: 0,
    fontSize: "21px",
  },

  sectionDescription: {
    margin: "6px 0 0",
    color: "#667085",
    fontSize: "14px",
  },

  cardList: {
    display: "grid",
    gap: "14px",
  },

  customerCard: {
    border: "1px solid #eaecf0",
    borderRadius: "16px",
    padding: "20px",
  },

  customerTop: {
    display: "flex",
    justifyContent: "space-between",
    gap: "15px",
    alignItems: "flex-start",
  },

  customerName: {
    fontSize: "18px",
    fontWeight: "800",
  },

  code: {
    marginTop: "5px",
    color: "#087cf0",
    fontSize: "13px",
    fontWeight: "700",
  },

  active: {
    background: "#ecfdf3",
    color: "#027a48",
    padding: "6px 10px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "800",
  },

  passive: {
    background: "#f2f4f7",
    color: "#667085",
    padding: "6px 10px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "800",
  },

  stock: {
    background: "#fff7ed",
    color: "#c2410c",
    padding: "6px 10px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "800",
    border: "1px solid #fed7aa",
  },

  infoGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "18px",
    marginTop: "20px",
  },

  infoLabel: {
    color: "#98a2b3",
    fontSize: "11px",
    textTransform: "uppercase",
    marginBottom: "5px",
  },

  infoValue: {
    fontSize: "14px",
    fontWeight: "700",
    wordBreak: "break-word",
  },

  openButton: {
    display: "inline-block",
    color: "#087cf0",
    textDecoration: "none",
    fontSize: "13px",
    fontWeight: "800",
  },

  editButton: {
    display: "inline-block",
    color: "#ffffff",
    background: "#101828",
    padding: "10px 16px",
    borderRadius: "10px",
    textDecoration: "none",
    fontSize: "13px",
    fontWeight: "800",
  },

  empty: {
    padding: "40px 20px",
    textAlign: "center",
    color: "#667085",
    background: "#f9fafb",
    borderRadius: "14px",
  },

  footer: {
    textAlign: "center",
    color: "#98a2b3",
    fontSize: "12px",
    marginTop: "30px",
  },

  filterButton: {
    border: "1px solid #d0d5dd",
    background: "#ffffff",
    color: "#475467",
    borderRadius: "10px",
    padding: "10px 16px",
    fontSize: "13px",
    fontWeight: "700",
    cursor: "pointer",
  },

  filterButtonActive: {
    background: "#087cf0",
    color: "#ffffff",
    border: "1px solid #087cf0",
  },

  statusButton: {
    borderRadius: "10px",
    padding: "11px 16px",
    fontSize: "13px",
    fontWeight: "800",
    cursor: "pointer",
  },

  deactivateButton: {
    background: "#ffffff",
    color: "#b42318",
    border: "1px solid #fda29b",
  },

  activateButton: {
    background: "#ecfdf3",
    color: "#027a48",
    border: "1px solid #abefc6",
  },

  searchInput: {
    width: "100%",
    boxSizing: "border-box",
    padding: "14px 16px",
    border: "1px solid #d0d5dd",
    borderRadius: "12px",
    background: "#ffffff",
    color: "#101828",
    fontSize: "14px",
    outline: "none",
  },

  paginationButton: {
    minWidth: "42px",
    padding: "10px 13px",
    border: "1px solid #d0d5dd",
    borderRadius: "10px",
    background: "#ffffff",
    color: "#344054",
    fontSize: "13px",
    fontWeight: "700",
    cursor: "pointer",
  },

  paginationButtonActive: {
    background: "#087cf0",
    color: "#ffffff",
    border: "1px solid #087cf0",
  },

  locked: {
    background: "#eff8ff",
    color: "#175cd3",
    padding: "6px 10px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "800",
    border: "1px solid #b2ddff",
  },
};
