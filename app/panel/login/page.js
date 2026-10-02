"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { panelClient } from "../../../lib/panel-client.mjs";
import { loginToPanel } from "../../../lib/panel-login.mjs";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const data = await loginToPanel({
        url: process.env.NEXT_PUBLIC_SUPABASE_URL,
        key: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
        email,
        password,
      });

      panelClient().store(data);

      router.push("/panel");
    } catch (err) {
      setError(err.message || "Giriş yapılamadı.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <div style={styles.brand}>
          <div style={styles.logo}>DOKUNUVER</div>
          <div style={styles.slogan}>Dokun. Bağlan.</div>
        </div>

        <div style={styles.card}>
          <div style={styles.badge}>DOKUNUVER PANEL</div>

          <h1 style={styles.title}>Yönetici Girişi</h1>

          <p style={styles.description}>
            NFC kart yönetim paneline erişmek için giriş yapın.
          </p>

          <form onSubmit={handleLogin}>
            <label style={styles.label}>
              E-posta
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E-posta adresiniz"
              autoComplete="email"
              required
              style={styles.input}
            />

            <label style={styles.label}>
              Şifre
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Şifreniz"
              autoComplete="current-password"
              required
              style={styles.input}
            />

            {error && (
              <div style={styles.error}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.button,
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
            </button>
          </form>

          <div style={styles.security}>
            🔒 Yetkili kullanıcı erişimi
          </div>
        </div>

        <div style={styles.footer}>
          DOKUNUVER NFC Platform
        </div>
      </div>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f4f7fb",
    fontFamily: "Arial, sans-serif",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px",
    boxSizing: "border-box",
  },

  container: {
    width: "100%",
    maxWidth: "460px",
  },

  brand: {
    textAlign: "center",
    marginBottom: "28px",
  },

  logo: {
    fontSize: "28px",
    fontWeight: "900",
    color: "#101828",
    letterSpacing: "-0.5px",
  },

  slogan: {
    marginTop: "4px",
    color: "#087cf0",
    fontSize: "13px",
    fontWeight: "700",
  },

  card: {
    background: "#ffffff",
    borderRadius: "26px",
    padding: "38px 30px",
    boxShadow: "0 14px 45px rgba(16,24,40,0.09)",
  },

  badge: {
    color: "#087cf0",
    fontSize: "12px",
    fontWeight: "800",
    letterSpacing: "1px",
    marginBottom: "10px",
  },

  title: {
    margin: "0",
    color: "#101828",
    fontSize: "30px",
    letterSpacing: "-0.7px",
  },

  description: {
    color: "#667085",
    fontSize: "14px",
    lineHeight: "1.6",
    margin: "10px 0 28px",
  },

  label: {
    display: "block",
    color: "#101828",
    fontSize: "14px",
    fontWeight: "700",
    marginBottom: "8px",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "15px 16px",
    borderRadius: "12px",
    border: "1px solid #d0d5dd",
    fontSize: "15px",
    outline: "none",
    marginBottom: "20px",
    background: "#ffffff",
    color: "#101828",
  },

  button: {
    width: "100%",
    border: "none",
    background: "#087cf0",
    color: "#ffffff",
    padding: "16px",
    borderRadius: "12px",
    fontSize: "15px",
    fontWeight: "800",
    cursor: "pointer",
    marginTop: "4px",
  },

  error: {
    background: "#fef3f2",
    color: "#b42318",
    border: "1px solid #fecdca",
    borderRadius: "10px",
    padding: "12px",
    fontSize: "13px",
    marginBottom: "16px",
  },

  security: {
    textAlign: "center",
    color: "#98a2b3",
    fontSize: "12px",
    marginTop: "22px",
  },

  footer: {
    textAlign: "center",
    color: "#98a2b3",
    fontSize: "12px",
    marginTop: "22px",
  },
};
