"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewIbanCardPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    business_name: "",
    bank_name: "",
    account_holder: "",
    iban: "",
    active: true,
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  function updateField(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setMessage("");

   try {
  const token = localStorage.getItem("dokunuver_access_token");

  if (!token) {
    throw new Error(
      "Oturum bulunamadı. Lütfen tekrar giriş yapın."
    );
  }

  const response = await fetch("/api/iban-cards", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(form),
  });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Kart oluşturulamadı.");
      }

      router.push("/panel");
      router.refresh();
    } catch (error) {
      setMessage(error.message);
      setSaving(false);
    }
  }

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <header style={styles.header}>
          <div>
            <div style={styles.logo}>DOKUNUVER</div>
            <div style={styles.slogan}>Dokun. Bağlan.</div>
          </div>

          <button
            type="button"
            onClick={() => router.push("/panel")}
            style={styles.backButton}
          >
            ← Panele Dön
          </button>
        </header>

        <div style={styles.titleArea}>
          <div style={styles.eyebrow}>DOKUNUVER PANEL</div>
          <h1 style={styles.title}>Yeni IBAN Kartı</h1>
          <p style={styles.description}>
            Müşterinin ödeme bilgilerini girerek yeni bir NFC IBAN kartı
            oluşturun.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={styles.card}>
          <Field
            label="İşletme / Kart Adı"
            name="business_name"
            value={form.business_name}
            onChange={updateField}
            placeholder="Örn: Pinkrose Cafe"
          />

          <Field
            label="Banka"
            name="bank_name"
            value={form.bank_name}
            onChange={updateField}
            placeholder="Örn: Ziraat Bankası"
          />

          <Field
            label="Hesap Sahibi"
            name="account_holder"
            value={form.account_holder}
            onChange={updateField}
            placeholder="Ad Soyad / Firma Ünvanı"
          />

          <Field
            label="IBAN"
            name="iban"
            value={form.iban}
            onChange={updateField}
            placeholder="TR00 0000 0000 0000 0000 0000 00"
          />

          <label style={styles.activeRow}>
  <input
    type="checkbox"
    checked={form.active}
    onChange={(e) =>
      setForm((prev) => ({
        ...prev,
        active: e.target.checked,
      }))
    }
  />

  <div>
    <div style={styles.activeTitle}>Kart aktif olsun</div>
    <div style={styles.activeDescription}>
      Aktif kartlar NFC bağlantısı üzerinden görüntülenebilir.
    </div>
  </div>
</label>

<div style={styles.securityInfo}>
  <div style={styles.securityTitle}>
    🔒 Güvenli doğrulama
  </div>

  <div style={styles.securityText}>
    Kart oluşturulduktan sonra banka, hesap sahibi ve IBAN
    bilgilerini son kez kontrol ederek doğrulayabilir ve
    kilitleyebilirsiniz. Kilitlenen finansal bilgiler normal
    yönetim işlemleriyle değiştirilemez.
  </div>
</div>

{message && <div style={styles.error}>{message}</div>}

<button
  type="submit"
  disabled={saving}
  style={{
    ...styles.submitButton,
    opacity: saving ? 0.6 : 1,
  }}
>
  {saving ? "Oluşturuluyor..." : "IBAN Kartını Oluştur"}
</button>
</form>

        <p style={styles.footer}>DOKUNUVER NFC Platform</p>
      </div>
    </main>
  );
}

function Field({ label, ...props }) {
  return (
    <div style={styles.field}>
      <label style={styles.label}>{label}</label>

      <input
        {...props}
        required
        style={styles.input}
      />
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f4f7fb",
    fontFamily: "Arial, sans-serif",
    padding: "30px 20px",
    color: "#101828",
  },

  container: {
    maxWidth: "760px",
    margin: "0 auto",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "45px",
  },

  logo: {
    fontSize: "22px",
    fontWeight: "900",
  },

  slogan: {
    color: "#087cf0",
    fontSize: "12px",
    fontWeight: "700",
    marginTop: "4px",
  },

  backButton: {
    background: "#ffffff",
    border: "1px solid #d0d5dd",
    borderRadius: "10px",
    padding: "11px 16px",
    fontWeight: "700",
    cursor: "pointer",
  },

  titleArea: {
    marginBottom: "24px",
  },

  eyebrow: {
    color: "#087cf0",
    fontSize: "12px",
    fontWeight: "800",
    letterSpacing: "1px",
  },

  title: {
    fontSize: "34px",
    margin: "8px 0",
  },

  description: {
    color: "#667085",
    lineHeight: "1.6",
  },

  card: {
    background: "#ffffff",
    padding: "32px",
    borderRadius: "22px",
    boxShadow: "0 12px 40px rgba(16,24,40,0.08)",
  },

  field: {
    marginBottom: "22px",
  },

  label: {
    display: "block",
    fontSize: "13px",
    fontWeight: "800",
    marginBottom: "8px",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "15px 16px",
    borderRadius: "10px",
    border: "1px solid #d0d5dd",
    fontSize: "15px",
    outline: "none",
  },

  activeRow: {
    display: "flex",
    gap: "12px",
    alignItems: "flex-start",
    background: "#f7f9fc",
    padding: "17px",
    borderRadius: "12px",
    marginBottom: "22px",
    cursor: "pointer",
  },

  activeTitle: {
    fontWeight: "800",
    fontSize: "14px",
  },

  activeDescription: {
    color: "#667085",
    fontSize: "12px",
    marginTop: "4px",
  },

  error: {
    background: "#fef3f2",
    color: "#b42318",
    padding: "13px",
    borderRadius: "10px",
    marginBottom: "18px",
    fontSize: "13px",
  },

  submitButton: {
    width: "100%",
    border: "none",
    borderRadius: "11px",
    padding: "16px",
    background: "#087cf0",
    color: "#ffffff",
    fontSize: "15px",
    fontWeight: "800",
    cursor: "pointer",
  },

  footer: {
    textAlign: "center",
    color: "#98a2b3",
    fontSize: "12px",
    marginTop: "25px",
  },
  securityInfo: {
  background: "#ecfdf3",
  border: "1px solid #abefc6",
  padding: "15px 17px",
  borderRadius: "12px",
  marginBottom: "22px",
},

securityTitle: {
  color: "#067647",
  fontSize: "13px",
  fontWeight: "800",
  marginBottom: "5px",
},

securityText: {
  color: "#067647",
  fontSize: "12px",
  lineHeight: "1.6",
},
};
