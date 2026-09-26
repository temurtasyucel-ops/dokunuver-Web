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

export default function BulkQRCodeButton({
  links,
  batchCode = "",
}) {
  const [loadingType, setLoadingType] = useState("");
  const [error, setError] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  async function createZip(
    selectedLinks,
    loadingKey,
    fileName
  ) {
    try {
      setLoadingType(loadingKey);
      setError("");
      setMenuOpen(false);

      const zip = new JSZip();

      for (const link of selectedLinks) {
        const smartLink =
          `https://dokunuver.com.tr/x/${link.code}`;

        const dataUrl = await QRCode.toDataURL(
          smartLink,
          {
            width: 800,
            margin: 2,
            errorCorrectionLevel: "H",
          }
        );

        const base64Data =
          dataUrl.split(",")[1];

        zip.file(
          `DOKUNUVER-${link.code}-QR.png`,
          base64Data,
          { base64: true }
        );
      }

      const zipBlob =
        await zip.generateAsync({
          type: "blob",
        });

      const downloadUrl =
        URL.createObjectURL(zipBlob);

      const a =
        document.createElement("a");

      a.href = downloadUrl;
      a.download = fileName;

      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error(
        "Toplu QR oluşturma hatası:",
        err
      );

      setError(
        "Toplu QR dosyası oluşturulamadı."
      );
    } finally {
      setLoadingType("");
    }
  }

  // ÜRETİM PARTİSİ MODU
  // Bu bölümün çalışma mantığı değişmedi.
  if (batchCode) {
    if (!links || links.length === 0) {
      return null;
    }

    return (
      <div>
        <button
          type="button"
          onClick={() =>
            createZip(
              links,
              batchCode,
              `DOKUNUVER-${batchCode}-${links.length}-ADET-QR.zip`
            )
          }
          disabled={Boolean(loadingType)}
          style={{
            border: "1px solid #d0d5dd",
            padding: "10px 16px",
            background: "#ffffff",
            color: "#344054",
            borderRadius: "10px",
            fontSize: "13px",
            fontWeight: "800",
            cursor: loadingType
              ? "not-allowed"
              : "pointer",
            opacity: loadingType ? 0.6 : 1,
          }}
        >
          {loadingType === batchCode
            ? "QR'lar Hazırlanıyor..."
            : "↓ QR'ları İndir"}
        </button>

        {error && (
          <div
            style={{
              marginTop: "8px",
              color: "#b42318",
              fontSize: "12px",
            }}
          >
            {error}
          </div>
        )}
      </div>
    );
  }

  // STOK QR MODU
  const stockLinks = (links || []).filter(
    (link) => link.status === "stock"
  );

  if (stockLinks.length === 0) {
    return null;
  }

  const stockGroups =
    Object.keys(productNames).map(
      (type) => ({
        type,
        name: productNames[type],
        links: stockLinks.filter(
          (link) =>
            link.product_type === type
        ),
      })
    );

  return (
    <div
      style={{
        position: "relative",
        display: "inline-block",
      }}
    >
      <button
        type="button"
        onClick={() =>
          setMenuOpen((current) => !current)
        }
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
        {loadingType
          ? "QR'lar Hazırlanıyor..."
          : `↓ Stok QR'larını İndir (${stockLinks.length})`}
      </button>

      {menuOpen && !loadingType && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            left: 0,
            width: "260px",
            padding: "8px",
            background: "#ffffff",
            border: "1px solid #d0d5dd",
            borderRadius: "12px",
            boxShadow:
              "0 12px 30px rgba(16,24,40,0.14)",
            zIndex: 100,
          }}
        >
          <button
            type="button"
            onClick={() =>
              createZip(
                stockLinks,
                "all",
                `DOKUNUVER-SMART-STOK-QR-${stockLinks.length}-ADET.zip`
              )
            }
            style={menuItemStyle(false)}
          >
            <span>Tümü</span>
            <strong>
              {stockLinks.length}
            </strong>
          </button>

          <div
            style={{
              height: "1px",
              background: "#eaecf0",
              margin: "6px 4px",
            }}
          />

          {stockGroups.map((group) => {
            const disabled =
              group.links.length === 0;

            return (
              <button
                key={group.type}
                type="button"
                disabled={disabled}
                onClick={() => {
                  if (disabled) return;

                  createZip(
                    group.links,
                    group.type,
                    `DOKUNUVER-${group.type.toUpperCase()}-STOK-QR-${group.links.length}-ADET.zip`
                  );
                }}
                style={menuItemStyle(
                  disabled
                )}
              >
                <span>
                  {group.name}
                </span>

                <strong>
                  {group.links.length}
                </strong>
              </button>
            );
          })}
        </div>
      )}

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

function menuItemStyle(disabled) {
  return {
    width: "100%",
    border: "none",
    background: "transparent",
    padding: "11px 12px",
    borderRadius: "8px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
    color: disabled
      ? "#98a2b3"
      : "#344054",
    fontSize: "14px",
    fontWeight: "700",
    cursor: disabled
      ? "not-allowed"
      : "pointer",
    opacity: disabled ? 0.55 : 1,
    textAlign: "left",
  };
}
