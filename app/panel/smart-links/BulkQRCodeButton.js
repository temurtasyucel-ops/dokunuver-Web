"use client";

import { useState } from "react";
import QRCode from "qrcode";
import JSZip from "jszip";

export default function BulkQRCodeButton({ links }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function downloadBulkQR() {
    try {
      setLoading(true);
      setError("");

      const stockLinks = links.filter(
        (link) => link.status === "stock"
      );

      if (stockLinks.length === 0) {
        setError("İndirilecek stok QR kodu bulunamadı.");
        return;
      }

      const zip = new JSZip();

      for (const link of stockLinks) {
        const smartLink =
          `https://dokunuver.com.tr/x/${link.code}`;

        const dataUrl = await QRCode.toDataURL(smartLink, {
          width: 800,
          margin: 2,
          errorCorrectionLevel: "H",
        });

        const base64Data = dataUrl.split(",")[1];

        zip.file(
          `DOKUNUVER-${link.code}-QR.png`,
          base64Data,
          { base64: true }
        );
      }

      const zipBlob = await zip.generateAsync({
        type: "blob",
      });

      const downloadUrl = URL.createObjectURL(zipBlob);

      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = "DOKUNUVER-STOK-QR.zip";

      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error("Toplu QR oluşturma hatası:", err);
      setError("Toplu QR dosyası oluşturulamadı.");
    } finally {
      setLoading(false);
    }
  }

  const stockCount = links.filter(
    (link) => link.status === "stock"
  ).length;

  return (
    <div>
      <button
        type="button"
        onClick={downloadBulkQR}
        disabled={loading || stockCount === 0}
        style={{
          border: "1px solid #d0d5dd",
          padding: "12px 18px",
          background:
            loading || stockCount === 0
              ? "#f2f4f7"
              : "#ffffff",
          color:
            stockCount === 0
              ? "#98a2b3"
              : "#344054",
          borderRadius: "10px",
          fontSize: "14px",
          fontWeight: "800",
          cursor:
            loading || stockCount === 0
              ? "not-allowed"
              : "pointer",
        }}
      >
        {loading
          ? "QR'lar Hazırlanıyor..."
          : `Stok QR'larını Toplu İndir (${stockCount})`}
      </button>

      {error && (
        <div
          style={{
            marginTop: "10px",
            color: "#b42318",
            fontSize: "13px",
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
}
