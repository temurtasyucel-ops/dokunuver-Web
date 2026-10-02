"use client";
import { panelFetch } from "../../../../lib/panel-client.mjs";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function BulkSmartLinksPage() {
  const router = useRouter();

  const [productType, setProductType] = useState("google");
  const [quantity, setQuantity] = useState(20);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    if (quantity < 1 || quantity > 100) {
      setMessage("Adet 1 ile 100 arasında olmalıdır.");
      return;
    }

    const confirmed = window.confirm(
      `${quantity} adet stok Smart Link oluşturulacak. Devam edilsin mi?`
    );

    if (!confirmed) return;

    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("dokunuver_access_token");

      if (!token) {
        setMessage("Oturum bulunamadı. Lütfen tekrar giriş yapın.");
        setLoading(false);
        return;
      }

      const response = await panelFetch("/api/smart-links/bulk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          product_type: productType,
          quantity: Number(quantity),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || "Stok oluşturulamadı.");
        setLoading(false);
        return;
      }

      setMessage(
        `${data.count} adet stok Smart Link başarıyla oluşturuldu.`
      );

      setTimeout(() => {
        router.push("/panel/smart-links");
        router.refresh();
      }, 1500);
    } catch (error) {
      console.error(error);
      setMessage("Bir hata oluştu.");
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        maxWidth: "760px",
        margin: "0 auto",
        padding: "40px 20px",
      }}
    >
      <button
        type="button"
        onClick={() => router.push("/panel/smart-links")}
        style={{
          border: "none",
          background: "transparent",
          padding: 0,
          marginBottom: "28px",
          cursor: "pointer",
          fontWeight: "700",
          fontSize: "15px",
        }}
      >
        ← Smart Links'e Dön
      </button>

      <h1
        style={{
          fontSize: "34px",
          marginBottom: "10px",
        }}
      >
        Toplu Stok Oluştur
      </h1>

      <p
        style={{
          color: "#667085",
          marginBottom: "32px",
          lineHeight: "1.6",
        }}
      >
        Baskı öncesinde müşterisi henüz belli olmayan Smart Linkleri
        toplu olarak oluşturabilirsiniz. Her fiziksel ürün için farklı
        bir DOKUNUVER kodu üretilecektir.
      </p>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "24px" }}>
          <label
            style={{
              display: "block",
              fontWeight: "700",
              marginBottom: "8px",
            }}
          >
            Ürün Tipi
          </label>

          <select
            value={productType}
            onChange={(e) => setProductType(e.target.value)}
            style={{
              width: "100%",
              padding: "14px",
              border: "1px solid #d0d5dd",
              borderRadius: "10px",
              fontSize: "16px",
              background: "#ffffff",
            }}
          >
            <option value="google">Google Yorum</option>
            <option value="instagram">Instagram</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="ilan">İlan</option>
            <option value="diger">Diğer</option>
          </select>
        </div>

        <div style={{ marginBottom: "30px" }}>
          <label
            style={{
              display: "block",
              fontWeight: "700",
              marginBottom: "8px",
            }}
          >
            Üretilecek Adet
          </label>

          <input
            type="number"
            min="1"
            max="100"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "14px",
              border: "1px solid #d0d5dd",
              borderRadius: "10px",
              fontSize: "16px",
            }}
          />

          <div
            style={{
              marginTop: "8px",
              color: "#667085",
              fontSize: "13px",
            }}
          >
            Tek seferde en fazla 100 adet oluşturabilirsiniz.
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            border: "none",
            padding: "15px 20px",
            borderRadius: "10px",
            background: loading ? "#98a2b3" : "#111827",
            color: "#ffffff",
            fontWeight: "800",
            fontSize: "16px",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading
            ? "Oluşturuluyor..."
            : `${quantity} Stok Kartı Oluştur`}
        </button>
      </form>

      {message && (
        <div
          style={{
            marginTop: "24px",
            padding: "14px 16px",
            background: "#f2f4f7",
            borderRadius: "10px",
            fontWeight: "600",
          }}
        >
          {message}
        </div>
      )}
    </main>
  );
}

