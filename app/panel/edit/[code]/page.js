"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditIbanCardPage() {
  const params = useParams();
  const router = useRouter();
  const code = params.code;

  const [form, setForm] = useState({
    business_name: "",
    bank_name: "",
    account_holder: "",
    iban: "",
    active: true,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!code) return;

    async function loadCard() {
      try {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

        const response = await fetch(
          `${url}/rest/v1/iban_cards?code=eq.${encodeURIComponent(
            code
          )}&select=*`,
          {
            headers: {
              apikey: key,
              Authorization: `Bearer ${key}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Kart bilgileri alınamadı.");
        }

        const data = await response.json();

        if (!data || data.length === 0) {
          throw new Error("Kart bulunamadı.");
        }

        const card = data[0];

        setForm({
          business_name: card.business_name || "",
          bank_name: card.bank_name || "",
          account_holder: card.account_holder || "",
          iban: card.iban || "",
          active: card.active !== false,
        });
      } catch (err) {
        setError(err.message || "Bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    }

    loadCard();
  }, [code]);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/iban-cards", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          business_name: form.business_name.trim(),
          bank_name: form.bank_name.trim(),
          account_holder: form.account_holder.trim(),
          iban: form.iban.replace(/\s+/g, "").toUpperCase(),
          active: form.active,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Kart güncellenemedi.");
      }

      setMessage("Kart başarıyla güncellendi.");

      setTimeout(() => {
        router.push("/panel");
        router.refresh();
      }, 900);
    } catch (err) {
      setError(err.message || "Bir hata oluştu.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main style={styles.center}>
        <strong>Kart bilgileri yükleniyor...</strong>
      </main>
    );
  }

  if (error && !form.business_name) {
    return (
      <main style={styles.center}>
        <div style={styles.errorBox}>
          <strong>{error}</strong>
          <br />
          <a href="/panel" style={styles.backLink}>
            ← Panele Dön
          </a>
        </div>
      </main>
    );
  }

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <header style={styles.header}>
          <div>
            <div style={styles.logo}>DOKUNUVER</div>
            <div style={styles.slogan}>Dokun. Bağlan.</div>
          </div>

          <a href="/panel" style={styles.backButton}>
            ← Panele Dön
          </a>
        </header>

        <div style={styles.titleArea}>
          <div style={styles.eyebrow}>DOKUNUVER PANEL</div>

          <h1 style={styles.title}>IBAN Kartını Düzenle</h1>

          <p style={styles.subtitle}>
            NFC kartının ödeme bilgilerini ve durumunu güncelleyin.
          </p>

          <div style={styles.codeBox}>
            Kart Kodu: <strong>{code}</strong>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={styles.card}>
          <label style={styles.label}>
            İşletme / Kart Adı
            <input
              name="business_name"
              value={form.business_name}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </label>

          <label style={styles.label}>
            Banka
            <input
              name="bank_name"
              value={form.bank_name}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </label>

          <label style={styles.label}>
            Hesap Sahibi
            <input
              name="account_holder"
              value={form.account_holder}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </label>

          <label style={styles.label}>
            IBAN
            <input
              name="iban"
              value={form.iban}
              onChange={handleChange}
              required
              autoCapitalize="characters"
              style={styles.input}
            />
          </label>

          <label style={styles.activeBox}>
            <input
              type="checkbox"
              name="active"
              checked={form.active}
              onChange={handleChange}
              style={styles.checkbox}
            />

            <div>
              <div style={styles.activeTitle}>Kart aktif olsun</div>
              <div style={styles.activeText}>
                Pasif kartlar NFC bağlantısı üzerinden görüntülenemez.
              </div>
            </div>
          </label>

          {error && <div style={styles.error}>{error}</div>}

          {message && <div style={styles.success}>{message}</div>}

          <button
            type="submit"
            disabled={saving}
            style={{
              ...styles.saveButton,
              opacity: saving ? 0.65 : 1,
            }}
          >
            {saving ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
          </button>

          <a
            href={`/i/${code}`}
            target="_blank"
            rel="noreferrer"
            style={styles.viewCard}
          >
            Kartı Görüntüle ↗
          </a>
        </form>

        <div style={styles.footer}>DOKUNUVER NFC Platform</div>
      </div>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f4f7fb",
    fontFamily: "Arial, sans-serif",
    padding: "32px 20px",
    color: "#101828",
  },

  center: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f4f7fb",
    fontFamily: "Arial, sans-serif",
  },

  container: {
    width: "100%",
    maxWidth: "900px",
    margin: "0 auto",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "50px",
  },

  logo: {
    fontSize: "25px",
    fontWeight: "900",
  },

  slogan: {
    color: "#087cf0",
    fontSize: "13px",
    fontWeight: "700",
    marginTop: "4px",
  },

  backButton: {
    background: "#ffffff",
    border: "1px solid #d0d5dd",
    padding: "12px 18px",
    borderRadius: "12px",
    textDecoration: "none",
    color: "#101828",
    fontWeight: "700",
    fontSize: "14px",
  },

  titleArea: {
    marginBottom: "28px",
  },

  eyebrow: {
    color: "#087cf0",
    fontSize: "13px",
    fontWeight: "900",
    letterSpacing: "1px",
  },

  title: {
    fontSize: "36px",
    margin: "10px 0 12px",
  },

  subtitle: {
    color: "#667085",
    fontSize: "17px",
    lineHeight: "1.5",
  },

  codeBox: {
    display: "inline-block",
    marginTop: "8px",
    padding: "9px 13px",
    background: "#eaf4ff",
    color: "#087cf0",
    borderRadius: "9px",
    fontSize: "13px",
  },

  card: {
    background: "#ffffff",
    padding: "32px",
    borderRadius: "24px",
    boxShadow: "0 12px 40px rgba(16,24,40,0.07)",
  },

  label: {
    display: "block",
    fontWeight: "700",
    fontSize: "14px",
    marginBottom: "22px",
  },

  input: {
    display: "block",
    width: "100%",
    boxSizing: "border-box",
    marginTop: "9px",
    padding: "15px 16px",
    border: "1px solid #d0d5dd",
    borderRadius: "12px",
    fontSize: "15px",
    outline: "none",
    background: "#ffffff",
  },

  activeBox: {
    display: "flex",
    alignItems: "flex-start",
    gap: "13px",
    background: "#f7f9fc",
    padding: "18px",
    borderRadius: "14px",
    marginBottom: "22px",
    cursor: "pointer",
  },

  checkbox: {
    marginTop: "3px",
    width: "17px",
    height: "17px",
  },

  activeTitle: {
    fontWeight: "800",
    fontSize: "15px",
  },

  activeText: {
    color: "#667085",
    fontSize: "12px",
    marginTop: "5px",
  },

  saveButton: {
    width: "100%",
    border: "none",
    background: "#087cf0",
    color: "#ffffff",
    padding: "17px",
    borderRadius: "13px",
    fontSize: "16px",
    fontWeight: "800",
    cursor: "pointer",
  },

  viewCard: {
    display: "block",
    textAlign: "center",
    marginTop: "18px",
    color: "#087cf0",
    fontWeight: "700",
    textDecoration: "none",
    fontSize: "14px",
  },

  success: {
    background: "#ecfdf3",
    color: "#027a48",
    padding: "13px",
    borderRadius: "10px",
    marginBottom: "18px",
    fontSize: "14px",
    fontWeight: "700",
  },

  error: {
    background: "#fef3f2",
    color: "#b42318",
    padding: "13px",
    borderRadius: "10px",
    marginBottom: "18px",
    fontSize: "14px",
    fontWeight: "700",
  },

  errorBox: {
    background: "#ffffff",
    padding: "30px",
    borderRadius: "18px",
    textAlign: "center",
  },

  backLink: {
    display: "inline-block",
    marginTop: "18px",
    color: "#087cf0",
  },

  footer: {
    textAlign: "center",
    color: "#98a2b3",
    fontSize: "12px",
    marginTop: "28px",
  },
};
