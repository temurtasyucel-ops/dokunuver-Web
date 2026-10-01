"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import LogoutButton from "./LogoutButton";

export default function AuthGuard({ children }) {
  const router = useRouter(), pathname = usePathname();
  const [checking, setChecking] = useState(true), [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    let alive = true;
    async function checkAuth() {
      if (pathname === "/panel/login") { setChecking(false); setError(""); return; }
      setChecking(true); setError("");
      const token = localStorage.getItem("dokunuver_access_token");
      if (!token) { router.replace("/panel/login"); return; }
      try {
        const response = await fetch("/api/panel-session", { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" });
        const data = await response.json();
        if (!alive) return;
        if (response.status === 401) {
          localStorage.removeItem("dokunuver_access_token"); localStorage.removeItem("dokunuver_refresh_token");
          router.replace("/panel/login"); return;
        }
        if (!response.ok) throw new Error(data.error || "Panel yetkisi doğrulanamadı.");
        setChecking(false);
      } catch (e) { if (alive) { setError(e.message || "Bağlantı kurulamadı. Lütfen tekrar deneyin."); setChecking(false); } }
    }
    checkAuth();
    return () => { alive = false; };
  }, [pathname, router, retry]);
  if (pathname === "/panel/login") return children;
  if (checking || error) return <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#f4f6f8", fontFamily: "Arial,sans-serif", padding: 24, boxSizing: "border-box" }}><div style={{ maxWidth: 440, padding: 32, background: "white", border: "1px solid #e1e5eb", borderRadius: 16 }}><strong style={{ fontSize: 24 }}>DOKUNUVER</strong>{error ? <><p role="alert" style={{ lineHeight: 1.6 }}>{error}</p><div style={{ display: "flex", gap: 12 }}><button type="button" onClick={() => setRetry(n => n + 1)}>Tekrar dene</button><LogoutButton /></div></> : <p role="status">Yönetici oturumu kontrol ediliyor…</p>}</div></main>;
  return children;
}
