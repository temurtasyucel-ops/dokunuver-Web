"use client";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import PaymentCard, { PaymentState } from '../components/PaymentCard';

export default function IbanCardPage() {
  const { code } = useParams();
  const [state, setState] = useState({ loading: true, card: null, error: null });
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    if (!code) return;
    const controller = new AbortController();
    setState({ loading: true, card: null, error: null });
    async function load() {
      try {
        const response = await fetch(`/api/public-iban/${encodeURIComponent(code)}`, { cache: 'no-store', signal: controller.signal });
        if (!response.ok) {
          if (!controller.signal.aborted) setState({ loading: false, card: null, error: response.status === 404 ? 'missing' : 'connection' });
          return;
        }
        const card = await response.json();
        if (!controller.signal.aborted) setState({ loading: false, card: card?.iban ? card : null, error: card?.iban ? null : 'missing' });
      } catch {
        if (!controller.signal.aborted) setState({ loading: false, card: null, error: 'connection' });
      }
    }
    load();
    return () => controller.abort();
  }, [code, retry]);
  if (state.loading) return <PaymentState loading />;
  if (state.error || !state.card) return <PaymentState missing={state.error === 'missing'} onRetry={() => setRetry(n => n + 1)} />;
  return <PaymentCard card={state.card} locked />;
}
