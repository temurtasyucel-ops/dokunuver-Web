"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import QRCode from "qrcode";

export default function EditIbanCardPage() {
  const params = useParams();
  const router = useRouter();
  const code = params.code;

  const [form, setForm] = useState({
    business_name: "",
    bank_name: "",
    account_holder: "",
    iban: "",
    active: true,
  });

  const [locked, setLocked] = useState(false);
  const [lockedAt, setLockedAt] = useState(null);
  const [status, setStatus] = useState("assigned");
  const [qrCode, setQrCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [locking, setLocking] = useState(false);
  const [lockConfirmed, setLockConfirmed] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    if (!code) return;

    async function loadCard() {
      try {
        const token = localStorage.getItem("dokunuver_access_token");

        if (!token) {
          window.location.href = "/panel/login";
          return;
        }

        const response = await fetch("/api/iban-cards", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        });

        const data = await response.json();

        if (response.status === 401) {
          localStorage.removeItem("dokunuver_access_token");
          localStorage.removeItem("dokunuver_refresh_token");
          window.location.href = "/panel/login";
          return;
        }

        if (!response.ok) {
          throw new Error(data.error || "Kart bilgileri alınamadı.");
        }

        const card = Array.isArray(data.cards)
          ? data.cards.find((item) => item.code === code)
          : null;

        if (!card) {
          throw new Error("Kart bulunamadı.");
        }

        setForm({
          business_name: card.business_name || "",
          bank_name: card.bank_name || "",
          account_holder: card.account_holder || "",
          iban: card.iban || "",
          active: card.active === true,
        });

        setLocked(card.locked === true);
        setLockedAt(card.locked_at || null);
        setStatus(card.status || "assigned");
      } catch (err) {
        const text = err.message || "Bir hata oluştu.";
        setError(text);
        setLoadError(text);
      } finally {
        setLoading(false);
      }
    }

    loadCard();
  }, [code]);

  useEffect(() => {
    if (!code) return;

    async function generateQr() {
      try {
        const url = `https://dokunuver.com.tr/i/${code}`;

        const dataUrl = await QRCode.toDataURL(url, {
          width: 500,
          margin: 2,
          errorCorrectionLevel: "H",
        });

        setQrCode(dataUrl);
      } catch (err) {
        console.error("QR kod oluşturulamadı:", err);
      }
    }

    generateQr();
  }, [code]);
  function downloadQrCode() {
  if (!qrCode || !code) return;

  const link = document.createElement("a");
  link.href = qrCode;
  link.download = `DOKUNUVER-IBAN-${code}-QR.png`;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (locked) {
      setError(
        "Bu IBAN kartı doğrulanmış ve kilitlenmiştir. Finansal bilgiler değiştirilemez."
      );
      return;
    }

    setSaving(true);
    setMessage("");
    setError("");

    try {
      const token = localStorage.getItem("dokunuver_access_token");

      if (!token) {
        throw new Error(
          "Oturum bulunamadı. Lütfen tekrar giriş yapın."
        );
      }

      const response = await fetch("/api/iban-cards", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          code,
          business_name: form.business_name.trim(),
          bank_name: form.bank_name.trim(),
          account_holder: form.account_holder.trim(),
          iban: form.iban.replace(/\s+/g, "").toUpperCase(),

          // Stok kartı ilk atamada pasif kalır.
          active: status === "stock" ? false : form.active,
        }),
      });

      const data = await response.json();

      if (response.status === 401) {
        localStorage.removeItem("dokunuver_access_token");
        localStorage.removeItem("dokunuver_refresh_token");
        window.location.href = "/panel/login";
        return;
      }

      if (!response.ok) {
        throw new Error(data.error || "Kart güncellenemedi.");
      }

      if (status === "stock") {
        setStatus("assigned");
        setForm((current) => ({
          ...current,
          active: false,
        }));
        setMessage("Stok kartı müşteriye başarıyla atandı.");
      } else {
        setMessage("Kart başarıyla güncellendi.");
      }

      setTimeout(() => {
        router.push("/panel");
        router.refresh();
      }, 900);
    } catch (err) {
      setError(err.message || "Bir hata oluştu.");
    } finally {
      setSaving(false);
    }
  }

  async function handleLock() {
    setMessage("");
    setError("");

    if (!lockConfirmed) {
      setError(
        "Kilitlemeden önce bilgilerin doğruluğunu onaylamalısınız."
      );
      return;
    }

    const finalConfirmed = window.confirm(
      "SON ONAY\n\n" +
        "Bu IBAN kartını doğrulayıp kalıcı olarak kilitlemek istediğinizden emin misiniz?\n\n" +
        "Banka, hesap sahibi ve IBAN bilgileri kilitleme sonrasında değiştirilemez."
    );

    if (!finalConfirmed) return;

    setLocking(true);

    try {
      const token = localStorage.getItem("dokunuver_access_token");

      if (!token) {
        throw new Error(
          "Oturum bulunamadı. Lütfen tekrar giriş yapın."
        );
      }

      const response = await fetch("/api/iban-cards/lock", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          code,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "IBAN kartı kilitlenemedi."
        );
      }

      setLocked(true);
      setLockedAt(new Date().toISOString());

      setMessage(
        "IBAN bilgileri doğrulandı ve kart kalıcı olarak kilitlendi."
      );
    } catch (err) {
      setError(err.message || "Bir hata oluştu.");
    } finally {
      setLocking(false);
    }
  }

  if (loading) {
    return (
      <main style={styles.center}>
        <strong>Kart bilgileri yükleniyor...</strong>
      </main>
    );
  }

  if (loadError) {
    return (
      <main style={styles.center}>
        <div style={styles.errorBox}>
          <strong>{loadError}</strong>

          <br />

          <a href="/panel" style={styles.backLink}>
            ← Panele Dön
          </a>
        </div>
      </main>
    );
  }

  const isStock = status === "stock";

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <header style={styles.header}>
          <div>
            <div style={styles.logo}>DOKUNUVER</div>
            <div style={styles.slogan}>Dokun. Bağlan.</div>
          </div>

          <a href="/panel" style={styles.backButton}>
            ← Panele Dön
          </a>
        </header>

        <div style={styles.titleArea}>
          <div style={styles.eyebrow}>DOKUNUVER PANEL</div>

          <h1 style={styles.title}>
            {locked
              ? "IBAN Kartı"
              : isStock
              ? "Stok Kartını Müşteriye Ata"
              : "IBAN Kartını Düzenle"}
          </h1>

          <p style={styles.subtitle}>
            {locked
              ? "Bu kartın finansal bilgileri doğrulanmış ve kilitlenmiştir."
              : isStock
              ? "Bu fiziksel stok kartına müşteri ve ödeme bilgilerini atayın. Kart kodu, NFC ve QR adresi değişmez."
              : "NFC kartının ödeme bilgilerini kontrol edin ve doğruladıktan sonra kilitleyin."}
          </p>

          <div style={styles.codeBox}>
            Kart Kodu: <strong>{code}</strong>
          </div>
        </div>

        {locked && (
          <div style={styles.lockedBox}>
            <div style={styles.lockedIcon}>🔒</div>

            <div>
              <div style={styles.lockedTitle}>
                Doğrulanmış ve Kilitli
              </div>

              <div style={styles.lockedText}>
                Bu kartın banka, hesap sahibi ve IBAN bilgileri
                artık değiştirilemez.
              </div>

              {lockedAt && (
                <div style={styles.lockedDate}>
                  Kilitlenme:{" "}
                  {new Date(lockedAt).toLocaleString("tr-TR", {
                    timeZone: "Europe/Istanbul",
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {isStock && !locked && (
          <div style={styles.stockBox}>
            <div style={styles.stockIcon}>📦</div>

            <div>
              <div style={styles.stockTitle}>
                Stok Kartı
              </div>

              <div style={styles.stockText}>
                Bu kart henüz bir müşteriye atanmamıştır.
                Bilgileri kaydettiğinizde kart stoktan çıkar ve
                müşteriye atanmış duruma geçer.
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.card}>
          <label style={styles.label}>
            İşletme / Kart Adı

            <input
              name="business_name"
              value={form.business_name}
              onChange={handleChange}
              required
              disabled={locked}
              style={{
                ...styles.input,
                ...(locked ? styles.lockedInput : {}),
              }}
            />
          </label>

          <label style={styles.label}>
            Banka

            <input
              name="bank_name"
              value={form.bank_name}
              onChange={handleChange}
              required
              disabled={locked}
              style={{
                ...styles.input,
                ...(locked ? styles.lockedInput : {}),
              }}
            />
          </label>

          <label style={styles.label}>
            Hesap Sahibi

            <input
              name="account_holder"
              value={form.account_holder}
              onChange={handleChange}
              required
              disabled={locked}
              style={{
                ...styles.input,
                ...(locked ? styles.lockedInput : {}),
              }}
            />
          </label>

          <label style={styles.label}>
            IBAN

            <input
              name="iban"
              value={form.iban}
              onChange={handleChange}
              required
              autoCapitalize="characters"
              disabled={locked}
              style={{
                ...styles.input,
                ...(locked ? styles.lockedInput : {}),
              }}
            />
          </label>

          {!locked && !isStock && (
            <label style={styles.activeBox}>
              <input
                type="checkbox"
                name="active"
                checked={form.active}
                onChange={handleChange}
                style={styles.checkbox}
              />

              <div>
                <div style={styles.activeTitle}>
                  Kart aktif olsun
                </div>

                <div style={styles.activeText}>
                  Pasif kartlar NFC bağlantısı üzerinden
                  görüntülenemez.
                </div>
              </div>
            </label>
          )}

          {isStock && (
            <div style={styles.stockPassiveInfo}>
              <strong>İlk atamada kart pasif kalacaktır.</strong>
              <div style={styles.stockPassiveText}>
                Müşteri bilgilerini kaydettikten ve kontrol
                ettikten sonra kartı panelden aktif hale
                getirebilirsiniz.
              </div>
            </div>
          )}

          {error && (
            <div style={styles.error}>
              {error}
            </div>
          )}

          {message && (
            <div style={styles.success}>
              {message}
            </div>
          )}

          {!locked && (
            <>
              <button
                type="submit"
                disabled={saving || locking}
                style={{
                  ...styles.saveButton,
                  opacity:
                    saving || locking ? 0.65 : 1,
                }}
              >
                {saving
                  ? "Kaydediliyor..."
                  : isStock
                  ? "Müşteriye Ata ve Kaydet"
                  : "Değişiklikleri Kaydet"}
              </button>

              {!isStock && (
                <div style={styles.lockSection}>
                  <div style={styles.lockWarningTitle}>
                    Son kontrolü yaptınız mı?
                  </div>

                  <div style={styles.lockWarningText}>
                    Banka, hesap sahibi ve IBAN bilgilerinin
                    doğru olduğundan emin olduktan sonra kartı
                    kilitleyebilirsiniz. Kilitleme işlemi geri
                    alınamaz.
                  </div>

                  <div style={styles.verificationSummary}>
                    <div style={styles.verificationRow}>
                      <span style={styles.verificationLabel}>
                        Banka
                      </span>

                      <strong>
                        {form.bank_name || "-"}
                      </strong>
                    </div>

                    <div style={styles.verificationRow}>
                      <span style={styles.verificationLabel}>
                        Hesap Sahibi
                      </span>

                      <strong>
                        {form.account_holder || "-"}
                      </strong>
                    </div>

                    <div style={styles.verificationRow}>
                      <span style={styles.verificationLabel}>
                        IBAN
                      </span>

                      <strong style={styles.verificationIban}>
                        {form.iban || "-"}
                      </strong>
                    </div>
                  </div>

                  <label style={styles.confirmBox}>
                    <input
                      type="checkbox"
                      checked={lockConfirmed}
                      onChange={(e) =>
                        setLockConfirmed(e.target.checked)
                      }
                      style={styles.checkbox}
                    />

                    <div>
                      <div style={styles.confirmTitle}>
                        Bilgileri kontrol ettim
                      </div>

                      <div style={styles.confirmText}>
                        Banka, hesap sahibi ve IBAN bilgilerinin
                        doğru olduğunu onaylıyorum.
                      </div>
                    </div>
                  </label>

                  <button
                    type="button"
                    onClick={handleLock}
                    disabled={
                      saving ||
                      locking ||
                      !lockConfirmed
                    }
                    style={{
                      ...styles.lockButton,
                      opacity:
                        saving ||
                        locking ||
                        !lockConfirmed
                          ? 0.45
                          : 1,
                    }}
                  >
                    {locking
                      ? "Kilitleniyor..."
                      : "🔒 IBAN Bilgilerini Doğrula ve Kilitle"}
                  </button>
                </div>
              )}
            </>
          )}

          {qrCode && (
            <div style={styles.qrSection}>
              <div style={styles.qrTitle}>
                IBAN Kartı QR Kodu
              </div>

              <div style={styles.qrDescription}>
                {isStock
                  ? "Bu QR kod fiziksel stok kartının kalıcı adresidir. Müşteri atandığında QR kod değişmez."
                  : "Bu QR kod okutulduğunda müşterinin IBAN kartı açılır."}
              </div>

              <img
                src={qrCode}
                alt="IBAN Kartı QR Kodu"
                style={styles.qrImage}
              />

              <div style={styles.qrUrl}>
                dokunuver.com.tr/i/{code}
              </div>
                <button
  type="button"
  onClick={downloadQrCode}
  style={styles.qrDownloadButton}
>
  ↓ QR Kodunu PNG İndir
</button>
            </div>
          )}

          {!isStock && (
            <a
              href={`/i/${code}`}
              target="_blank"
              rel="noreferrer"
              style={styles.viewCard}
            >
              Kartı Görüntüle ↗
            </a>
          )}
        </form>

        <div style={styles.footer}>
          DOKUNUVER NFC Platform
        </div>
      </div>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f4f7fb",
    fontFamily: "Arial, sans-serif",
    padding: "32px 20px",
    color: "#101828",
  },

  center: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f4f7fb",
    fontFamily: "Arial, sans-serif",
  },

  container: {
    width: "100%",
    maxWidth: "900px",
    margin: "0 auto",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "50px",
  },

  logo: {
    fontSize: "25px",
    fontWeight: "900",
  },

  slogan: {
    color: "#087cf0",
    fontSize: "13px",
    fontWeight: "700",
    marginTop: "4px",
  },

  backButton: {
    background: "#ffffff",
    border: "1px solid #d0d5dd",
    padding: "12px 18px",
    borderRadius: "12px",
    textDecoration: "none",
    color: "#101828",
    fontWeight: "700",
    fontSize: "14px",
  },

  titleArea: {
    marginBottom: "28px",
  },

  eyebrow: {
    color: "#087cf0",
    fontSize: "13px",
    fontWeight: "900",
    letterSpacing: "1px",
  },

  title: {
    fontSize: "36px",
    margin: "10px 0 12px",
  },

  subtitle: {
    color: "#667085",
    fontSize: "17px",
    lineHeight: "1.5",
  },

  codeBox: {
    display: "inline-block",
    marginTop: "8px",
    padding: "9px 13px",
    background: "#eaf4ff",
    color: "#087cf0",
    borderRadius: "9px",
    fontSize: "13px",
  },

  lockedBox: {
    display: "flex",
    gap: "14px",
    alignItems: "flex-start",
    background: "#ecfdf3",
    border: "1px solid #abefc6",
    padding: "20px",
    borderRadius: "16px",
    marginBottom: "22px",
  },

  lockedIcon: {
    fontSize: "24px",
  },

  lockedTitle: {
    color: "#067647",
    fontSize: "16px",
    fontWeight: "900",
  },

  lockedText: {
    color: "#067647",
    fontSize: "13px",
    lineHeight: "1.5",
    marginTop: "5px",
  },

  lockedDate: {
    color: "#067647",
    fontSize: "12px",
    fontWeight: "700",
    marginTop: "8px",
  },

  stockBox: {
    display: "flex",
    gap: "14px",
    alignItems: "flex-start",
    background: "#fff7ed",
    border: "1px solid #fed7aa",
    padding: "20px",
    borderRadius: "16px",
    marginBottom: "22px",
  },

  stockIcon: {
    fontSize: "24px",
  },

  stockTitle: {
    color: "#c2410c",
    fontSize: "16px",
    fontWeight: "900",
  },

  stockText: {
    color: "#9a3412",
    fontSize: "13px",
    lineHeight: "1.5",
    marginTop: "5px",
  },

  card: {
    background: "#ffffff",
    padding: "32px",
    borderRadius: "24px",
    boxShadow:
      "0 12px 40px rgba(16,24,40,0.07)",
  },

  label: {
    display: "block",
    fontWeight: "700",
    fontSize: "14px",
    marginBottom: "22px",
  },

  input: {
    display: "block",
    width: "100%",
    boxSizing: "border-box",
    marginTop: "9px",
    padding: "15px 16px",
    border: "1px solid #d0d5dd",
    borderRadius: "12px",
    fontSize: "15px",
    outline: "none",
    background: "#ffffff",
  },

  lockedInput: {
    background: "#f2f4f7",
    color: "#475467",
    cursor: "not-allowed",
  },

  activeBox: {
    display: "flex",
    alignItems: "flex-start",
    gap: "13px",
    background: "#f7f9fc",
    padding: "18px",
    borderRadius: "14px",
    marginBottom: "22px",
    cursor: "pointer",
  },

  checkbox: {
    marginTop: "3px",
    width: "17px",
    height: "17px",
  },

  activeTitle: {
    fontWeight: "800",
    fontSize: "15px",
  },

  activeText: {
    color: "#667085",
    fontSize: "12px",
    marginTop: "5px",
  },

  stockPassiveInfo: {
    background: "#f9fafb",
    border: "1px solid #eaecf0",
    padding: "16px",
    borderRadius: "12px",
    marginBottom: "22px",
    color: "#344054",
    fontSize: "13px",
  },

  stockPassiveText: {
    marginTop: "5px",
    color: "#667085",
    lineHeight: "1.5",
  },

  saveButton: {
    width: "100%",
    border: "none",
    background: "#087cf0",
    color: "#ffffff",
    padding: "17px",
    borderRadius: "13px",
    fontSize: "16px",
    fontWeight: "800",
    cursor: "pointer",
  },

  lockSection: {
    marginTop: "22px",
    padding: "20px",
    background: "#fffaf0",
    border: "1px solid #fedf89",
    borderRadius: "14px",
  },

  lockWarningTitle: {
    color: "#93370d",
    fontWeight: "900",
    fontSize: "15px",
  },

  lockWarningText: {
    color: "#934a0a",
    fontSize: "13px",
    lineHeight: "1.6",
    marginTop: "7px",
    marginBottom: "15px",
  },

  verificationSummary: {
    background: "#ffffff",
    border: "1px solid #fedf89",
    borderRadius: "12px",
    padding: "16px",
    marginBottom: "15px",
  },

  verificationRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "20px",
    padding: "8px 0",
    fontSize: "13px",
  },

  verificationLabel: {
    color: "#667085",
    flexShrink: 0,
  },

  verificationIban: {
    textAlign: "right",
    wordBreak: "break-all",
  },

  confirmBox: {
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
    background: "#ffffff",
    border: "1px solid #fedf89",
    padding: "14px",
    borderRadius: "10px",
    marginBottom: "15px",
    cursor: "pointer",
  },

  confirmTitle: {
    color: "#7a2e0e",
    fontSize: "13px",
    fontWeight: "900",
  },

  confirmText: {
    color: "#934a0a",
    fontSize: "12px",
    lineHeight: "1.5",
    marginTop: "4px",
  },

  lockButton: {
    width: "100%",
    border: "none",
    background: "#b42318",
    color: "#ffffff",
    padding: "15px",
    borderRadius: "12px",
    fontSize: "14px",
    fontWeight: "800",
    cursor: "pointer",
  },

  qrSection: {
    marginTop: "24px",
    padding: "22px",
    background: "#f8fafc",
    border: "1px solid #e4e7ec",
    borderRadius: "16px",
    textAlign: "center",
  },

  qrTitle: {
    fontSize: "16px",
    fontWeight: "900",
    color: "#101828",
  },

  qrDescription: {
    marginTop: "6px",
    marginBottom: "16px",
    fontSize: "12px",
    color: "#667085",
  },

  qrImage: {
    width: "180px",
    height: "180px",
    display: "block",
    margin: "0 auto",
    borderRadius: "8px",
  },

  qrUrl: {
    marginTop: "12px",
    fontSize: "12px",
    color: "#667085",
    wordBreak: "break-all",
  },
  
  qrDownloadButton: {
  marginTop: "16px",
  border: "none",
  background: "#101828",
  color: "#ffffff",
  padding: "12px 18px",
  borderRadius: "10px",
  fontSize: "13px",
  fontWeight: "800",
  cursor: "pointer",
},
  
  viewCard: {
    display: "block",
    textAlign: "center",
    marginTop: "18px",
    color: "#087cf0",
    fontWeight: "700",
    textDecoration: "none",
    fontSize: "14px",
  },

  success: {
    background: "#ecfdf3",
    color: "#027a48",
    padding: "13px",
    borderRadius: "10px",
    marginBottom: "18px",
    fontSize: "14px",
    fontWeight: "700",
  },

  error: {
    background: "#fef3f2",
    color: "#b42318",
    padding: "13px",
    borderRadius: "10px",
    marginBottom: "18px",
    fontSize: "14px",
    fontWeight: "700",
  },

  errorBox: {
    background: "#ffffff",
    padding: "30px",
    borderRadius: "18px",
    textAlign: "center",
  },

  backLink: {
    display: "inline-block",
    marginTop: "18px",
    color: "#087cf0",
  },

  footer: {
    textAlign: "center",
    color: "#98a2b3",
    fontSize: "12px",
    marginTop: "28px",
  },
};
