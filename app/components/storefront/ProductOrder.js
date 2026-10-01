"use client";

import { useId, useState } from "react";
import { money, availableStands } from "../../../lib/site-content.mjs";
import { orderLink } from "./catalog";
import styles from "./storefront.module.css";

export default function ProductOrder({ product, settings, cardPrice }) {
  const [selected, setSelected] = useState("");
  const selectId = useId();
  const stands = availableStands(product, settings), stand = stands.find(s => s.id === selected);
  const total = Math.round((cardPrice + (stand?.price || 0)) * 100) / 100;
  return <div className={styles.orderOptions}>
    {stands.length > 0 && <div><label htmlFor={selectId}>Stand tercihi</label><select id={selectId} value={selected} onChange={e => setSelected(e.target.value)}>
      <option value="">Standsız · Ek ücret yok</option>
      {stands.map(s => <option key={s.id} value={s.id}>{s.title} · +{money(s.price)}</option>)}
    </select></div>}
    {stand?.image && <img className={styles.standPhoto} src={stand.image} alt={stand.title} width="160" height="120" />}
    <div className={styles.orderTotal}><span>Kart + {stand?.title || "standsız kullanım"}</span><strong>{money(total)}</strong></div>
    <a className={`${styles.button} ${styles.primary}`} href={orderLink(product, stand, total)} target="_blank" rel="noreferrer">Bu kartı sipariş ver <span aria-hidden="true">→</span></a>
    <small>Kargo hariç · {settings.shipping_text} Sipariş WhatsApp üzerinden tamamlanır.</small>
  </div>;
}
