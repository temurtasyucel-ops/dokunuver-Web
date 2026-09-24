"use client";

import { useState } from "react";
import QRCode from "qrcode";
import JSZip from "jszip";

const productNames = {
  google: "Google",
  instagram: "Instagram",
  whatsapp: "WhatsApp",
  ilan: "İlan",
  diger: "Diğer",
};

export default function BulkQRCodeButton({ links }) {
  const [loadingType, setLoadingType] = useState("");
  const [error, setError] = useState("");

  const stockLinks = links.filter(
    (link) => link.status === "stock"
  );

  const stockGroups = Object.keys(productNames)
    .map((type) => ({
      type,
      name: productNames[type],
      links: stockLinks.filter(
        (link) => link.product_type === type
      ),
    }))
    .filter((group) => group.links.length > 0);

  async function downloadBulkQR(group) {
    try {
      setLoadingType(group.type);
      setError("");

      const zip = new JSZip();

      for (const link of group.links) {
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
      a.download =
        `DOKUNUVER-${group.type.toUpperCase()}-STOK-QR.zip`;

      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error("Toplu QR oluşturma hatası:", err);
      setError("Toplu QR dosyası oluşturulamadı.");
    } finally {
      setLoadingType("");
    }
  }

  if (stockGroups.length === 0) {
    return null;
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
        }}
      >
        {stockGroups.map((group) => (
          <button
            key={group.type}
            type="button"
            onClick={() => downloadBulkQR(group)}
            disabled={Boolean(loadingType)}
            style={{
              border: "1px solid #d0d5dd",
              padding: "12px 18px",
              background: "#ffffff",
              color: "#344054",
              borderRadius: "10px",
              fontSize: "14px",
              fontWeight: "800",
              cursor: loadingType
                ? "not-allowed"
                : "pointer",
              opacity: loadingType ? 0.6 : 1,
            }}
          >
            {loadingType === group.type
              ? "QR'lar Hazırlanıyor..."
              : `${group.name} QR'larını İndir (${group.links.length})`}
          </button>
        ))}
      </div>

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
