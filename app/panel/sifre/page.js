"use client";
import { useState } from 'react';
import Link from 'next/link';
import { panelClient, panelFetch } from '../../../lib/panel-client.mjs';
import { validatePasswordChange } from '../../../lib/panel-password.mjs';
import styles from './password.module.css';

export default function PasswordPage() {
  const [draft, setDraft] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [busy, setBusy] = useState(false), [error, setError] = useState('');
  async function submit(event) {
    event.preventDefault();
    const invalid = validatePasswordChange(draft);
    if (invalid) { setError(invalid); return; }
    setBusy(true); setError('');
    try {
      const response = await panelFetch('/api/panel-password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(draft) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Şifre değiştirilemedi.');
      setDraft({ currentPassword: '', newPassword: '', confirmPassword: '' });
      // Clear this browser's session and leave the protected page immediately.
      panelClient().clear();
      window.location.replace('/panel/login?password=changed' + (data.sessionsClosed ? '' : '&sessions=check'));
    } catch (e) { setError(e.message || 'İşlem tamamlanamadı. Tekrar deneyin.'); setBusy(false); }
  }
  return <section className={styles.page}>
    <h1>Şifre Değiştir</h1>
    <p className={styles.description}>Yönetici hesabınız için başka yerde kullanmadığınız bir şifre seçin.</p>
    <form className={styles.card} onSubmit={submit}>
      <fieldset disabled={busy}>
        {[['currentPassword', 'Mevcut şifre', 'current-password'], ['newPassword', 'Yeni şifre', 'new-password'], ['confirmPassword', 'Yeni şifre tekrar', 'new-password']].map(([name, label, autocomplete]) => <label key={name} htmlFor={name}>{label}<input id={name} name={name} type="password" autoComplete={autocomplete} value={draft[name]} onChange={e => setDraft({ ...draft, [name]: e.target.value })} minLength={name === 'currentPassword' ? 1 : 16} maxLength={name === 'currentPassword' ? 1024 : 64} required aria-describedby={name === 'currentPassword' ? undefined : 'password-help'} /></label>)}
        <p id="password-help" className={styles.help}>Yeni şifre 16–64 karakter olmalı. Şifre yöneticisinin oluşturduğu rastgele bir şifre kullanabilirsiniz.</p>
        {error && <p role="alert" className={styles.error}>{error}</p>}
        <p className={styles.help}>Kaydettikten sonra yeni şifrenizle tekrar giriş yapacaksınız.</p>
        <button type="submit">{busy ? 'Şifre güncelleniyor…' : 'Şifreyi Güncelle'}</button>
      </fieldset>
      <Link href="/panel/ozet">İşletme özetine dön</Link>
    </form>
  </section>;
}
