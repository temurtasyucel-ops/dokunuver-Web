"use client";

import { useState } from "react";
import QRCode from "qrcode";

export default function QRCodeButton({ code }) {
  const [qrImage, setQrImage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const smartLink = `https://dokunuver.com.tr/x/${code}`;

  async function generateQR() {
    try {
      setLoading(true);
      setError("");

      const dataUrl = await QRCode.toDataURL(smartLink, {
        width: 800,
        margin: 2,
        errorCorrectionLevel: "H",
      });

      setQrImage(dataUrl);
    } catch (err) {
      console.error("QR oluşturma hatası:", err);
      setError("QR kod oluşturulamadı.");
    } finally {
      setLoading(false);
    }
  }

  function downloadQR() {
    if (!qrImage) return;

    const link = document.createElement("a");
    link.href = qrImage;
    link.download = `DOKUNUVER-${code}-QR.png`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div>
      {!qrImage && (
        <button
          type="button"
          onClick={generateQR}
          disabled={loading}
          style={{
            border: "1px solid #d0d5dd",
            padding: "10px 16px",
            background: "#ffffff",
            color: "#344054",
            borderRadius: "10px",
            fontSize: "14px",
            fontWeight: "800",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "QR Oluşturuluyor..." : "QR Göster"}
        </button>
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

      {qrImage && (
        <div
          style={{
            marginTop: "16px",
            padding: "20px",
            background: "#f8fafc",
            border: "1px solid #eaecf0",
            borderRadius: "16px",
            maxWidth: "300px",
          }}
        >
          <img
            src={qrImage}
            alt={`DOKUNUVER ${code} QR Kod`}
            style={{
              display: "block",
              width: "100%",
              height: "auto",
              background: "#ffffff",
              borderRadius: "10px",
            }}
          />

          <div
            style={{
              marginTop: "12px",
              fontSize: "12px",
              color: "#667085",
              wordBreak: "break-all",
              lineHeight: "1.5",
            }}
          >
            {smartLink}
          </div>

          <div
            style={{
              display: "flex",
              gap: "8px",
              marginTop: "14px",
              flexWrap: "wrap",
            }}
          >
            <button
              type="button"
              onClick={downloadQR}
              style={{
                border: "none",
                padding: "10px 14px",
                background: "#087cf0",
                color: "#ffffff",
                borderRadius: "9px",
                fontSize: "13px",
                fontWeight: "800",
                cursor: "pointer",
              }}
            >
              PNG Kaydet
            </button>

            <button
              type="button"
              onClick={() => setQrImage("")}
              style={{
                border: "1px solid #d0d5dd",
                padding: "10px 14px",
                background: "#ffffff",
                color: "#344054",
                borderRadius: "9px",
                fontSize: "13px",
                fontWeight: "800",
                cursor: "pointer",
              }}
            >
              QR Gizle
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
"use client";

import { useState } from "react";
import QRCode from "qrcode";

export default function QRCodeButton({ code }) {
  const [qrImage, setQrImage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const smartLink = `https://dokunuver.com.tr/x/${code}`;

  async function generateQR() {
    try {
      setLoading(true);
      setError("");

      const dataUrl = await QRCode.toDataURL(smartLink, {
        width: 800,
        margin: 2,
        errorCorrectionLevel: "H",
      });

      setQrImage(dataUrl);
    } catch (err) {
      console.error("QR oluşturma hatası:", err);
      setError("QR kod oluşturulamadı.");
    } finally {
      setLoading(false);
    }
  }

  function downloadQR() {
    if (!qrImage) return;

    const link = document.createElement("a");
    link.href = qrImage;
    link.download = `DOKUNUVER-${code}-QR.png`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div>
      {!qrImage && (
        <button
          type="button"
          onClick={generateQR}
          disabled={loading}
          style={{
            border: "1px solid #d0d5dd",
            padding: "10px 16px",
            background: "#ffffff",
            color: "#344054",
            borderRadius: "10px",
            fontSize: "14px",
            fontWeight: "800",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "QR Oluşturuluyor..." : "QR Göster"}
        </button>
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

      {qrImage && (
        <div
          style={{
            marginTop: "16px",
            padding: "20px",
            background: "#f8fafc",
            border: "1px solid #eaecf0",
            borderRadius: "16px",
            maxWidth: "300px",
          }}
        >
          <img
            src={qrImage}
            alt={`DOKUNUVER ${code} QR Kod`}
            style={{
              display: "block",
              width: "100%",
              height: "auto",
              background: "#ffffff",
              borderRadius: "10px",
            }}
          />

          <div
            style={{
              marginTop: "12px",
              fontSize: "12px",
              color: "#667085",
              wordBreak: "break-all",
              lineHeight: "1.5",
            }}
          >
            {smartLink}
          </div>

          <div
            style={{
              display: "flex",
              gap: "8px",
              marginTop: "14px",
              flexWrap: "wrap",
            }}
          >
            <button
              type="button"
              onClick={downloadQR}
              style={{
                border: "none",
                padding: "10px 14px",
                background: "#087cf0",
                color: "#ffffff",
                borderRadius: "9px",
                fontSize: "13px",
                fontWeight: "800",
                cursor: "pointer",
              }}
            >
              PNG Kaydet
            </button>

            <button
              type="button"
              onClick={() => setQrImage("")}
              style={{
                border: "1px solid #d0d5dd",
                padding: "10px 14px",
                background: "#ffffff",
                color: "#344054",
                borderRadius: "9px",
                fontSize: "13px",
                fontWeight: "800",
                cursor: "pointer",
              }}
            >
              QR Gizle
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
