"use client";

import { useState } from "react";

export default function IbanDemo() {
  const [copied, setCopied] = useState(false);

  const iban = "TR00 0000 0000 0000 0000 0000 00";
  const ibanCopy = iban.replace(/\s/g, "");

  async function copyIban() {
    try {
      await navigator.clipboard.writeText(ibanCopy);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2500);
    } catch {
      alert("IBAN kopyalanamadı. Lütfen IBAN'a basılı tutarak kopyalayın.");
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f4f7fb",
        fontFamily: "Arial, sans-serif",
        padding: "24px 18px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "440px",
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              fontSize: "25px",
              fontWeight: "800",
              color: "#101828",
              letterSpacing: "-0.5px",
            }}
          >
            DOKUNUVER
          </div>

          <div
            style={{
              fontSize: "13px",
              color: "#087cf0",
              fontWeight: "700",
              marginTop: "3px",
            }}
          >
            Dokun. Bağlan.
          </div>
        </div>

        <div
          style={{
            background: "#ffffff",
            borderRadius: "26px",
            padding: "30px 22px",
            boxShadow: "0 12px 40px rgba(16,24,40,0.08)",
          }}
        >
          <div
            style={{
              width: "62px",
              height: "62px",
              borderRadius: "18px",
              background: "#087cf0",
              color: "#ffffff",
              margin: "0 auto 20px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "29px",
            }}
          >
            ₺
          </div>

          <div
            style={{
              textAlign: "center",
              color: "#667085",
              fontSize: "14px",
              marginBottom: "7px",
            }}
          >
            Ödeme Bilgileri
          </div>

          <h1
            style={{
              textAlign: "center",
              color: "#101828",
              fontSize: "25px",
              margin: "0 0 28px",
            }}
          >
            DOKUNUVER DEMO
          </h1>

          <div
            style={{
              borderTop: "1px solid #eaecf0",
              paddingTop: "22px",
            }}
          >
            <p
              style={{
                color: "#98a2b3",
                fontSize: "12px",
                margin: "0 0 5px",
              }}
            >
              BANKA
            </p>

            <p
              style={{
                color: "#101828",
                fontSize: "17px",
                fontWeight: "700",
                margin: "0 0 20px",
              }}
            >
              Demo Bankası
            </p>

            <p
              style={{
                color: "#98a2b3",
                fontSize: "12px",
                margin: "0 0 5px",
              }}
            >
              HESAP SAHİBİ
            </p>

            <p
              style={{
                color: "#101828",
                fontSize: "17px",
                fontWeight: "700",
                margin: "0 0 20px",
              }}
            >
              DOKUNUVER DEMO
            </p>

            <p
              style={{
                color: "#98a2b3",
                fontSize: "12px",
                margin: "0 0 7px",
              }}
            >
              IBAN
            </p>

            <div
              style={{
                background: "#f7f9fc",
                padding: "16px",
                borderRadius: "14px",
                fontSize: "16px",
                fontWeight: "700",
                color: "#101828",
                lineHeight: "1.6",
                wordBreak: "break-word",
              }}
            >
              {iban}
            </div>

            <button
              onClick={copyIban}
              style={{
                width: "100%",
                border: "none",
                marginTop: "18px",
                padding: "17px",
                borderRadius: "14px",
                background: copied ? "#12b76a" : "#087cf0",
                color: "#ffffff",
                fontSize: "16px",
                fontWeight: "700",
                cursor: "pointer",
              }}
            >
              {copied ? "✓ IBAN Kopyalandı" : "IBAN'ı Kopyala"}
            </button>
          </div>
        </div>

        <p
          style={{
            textAlign: "center",
            color: "#98a2b3",
            fontSize: "12px",
            lineHeight: "1.5",
            marginTop: "20px",
          }}
        >
          Ödeme yapmadan önce hesap sahibi ve IBAN
          bilgilerini kontrol ediniz.
        </p>
      </div>
    </main>
  );
}
