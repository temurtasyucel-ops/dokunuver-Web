"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function IbanCardPage() {
  const params = useParams();
  const code = params.code;

  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [copiedHolder, setCopiedHolder] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!code) return;

    async function getCard() {
      try {
        const response = await fetch(
          `/api/public-iban/${encodeURIComponent(code)}`,
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          setError(true);
          return;
        }

        const data = await response.json();

        if (!data) {
          setError(true);
          return;
        }

        setCard(data);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    getCard();
  }, [code]);

  async function copyIban() {
    if (!card?.iban) return;

    try {
      await navigator.clipboard.writeText(
        card.iban.replace(/\s/g, "")
      );

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2500);
    } catch {
      alert("IBAN kopyalanamadı.");
    }
  }

  async function copyAccountHolder() {
    if (!card?.account_holder) return;

    try {
      await navigator.clipboard.writeText(
        card.account_holder
      );

      setCopiedHolder(true);

      setTimeout(() => {
        setCopiedHolder(false);
      }, 2500);
    } catch {
      alert("Hesap sahibi kopyalanamadı.");
    }
  }

  if (loading) {
    return (
      <main style={styles.center}>
        <p>Yükleniyor...</p>
      </main>
    );
  }

  if (error || !card) {
    return (
      <main style={styles.center}>
        <div style={styles.card}>
          <h1 style={{ marginTop: 0 }}>
            Kart bulunamadı
          </h1>

          <p style={{ color: "#667085" }}>
            Bu IBAN kartı bulunamadı veya kullanım dışı.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main style={styles.center}>
      <div
        style={{
          width: "100%",
          maxWidth: "440px",
        }}
      >
        <div style={styles.card}>
          <div
            style={{
              width: "62px",
              height: "62px",
              borderRadius: "18px",
              background: "#087cf0",
              color: "#ffffff",
              margin: "0 auto 20px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "29px",
            }}
          >
            ₺
          </div>

          <div
            style={{
              textAlign: "center",
              color: "#667085",
              fontSize: "14px",
              marginBottom: "7px",
            }}
          >
            Ödeme Bilgileri
          </div>

          <h1
            style={{
              textAlign: "center",
              color: "#101828",
              fontSize: "25px",
              margin: "0 0 28px",
            }}
          >
            {card.business_name}
          </h1>

          <div
            style={{
              borderTop: "1px solid #eaecf0",
              paddingTop: "22px",
            }}
          >
            <Info
              label="BANKA"
              value={card.bank_name}
            />

            <p style={styles.label}>
              HESAP SAHİBİ
            </p>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "12px",
                marginBottom: "20px",
              }}
            >
              <div
                style={{
                  color: "#101828",
                  fontSize: "17px",
                  fontWeight: "700",
                  wordBreak: "break-word",
                }}
              >
                {card.account_holder}
              </div>

              <button
                type="button"
                onClick={copyAccountHolder}
                style={{
                  flexShrink: 0,
                  border: "1px solid #d0d5dd",
                  background: copiedHolder
                    ? "#ecfdf3"
                    : "#ffffff",
                  color: copiedHolder
                    ? "#067647"
                    : "#344054",
                  padding: "8px 11px",
                  borderRadius: "9px",
                  fontSize: "12px",
                  fontWeight: "700",
                  cursor: "pointer",
                }}
              >
                {copiedHolder
                  ? "✓ Kopyalandı"
                  : "Kopyala"}
              </button>
            </div>

            <p style={styles.label}>
              IBAN
            </p>

            <div
              style={{
                background: "#f7f9fc",
                padding: "16px",
                borderRadius: "14px",
                fontSize: "16px",
                fontWeight: "700",
                color: "#101828",
                lineHeight: "1.6",
                wordBreak: "break-word",
              }}
            >
              {card.iban}
            </div>

            <button
              type="button"
              onClick={copyIban}
              style={{
                width: "100%",
                border: "none",
                marginTop: "18px",
                padding: "17px",
                borderRadius: "14px",
                background: copied
                  ? "#12b76a"
                  : "#087cf0",
                color: "#ffffff",
                fontSize: "16px",
                fontWeight: "700",
                cursor: "pointer",
              }}
            >
              {copied
                ? "✓ IBAN Kopyalandı"
                : "IBAN'ı Kopyala"}
            </button>

            <div
              style={{
                marginTop: "16px",
                padding: "14px 16px",
                background: "#ecfdf3",
                border: "1px solid #abefc6",
                borderRadius: "12px",
              }}
            >
              <div
                style={{
                  color: "#067647",
                  fontSize: "13px",
                  fontWeight: "800",
                  marginBottom: "4px",
                }}
              >
                🔒 Doğrulanmış ödeme bilgileri
              </div>

              <div
                style={{
                  color: "#067647",
                  fontSize: "12px",
                  lineHeight: "1.5",
                }}
              >
                Bu kartın banka, hesap sahibi ve IBAN bilgileri
                doğrulama sonrasında kilitlenmiştir ve normal
                yönetim işlemleriyle değiştirilemez.
              </div>

              {card.locked_at && (
                <div
                  style={{
                    color: "#067647",
                    fontSize: "12px",
                    fontWeight: "700",
                    marginTop: "8px",
                  }}
                >
                  Doğrulama tarihi:{" "}
                  {new Date(
                    card.locked_at
                  ).toLocaleDateString(
                    "tr-TR",
                    {
                      timeZone:
                        "Europe/Istanbul",
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    }
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <p
          style={{
            textAlign: "center",
            color: "#98a2b3",
            fontSize: "12px",
            lineHeight: "1.5",
            marginTop: "20px",
          }}
        >
          Ödeme yapmadan önce hesap sahibi ve IBAN bilgilerini
          kontrol ediniz.
        </p>

        <div
          style={{
            textAlign: "center",
            marginTop: "22px",
            paddingTop: "20px",
            borderTop: "1px solid #e4e7ec",
          }}
        >
          <div
            style={{
              color: "#667085",
              fontSize: "11px",
              marginBottom: "7px",
            }}
          >
            Bu NFC kart DOKUNUVER altyapısıyla çalışmaktadır.
          </div>

          <a
            href="https://dokunuver.com.tr"
            target="_blank"
            rel="noreferrer"
            style={{
              color: "#087cf0",
              fontSize: "13px",
              fontWeight: "700",
              textDecoration: "none",
            }}
          >
            NFC çözümlerini incele →
          </a>
        </div>
      </div>
    </main>
  );
}

function Info({ label, value }) {
  return (
    <>
      <p style={styles.label}>
        {label}
      </p>

      <p
        style={{
          color: "#101828",
          fontSize: "17px",
          fontWeight: "700",
          margin: "0 0 20px",
        }}
      >
        {value}
      </p>
    </>
  );
}

const styles = {
  center: {
    minHeight: "100vh",
    background: "#f4f7fb",
    fontFamily: "Arial, sans-serif",
    padding: "24px 18px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    boxSizing: "border-box",
  },

  card: {
    background: "#ffffff",
    borderRadius: "26px",
    padding: "30px 22px",
    boxShadow:
      "0 12px 40px rgba(16,24,40,0.08)",
  },

  label: {
    color: "#98a2b3",
    fontSize: "12px",
    margin: "0 0 5px",
  },
};
