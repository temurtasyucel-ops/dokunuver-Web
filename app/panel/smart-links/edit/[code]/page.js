"use client";
import { panelFetch } from "../../../../../lib/panel-client.mjs";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditSmartLinkPage() {
  const router = useRouter();
  const params = useParams();
  const code = params.code;

  const [businessName, setBusinessName] = useState("");
  const [productType, setProductType] = useState("google");
  const [targetUrl, setTargetUrl] = useState("");
  const [status, setStatus] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [instagramUsername, setInstagramUsername] = useState("");
  const [googleMapsUrl, setGoogleMapsUrl] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadSmartLink();
  }, [code]);

  async function loadSmartLink() {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("dokunuver_access_token");

      if (!token) {
        setError("Oturum bulunamadı.");
        return;
      }

      const response = await panelFetch("/api/smart-links", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Smart Link alınamadı.");
      }

      const smartLink = data.find(
        (item) => item.code.toUpperCase() === code.toUpperCase()
      );

      if (!smartLink) {
        throw new Error("Smart Link bulunamadı.");
      }

      setBusinessName(smartLink.business_name || "");
setProductType(smartLink.product_type || "google");
setTargetUrl(smartLink.target_url || "");
setStatus(smartLink.status || "");

if (
  smartLink.product_type === "google" &&
  smartLink.target_url
) {
  setGoogleMapsUrl(smartLink.target_url);
}

if (
  smartLink.product_type === "whatsapp" &&
  smartLink.target_url
) {
  const phone = smartLink.target_url
    .replace(/^https?:\/\/wa\.me\//i, "")
    .replace(/\D/g, "");

  setWhatsappNumber(phone);
}

if (
  smartLink.product_type === "instagram" &&
  smartLink.target_url
) {
  const username = smartLink.target_url
    .replace(
      /^https?:\/\/(www\.)?instagram\.com\//i,
      ""
    )
    .split(/[/?#]/)[0];

  setInstagramUsername(username);
}
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
  e.preventDefault();

  try {
    setSaving(true);
    setError("");

    const token = localStorage.getItem("dokunuver_access_token");

    if (!token) {
      setError("Oturum bulunamadı.");
      return;
    }

    let finalTargetUrl = targetUrl.trim();

    if (productType === "whatsapp") {
      let phone = whatsappNumber.replace(/\D/g, "");

      if (phone.startsWith("0")) {
        phone = "90" + phone.substring(1);
      } else if (phone.length === 10) {
        phone = "90" + phone;
      }

      if (!/^90\d{10}$/.test(phone)) {
        setError(
          "Geçerli bir Türkiye telefon numarası girin. Örnek: 0532 123 45 67"
        );
        return;
      }

      finalTargetUrl = `https://wa.me/${phone}`;
    }
if (productType === "instagram") {
  let username = instagramUsername.trim();

  username = username
    .replace(/^https?:\/\/(www\.)?instagram\.com\//i, "")
    .replace(/^@/, "")
    .split(/[/?#]/)[0]
    .trim();

  if (!/^[A-Za-z0-9._]{1,30}$/.test(username)) {
    setError("Geçerli bir Instagram kullanıcı adı girin.");
    return;
  }

  finalTargetUrl = `https://www.instagram.com/${username}/`;
}
    if (productType === "google") {
  const googleUrl = googleMapsUrl.trim();

  if (!googleUrl) {
    setError("Google Maps işletme bağlantısını girin.");
    return;
  }

  try {
    const parsedUrl = new URL(googleUrl);

    if (
      !["http:", "https:"].includes(parsedUrl.protocol)
    ) {
      throw new Error();
    }

    finalTargetUrl = parsedUrl.toString();
  } catch {
    setError(
      "Geçerli bir Google Maps işletme bağlantısı girin."
    );
    return;
  }
}
    const response = await panelFetch("/api/smart-links", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        code,
        business_name: businessName.trim(),
        product_type: productType,
        target_url: finalTargetUrl,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Smart Link güncellenemedi.");
    }

    router.push("/panel/smart-links");
    router.refresh();
  } catch (err) {
    setError(err.message);
  } finally {
    setSaving(false);
  }
}

  if (loading) {
    return (
      <main
        style={{
          maxWidth: "760px",
          margin: "0 auto",
          padding: "50px 24px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        Yükleniyor...
      </main>
    );
  }

  return (
    <main
      style={{
        maxWidth: "760px",
        margin: "0 auto",
        padding: "50px 24px 80px",
        fontFamily: "Arial, sans-serif",
        color: "#101828",
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
          color: "#087cf0",
          fontSize: "14px",
          fontWeight: "700",
          cursor: "pointer",
        }}
      >
        ← Smart Links'e Dön
      </button>

      <div style={{ marginBottom: "36px" }}>
        <div
          style={{
            color: "#087cf0",
            fontSize: "13px",
            fontWeight: "900",
            letterSpacing: "1px",
            marginBottom: "12px",
          }}
        >
          DOKUNUVER PANEL
        </div>

        <h1
          style={{
            margin: "0 0 12px",
            fontSize: "clamp(30px, 5vw, 44px)",
          }}
        >
          {status === "stock"
  ? "Stok Kartını Müşteriye Ata"
  : "Smart Link Düzenle"}
        </h1>

        <p
          style={{
            margin: 0,
            color: "#667085",
            lineHeight: "1.6",
          }}
        >
          Kod: <strong>{code}</strong>
        </p>
      </div>

      {error && (
        <div
          style={{
            marginBottom: "20px",
            padding: "14px",
            background: "#fff1f0",
            border: "1px solid #fecdca",
            borderRadius: "10px",
            color: "#b42318",
            fontSize: "14px",
          }}
        >
          {error}
        </div>
      )}

      {!error && (
        <form
          onSubmit={handleSubmit}
          style={{
            background: "#ffffff",
            border: "1px solid #eaecf0",
            borderRadius: "20px",
            padding: "28px",
          }}
        >
          <label style={labelStyle}>
            İşletme / Müşteri Adı

            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              required
              style={inputStyle}
            />
          </label>

          <label style={labelStyle}>
            Ürün Tipi

           <select
  value={productType}
  disabled
  style={{
    ...inputStyle,
    background: "#f2f4f7",
    color: "#667085",
    cursor: "not-allowed",
  }}
>
              <option value="google">Google Yorum</option>
              <option value="instagram">Instagram</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="ilan">İlan</option>
              <option value="diger">Diğer</option>
            </select>
          </label>
{productType === "whatsapp" ? (
  <label style={labelStyle}>
    WhatsApp Telefon Numarası

    <input
      type="tel"
      value={whatsappNumber}
      onChange={(e) => setWhatsappNumber(e.target.value)}
      placeholder="05XX XXX XX XX"
      required
      style={inputStyle}
    />
  </label>
) : productType === "instagram" ? (
  <label style={labelStyle}>
    Instagram Kullanıcı Adı

    <input
      type="text"
      value={instagramUsername}
      onChange={(e) => setInstagramUsername(e.target.value)}
      placeholder="@kullaniciadi"
      required
      style={inputStyle}
    />
  </label>
) : productType === "google" ? (
  <label style={labelStyle}>
    Google Maps İşletme Bağlantısı

    <input
      type="url"
      value={googleMapsUrl}
      onChange={(e) => setGoogleMapsUrl(e.target.value)}
      placeholder="https://maps.app.goo.gl/..."
      required
      style={inputStyle}
    />
    </label>
) : productType === "ilan" ? (
  <label style={labelStyle}>
    İlan Bağlantısı

    <input
      type="url"
      value={targetUrl}
      onChange={(e) => setTargetUrl(e.target.value)}
      placeholder="https://..."
      required
      style={inputStyle}
    />
  </label>
) : (
  <label style={labelStyle}>
    Hedef Bağlantı

    <input
      type="url"
      value={targetUrl}
      onChange={(e) => setTargetUrl(e.target.value)}
      placeholder="https://..."
      required
      style={inputStyle}
    />
  </label>
)}

          <div
            style={{
              marginTop: "-6px",
              marginBottom: "24px",
              padding: "14px",
              background: "#f8fafc",
              borderRadius: "10px",
              color: "#667085",
              fontSize: "13px",
              lineHeight: "1.6",
            }}
          >
            DOKUNUVER bağlantısı değişmeyecek:
            <br />
            <strong style={{ color: "#344054" }}>
              dokunuver.com.tr/x/{code}
            </strong>
          </div>

          <button
            type="submit"
            disabled={saving}
            style={{
              width: "100%",
              border: "none",
              borderRadius: "12px",
              padding: "15px 20px",
              background: saving ? "#98a2b3" : "#087cf0",
              color: "#ffffff",
              fontSize: "15px",
              fontWeight: "800",
              cursor: saving ? "not-allowed" : "pointer",
            }}
          >
            {saving ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
          </button>
        </form>
      )}
    </main>
  );
}

const labelStyle = {
  display: "block",
  marginBottom: "22px",
  fontSize: "14px",
  fontWeight: "700",
  color: "#344054",
};

const inputStyle = {
  display: "block",
  width: "100%",
  boxSizing: "border-box",
  marginTop: "8px",
  padding: "13px 14px",
  border: "1px solid #d0d5dd",
  borderRadius: "10px",
  background: "#ffffff",
  color: "#101828",
  fontSize: "15px",
  outline: "none",
};

