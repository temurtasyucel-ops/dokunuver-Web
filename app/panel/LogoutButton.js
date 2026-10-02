"use client";

import { panelClient } from "../../lib/panel-client.mjs";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    const accessToken = localStorage.getItem("dokunuver_access_token");
    panelClient().clear();
    try {

      if (accessToken) {
        await fetch(`${url}/auth/v1/logout`, {
          method: "POST",
          headers: {
            apikey: key,
            Authorization: `Bearer ${accessToken}`,
          },
        });
      }
    } catch (error) {
      console.error("Çıkış hatası:", error);
    } finally {
      if (!localStorage.getItem("dokunuver_access_token")) router.replace("/panel/login");
    }
  }

  return (
    <button
      onClick={handleLogout}
      style={{
        border: "1px solid #d0d5dd",
        background: "#ffffff",
        color: "#101828",
        borderRadius: "12px",
        padding: "11px 18px",
        fontSize: "14px",
        fontWeight: "700",
        cursor: "pointer",
      }}
    >
      Çıkış Yap
    </button>
  );
}
