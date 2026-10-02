import { requirePanelAdmin } from '../../../lib/admin-auth.mjs';
import { changePanelPassword } from '../../../lib/panel-password.mjs';
export const dynamic = 'force-dynamic';
const reply = (data, status = 200) => Response.json(data, { status, headers: { 'Cache-Control': 'no-store' } });
export async function POST(request) {
  const auth = await requirePanelAdmin(request);
  if (!auth.ok) return reply({ error: auth.error }, auth.status);
  if (process.env.VERCEL_ENV === 'preview') return reply({ error: 'Şifre yalnızca canlı panelden değiştirilebilir.' }, 403);
  let body;
  try {
    const raw = await request.text();
    if (raw.length > 8192) return reply({ error: 'İstek çok büyük.' }, 413);
    body = JSON.parse(raw);
  } catch { return reply({ error: 'Geçerli şifre bilgileri girin.' }, 400); }
  const result = await changePanelPassword({ user: auth.user, body, url: process.env.NEXT_PUBLIC_SUPABASE_URL, key: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY });
  const { status, ...data } = result;
  return reply(data, status);
}
