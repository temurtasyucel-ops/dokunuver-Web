"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function AuthGuard({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      // Login sayfası korumanın dışında
      if (pathname === "/panel/login") {
        setChecking(false);
        return;
      }

      const token = localStorage.getItem("dokunuver_access_token");

      if (!token) {
        router.replace("/panel/login");
        return;
      }

      try {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const key =
          process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

        const response = await fetch(`${url}/auth/v1/user`, {
          method: "GET",
          headers: {
            apikey: key,
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          localStorage.removeItem("dokunuver_access_token");
          localStorage.removeItem("dokunuver_refresh_token");

          router.replace("/panel/login");
          return;
        }

        setChecking(false);
      } catch {
        localStorage.removeItem("dokunuver_access_token");
        localStorage.removeItem("dokunuver_refresh_token");

        router.replace("/panel/login");
      }
    }

    checkAuth();
  }, [pathname, router]);

  if (checking) {
    return (
      <main
        style={{
          minHeight: "100vh",
          background: "#f4f7fb",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            textAlign: "center",
            color: "#667085",
          }}
        >
          <div
            style={{
              fontSize: "24px",
              fontWeight: "900",
              color: "#101828",
              marginBottom: "8px",
            }}
          >
            DOKUNUVER
          </div>

          <div>Oturum kontrol ediliyor...</div>
        </div>
      </main>
    );
  }

  return children;
}
