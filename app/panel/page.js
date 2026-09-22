"use client";

import { useEffect, useState } from "react";
import LogoutButton from "./LogoutButton";

export default function AdminPanel() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCards();
  }, []);

  async function loadCards() {
    try {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

      const response = await fetch(
        `${url}/rest/v1/iban_cards?select=*&order=id.desc`,
        {
          headers: {
            apikey: key,
            Authorization: `Bearer ${key}`,
          },
        }
      );

      const data = await response.json();
      setCards(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

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

        <section style={styles.hero}>
          <div>
            <p style={styles.eyebrow}>DOKUNUVER PANEL</p>

            <h1 style={styles.title}>
              NFC Kart Yönetimi
            </h1>

            <p style={styles.description}>
              DOKUNUVER NFC ürünlerini ve müşteri
              bağlantılarını tek noktadan yönetin.
            </p>
          </div>

          <button style={styles.newButton}>
            + Yeni IBAN Kartı
          </button>
        </section>

        <section style={styles.stats}>
          <Stat
            label="Toplam IBAN Kartı"
            value={cards.length}
          />

          <Stat
            label="Aktif Kart"
            value={cards.filter((card) => card.active).length}
          />

          <Stat
            label="Pasif Kart"
            value={cards.filter((card) => !card.active).length}
          />
        </section>

        <section style={styles.section}>
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
              {cards.map((card) => (
                <div key={card.id} style={styles.customerCard}>
                  <div style={styles.customerTop}>
                    <div>
                      <div style={styles.customerName}>
                        {card.business_name}
                      </div>

                      <div style={styles.code}>
                        /i/{card.code}
                      </div>
                    </div>

                    <div
                      style={
                        card.active
                          ? styles.active
                          : styles.passive
                      }
                    >
                      {card.active ? "Aktif" : "Pasif"}
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
  }}
>
  <a
    href={`/i/${card.code}`}
    target="_blank"
    rel="noreferrer"
    style={styles.openButton}
  >
    Kartı Görüntüle
  </a>

  <a
    href={`/panel/edit/${card.code}`}
    style={styles.editButton}
  >
    Düzenle
  </a>
</div>
                </div>
              ))}
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
      <div style={styles.infoValue}>{value || "-"}</div>
    </div>
  );
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
  },

  stats: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
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
    marginTop: "20px",
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
};
