import test from 'node:test';
import assert from 'node:assert/strict';
import { validatePasswordChange, changePanelPassword } from '../lib/panel-password.mjs';
import { POST } from '../app/api/panel-password/route.js';
const body = { currentPassword: 'previous-test-password', newPassword: 'new-unique-test-password', confirmPassword: 'new-unique-test-password' };
const args = { user: { id: 'admin', email: 'verified@example.test' }, body, url: 'https://auth.example.test', key: 'public-test' };
test('rejects weak, mismatched, unchanged and oversized passwords', () => {
  for (const b of [null, {}, { ...body, newPassword: 'short' }, { ...body, confirmPassword: 'different' }, { ...body, newPassword: body.currentPassword, confirmPassword: body.currentPassword }, { ...body, newPassword: 'a'.repeat(65), confirmPassword: 'a'.repeat(65) }, { ...body, newPassword: 'ğ'.repeat(40), confirmPassword: 'ğ'.repeat(40) }]) assert.ok(validatePasswordChange(b));
  assert.equal(validatePasswordChange(body), '');
});
test('wrong current password never reaches password update', async () => {
  const calls = [];
  const result = await changePanelPassword({ ...args, fetchImpl: async (url, opts) => { calls.push({ url, opts }); return Response.json({}, { status: 400 }); } });
  assert.equal(result.status, 400); assert.equal(calls.length, 1);
});
test('only the verified account can be updated; cleans up mismatched session', async () => {
  const calls = [];
  const result = await changePanelPassword({ ...args, fetchImpl: async (url, opts) => { calls.push({ url, opts }); return url.includes('/token?') ? Response.json({ access_token: 'temporary', user: { id: 'other' } }) : new Response(null, { status: 204 }); } });
  assert.equal(result.status, 503); assert.equal(calls.length, 2); assert.match(calls[1].url, /logout\?scope=local$/);
});
test('reauthenticates verified email, uses user credentials and revokes refresh sessions on success', async () => {
  const calls = [];
  const result = await changePanelPassword({ ...args, body: { ...body, email: 'attacker@example.test', user_id: 'other' }, fetchImpl: async (url, opts) => { calls.push({ url, opts }); return url.includes('/token?') ? Response.json({ access_token: 'temporary', refresh_token: 'not-returned', user: { id: 'admin' } }) : new Response(null, { status: 204 }); } });
  assert.deepEqual(result, { status: 200, ok: true, sessionsClosed: true });
  assert.equal(JSON.parse(calls[0].opts.body).email, args.user.email);
  assert.equal(calls[1].opts.method, 'PUT'); assert.equal(calls[1].opts.headers.Authorization, 'Bearer temporary');
  assert.deepEqual(JSON.parse(calls[1].opts.body), { password: body.newPassword });
  assert.match(calls[2].url, /logout\?scope=global$/); assert.ok(calls.every(c => c.opts.cache === 'no-store'));
});
test('successful change stays successful if logout is unavailable', async () => {
  const result = await changePanelPassword({ ...args, fetchImpl: async url => {
    if (url.includes('/token?')) return Response.json({ access_token: 'temporary', user: { id: 'admin' } });
    if (url.includes('/logout')) throw Error('offline');
    return new Response(null, { status: 204 });
  } });
  assert.deepEqual(result, { status: 200, ok: true, sessionsClosed: false });
});
test('failed update closes only temporary session and does not expose upstream errors', async () => {
  const calls = [];
  const result = await changePanelPassword({ ...args, fetchImpl: async url => { calls.push(url); return url.includes('/token?') ? Response.json({ access_token: 'temporary', user: { id: 'admin' } }) : url.endsWith('/user') ? Response.json({ message: body.newPassword }, { status: 500 }) : new Response(null, { status: 204 }); } });
  assert.equal(result.status, 503); assert.ok(!result.error.includes(body.newPassword)); assert.match(calls[2], /scope=local$/);
});
test('API fails closed for anonymous, non-admin and preview calls', async () => {
  const savedFetch = globalThis.fetch;
  const names = ['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY', 'SUPABASE_SECRET_KEY', 'VERCEL_ENV'];
  const saved = names.map(n => process.env[n]);
  Object.assign(process.env, { NEXT_PUBLIC_SUPABASE_URL: args.url, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: args.key, SUPABASE_SECRET_KEY: 'server-test', VERCEL_ENV: 'preview' });
  const request = token => new Request('https://panel.example.test/api/panel-password', { method: 'POST', headers: token ? { Authorization: 'Bearer test', 'Content-Type': 'application/json' } : {}, body: JSON.stringify(body) });
  try {
    globalThis.fetch = () => { throw Error('must not fetch'); };
    assert.equal((await POST(request(false))).status, 401);
    globalThis.fetch = async url => Response.json(url.includes('/auth/') ? args.user : []);
    assert.equal((await POST(request(true))).status, 403);
    const calls = [];
    globalThis.fetch = async url => { calls.push(url); return Response.json(url.includes('/auth/') ? args.user : [{ user_id: 'admin' }]); };
    const preview = await POST(request(true));
    assert.equal(preview.status, 403); assert.equal(calls.length, 2); assert.equal(preview.headers.get('cache-control'), 'no-store');
  } finally { globalThis.fetch = savedFetch; names.forEach((n, i) => saved[i] === undefined ? delete process.env[n] : process.env[n] = saved[i]); }
});
