import test from 'node:test';
import assert from 'node:assert/strict';
import { loginToPanel } from '../lib/panel-login.mjs';

const config = { url: 'https://example.supabase.co/', key: 'test-key', email: ' admin@example.com ', password: 'test-password' };
test('missing configuration never sends credentials', async () => {
  for (const overrides of [{url: undefined}, {url: 'undefined'}, {url: 'javascript:alert(1)'}, {key: undefined}]) {
    await assert.rejects(loginToPanel({...config, ...overrides, fetchImpl: () => assert.fail('must not fetch')}), /ayar|anahtar/);
  }
});
test('HTML and malformed JSON produce a useful error', async () => {
  for (const body of ['<!DOCTYPE html><html></html>', '{broken']) {
    await assert.rejects(loginToPanel({...config, fetchImpl: async () => new Response(body, {status: 404})}), /geçersiz yanıt/);
  }
});
test('wrong password differs from a configuration or service error', async () => {
  await assert.rejects(loginToPanel({...config, fetchImpl: async () => Response.json({error_code: 'invalid_credentials'}, {status: 400})}), /E-posta veya şifre hatalı/);
  await assert.rejects(loginToPanel({...config, fetchImpl: async () => Response.json({message: 'Invalid API key'}, {status: 401})}), /bağlantı ayarlarını/);
});
test('network failure is handled', async () => {
  await assert.rejects(loginToPanel({...config, fetchImpl: async () => {throw new TypeError('Failed to fetch');}}), /ulaşılamadı/);
});
test('successful login returns valid tokens and normalizes URL and email', async () => {
  const tokens = {access_token: 'access', refresh_token: 'refresh'};
  const result = await loginToPanel({...config, fetchImpl: async (url, options) => {
    assert.equal(url, 'https://example.supabase.co/auth/v1/token?grant_type=password');
    assert.deepEqual(JSON.parse(options.body), {email: 'admin@example.com', password: config.password});
    return Response.json(tokens);
  }});
  assert.deepEqual(result, tokens);
});
test('a successful HTTP response without tokens cannot become a session', async () => {
  await assert.rejects(loginToPanel({...config, fetchImpl: async () => Response.json({})}), /geçerli bir oturum/);
});
