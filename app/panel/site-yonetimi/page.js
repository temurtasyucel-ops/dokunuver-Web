"use client";

import { useEffect, useState } from "react";

import { effectivePrice, isLive, money, validateContent } from "../../../lib/site-content.mjs";
import styles from "./site-management.module.css";

const tokenHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem("dokunuver_access_token") || ""}` });
const toIstanbul = value => value ? new Date(Date.parse(value) + 3 * 3600000).toISOString().slice(0, 16) : "";
const fromIstanbul = value => value ? new Date(`${value}:00+03:00`).toISOString() : null;

export default function SiteManagement() {
  const [content, setContent] = useState(null), [saved, setSaved] = useState(null);
  const [revision, setRevision] = useState(0), [busy, setBusy] = useState(false), [uploading, setUploading] = useState(0);
  const [error, setError] = useState(""), [notice, setNotice] = useState(""), [tab, setTab] = useState("products"), [bulkPrice, setBulkPrice] = useState(250);
  const dirty = !!content && JSON.stringify(content) !== JSON.stringify(saved);

  useEffect(() => {
    let alive = true;
    fetch("/api/site-content", { headers: tokenHeaders(), cache: "no-store" }).then(async response => {
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Ayarlar yüklenemedi.");
      if (alive) { setContent(data.content); setSaved(data.content); setRevision(data.revision); }
    }).catch(e => { if (alive) setError(e.message); });
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    if (!dirty) return;
    const handler = e => { e.preventDefault(); e.returnValue = ""; };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  const change = (section, field, value) => {
    setContent(c => ({ ...c, [section]: { ...c[section], [field]: value } })); setNotice("");
  };
  const productChange = (id, field, value, campaign = false) => {
    setContent(c => ({ ...c, products: c.products.map(p => p.id !== id ? p : campaign
      ? { ...p, campaign: { ...p.campaign, [field]: value } } : { ...p, [field]: value }) })); setNotice("");
  };

  async function save() {
    setError(""); setNotice("");
    let validated;
    try { validated = validateContent(content, process.env.NEXT_PUBLIC_SUPABASE_URL); }
    catch (e) { setError(e.message); return; }
    setBusy(true);
    try {
      const response = await fetch("/api/site-content", { method: "PUT", headers: { ...tokenHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({ revision, content: validated }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Kaydedilemedi.");
      setContent(data.content); setSaved(data.content); setRevision(data.revision);
      setNotice("Değişiklikler kaydedildi. Siteyi yenilediğinizde güncel bilgiler görünür.");
    } catch (e) { setError(e.message); }
    finally { setBusy(false); }
  }

  async function upload(file, onSuccess) {
    if (!file) return;
    if (!file.size || file.size > 3 * 1024 * 1024) { setError("Görsel en fazla 3 MB olabilir."); return; }
    setUploading(n => n + 1); setError(""); setNotice("");
    try {
      const form = new FormData(); form.append("file", file);
      const response = await fetch("/api/site-media", { method: "POST", headers: tokenHeaders(), body: form });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Görsel yüklenemedi.");
      onSuccess(data.url); setNotice("Görsel yüklendi. Sitede görünmesi için Kaydet ve Yayınla'ya basın.");
    } catch (e) { setError(e.message); }
    finally { setUploading(n => n - 1); }
  }

  const controlsDisabled = busy || uploading > 0;
  return <main className={styles.page}><div className={styles.container}>
    <section className={styles.hero}><p>SİTE YÖNETİMİ</p><h1>Fiyatlar, kampanyalar ve görseller</h1><span>Değişiklikleri burada hazırlayın, önizleyin ve tek seferde yayınlayın.</span></section>
    {error && <div role="alert" className={styles.error}>{error}</div>}
    {notice && <div role="status" className={styles.success}>{notice}</div>}
    {!content ? <div className={styles.card}>{error ? "Kurulum ve yönetici yetkisi tamamlandıktan sonra sayfayı yenileyin." : "Site ayarları yükleniyor…"}</div> : <>
      <div className={styles.toolbar}><div><strong>{dirty ? "Yayınlanmamış değişiklikler var" : "Yayınlanan bilgiler"}</strong><p>{uploading ? "Görsel yükleniyor…" : "Kampanya saatleri Türkiye saatidir (UTC+3)."}</p></div>
        <div className={styles.actions}><a href="/" target="_blank" rel="noreferrer">Siteyi Gör</a>
          <button type="button" disabled={!dirty || controlsDisabled} onClick={() => { setContent(structuredClone(saved)); setError(""); setNotice(""); }}>Değişiklikleri Geri Al</button>
          <button type="button" className={styles.primary} disabled={!dirty || controlsDisabled} onClick={save}>{busy ? "Kaydediliyor…" : "Kaydet ve Yayınla"}</button></div></div>
      <div className={styles.tabs} role="group" aria-label="Yönetim alanları">{[["products", "Ürünler ve Fiyatlar"], ["campaigns", "Kampanyalar"], ["settings", "Genel Ayarlar"]].map(([id, label]) => <button type="button" key={id} aria-pressed={tab === id} onClick={() => setTab(id)}>{label}</button>)}</div>
      <fieldset className={styles.editor} disabled={controlsDisabled}>
        {tab === "products" && <><section className={styles.card}><h2>Toplu fiyat güncelleme</h2><div className={styles.actions}><label>Tüm kartların normal fiyatı (TL)<input type="number" min="0" max="1000000" step="0.01" value={bulkPrice} onChange={e => setBulkPrice(e.target.value === "" ? "" : Number(e.target.value))} /></label><button type="button" onClick={() => {
          if (bulkPrice === "" || !Number.isFinite(bulkPrice) || bulkPrice < 0) { setError("Geçerli bir fiyat girin."); return; }
          setContent(c => ({ ...c, products: c.products.map(p => ({ ...p, price: bulkPrice })) })); setNotice("");
        }}>Beş Ürüne Uygula</button></div><p>Ürüne özel fiyatları aşağıdan değiştirebilirsiniz. Yayınlama sırasında kampanya fiyatları da kontrol edilir.</p></section>
          <div className={styles.grid}>{content.products.map(p => <section className={styles.card} key={p.id}><h2>{p.title}</h2>
            <ImageEditor value={p.image} label={`${p.title} görseli`} disabled={controlsDisabled} upload={upload} onChange={value => productChange(p.id, "image", value)} />
            <Field label="Ürün adı" value={p.title} maxLength={100} onChange={v => productChange(p.id, "title", v)} />
            <Field label="Ana sayfa ürün açıklaması" value={p.description} multiline maxLength={1000} onChange={v => productChange(p.id, "description", v)} />
            <Field label="Normal fiyat (TL)" value={p.price} type="number" onChange={v => productChange(p.id, "price", v)} />
            <div className={styles.preview}><small>Şu an sitede gösterilecek fiyat</small><strong>{money(effectivePrice(p))}</strong>{isLive(p.campaign) && <span>{p.campaign.label || "Kampanya"}</span>}</div>
          </section>)}</div></>}
        {tab === "campaigns" && <><section className={styles.card}><h2>Site duyurusu</h2><p>Ana sayfada ve ürün sayfalarında bir kampanya duyurusu gösterin.</p>
          <Check label="Duyuruyu göster" value={content.banner.enabled} onChange={v => change("banner", "enabled", v)} />
          <Field label="Duyuru başlığı" value={content.banner.title} maxLength={120} onChange={v => change("banner", "title", v)} />
          <Field label="Duyuru metni" value={content.banner.text} multiline maxLength={1000} onChange={v => change("banner", "text", v)} />
          <ImageEditor value={content.banner.image} label="Duyuru görseli (isteğe bağlı)" disabled={controlsDisabled} upload={upload} onChange={v => change("banner", "image", v)} optional />
          <Dates campaign={content.banner} onChange={(field, value) => change("banner", field, value)} />
          <div className={styles.preview}><small>Duyuru önizlemesi · {isLive(content.banner) ? "Şu an aktif" : "Şu an gösterilmiyor"}</small><strong>{content.banner.title || "Duyuru başlığı"}</strong><p>{content.banner.text}</p></div>
        </section><div className={styles.grid}>{content.products.map(p => <section className={styles.card} key={p.id}><h2>{p.title}</h2><p>Normal fiyat: {money(p.price)}</p>
          <Check label="Ürün kampanyasını etkinleştir" value={p.campaign.enabled} onChange={v => productChange(p.id, "enabled", v, true)} />
          <Field label="Kampanya fiyatı (TL)" value={p.campaign.price ?? ""} type="number" onChange={v => productChange(p.id, "price", v === "" ? null : v, true)} />
          <Field label="Kampanya etiketi" value={p.campaign.label} maxLength={80} onChange={v => productChange(p.id, "label", v, true)} />
          <Dates campaign={p.campaign} onChange={(field, value) => productChange(p.id, field, value, true)} />
          <div className={styles.preview}><small>{isLive(p.campaign) ? "Şu an aktif" : "Şu an normal fiyat gösteriliyor"}</small><strong>{money(effectivePrice(p))}</strong></div>
        </section>)}</div><p>Tarihleri boş bırakırsanız etkinleştirilen kampanya hemen başlar ve siz kapatana kadar sürer. Bitiş saatinde normal fiyat otomatik gösterilir.</p></>}
        {tab === "settings" && <section className={styles.card}><h2>Stand ve kargo</h2>
          <Field label="Masaüstü stand ek ücreti (TL)" value={content.settings.stand_price} type="number" onChange={v => change("settings", "stand_price", v)} />
          <Field label="Kargo açıklaması" value={content.settings.shipping_text} maxLength={200} onChange={v => change("settings", "shipping_text", v)} />
          <h2>Ana sayfa NFC görseli</h2><ImageEditor value={content.settings.hero_image} label="Ana sayfa NFC görseli" disabled={controlsDisabled} upload={upload} onChange={v => change("settings", "hero_image", v)} />
        </section>}
      </fieldset>
    </>}
  </div></main>;
}

function Field({ label, value, onChange, type = "text", multiline = false, maxLength }) {
  return <label className={styles.field}>{label}{multiline ? <textarea value={value} maxLength={maxLength} rows={3} onChange={e => onChange(e.target.value)} />
    : <input type={type} value={value} maxLength={maxLength} min={type === "number" ? 0 : undefined} max={type === "number" ? 1000000 : undefined} step={type === "number" ? "0.01" : undefined}
      onChange={e => onChange(type === "number" && e.target.value !== "" ? Number(e.target.value) : e.target.value)} />}</label>;
}
function Check({ label, value, onChange }) { return <label className={styles.check}><input type="checkbox" checked={value} onChange={e => onChange(e.target.checked)} />{label}</label>; }
function Dates({ campaign, onChange }) { return <div className={styles.dateGrid}>
  <Field label="Başlangıç · Türkiye saati" type="datetime-local" value={toIstanbul(campaign.starts_at)} onChange={v => onChange("starts_at", fromIstanbul(v))} />
  <Field label="Bitiş · Türkiye saati" type="datetime-local" value={toIstanbul(campaign.ends_at)} onChange={v => onChange("ends_at", fromIstanbul(v))} />
</div>; }
function ImageEditor({ label, value, upload, onChange, disabled, optional }) { return <div className={styles.media}>
  {value && <img src={value} alt={label} />}
  <label className={styles.field}>{label}<input type="file" accept="image/png,image/jpeg,image/webp" disabled={disabled} onChange={e => { const file = e.target.files[0]; e.target.value = ""; upload(file, onChange); }} /></label>
  <small>PNG, JPEG veya WebP · En fazla 3 MB</small>
  <Field label="Görsel adresi" value={value} onChange={onChange} />
  {optional && value && <button type="button" disabled={disabled} onClick={() => onChange("")}>Duyuru Görselini Kaldır</button>}
</div>; }
