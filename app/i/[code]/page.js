"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function IbanCardPage() {
  const params = useParams();
  const code = params.code;

  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!code) return;

    async function getCard() {
      try {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

        const response = await fetch(
          `${url}/rest/v1/iban_cards?code=eq.${encodeURIComponent(
            code
          )}&active=eq.true&select=*`,
          {
            headers: {
              apikey: key,
              Authorization: `Bearer ${key}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Supabase request failed");
        }

        const data = await response.json();

        if (!data || data.length === 0) {
          setError(true);
        } else {
          setCard(data[0]);
        }
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
          <h1 style={{ marginTop: 0 }}>Kart bulunamadı</h1>
          <p style={{ color: "#667085" }}>
            Bu IBAN kartı bulunamadı veya kullanım dışı.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main style={styles.center}>
      <div style={{ width: "100%", maxWidth: "440px" }}>
       

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
            <Info label="BANKA" value={card.bank_name} />
            <Info
              label="HESAP SAHİBİ"
              value={card.account_holder}
            />

            <p style={styles.label}>IBAN</p>

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
              onClick={copyIban}
              style={{
                width: "100%",
                border: "none",
                marginTop: "18px",
                padding: "17px",
                borderRadius: "14px",
                background: copied ? "#12b76a" : "#087cf0",
                color: "#ffffff",
                fontSize: "16px",
                fontWeight: "700",
                cursor: "pointer",
              }}
            >
              {copied ? "✓ IBAN Kopyalandı" : "IBAN'ı Kopyala"}
            </button>
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
      <p style={styles.label}>{label}</p>
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
    boxShadow: "0 12px 40px rgba(16,24,40,0.08)",
  },

  label: {
    color: "#98a2b3",
    fontSize: "12px",
    margin: "0 0 5px",
  },
};
