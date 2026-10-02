// Run with PLAYWRIGHT_MODULE and CHROMIUM_MODULE pointing at test-only packages.
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE);
const chromiumModule = require(process.env.CHROMIUM_MODULE);
const engine = chromiumModule.default || chromiumModule;
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_BIN || await engine.executablePath(), args: engine.args, headless: true });
const base = process.env.IBAN_TEST_BASE || 'http://127.0.0.1:33241';
const server = process.env.IBAN_TEST_BASE ? null : spawn(process.execPath, [require.resolve('next/dist/bin/next'), 'start', '--hostname', '127.0.0.1', '--port', '33241'], { stdio: 'ignore' });
const card = { business_name: 'Pink Rose Cafe', bank_name: 'Ziraat Bankası', account_holder: 'Örnek Uzun Hesap Sahibi Adı Soyadı', iban: 'TR00 0000 0000 0000 0000 0000 00', locked_at: '2026-10-02T07:00:00Z' };
try {
  for (let i = 0; i < 100; i++) {
    try { await fetch(`${base}/i/demo`); break; } catch { if (i === 99) throw Error('Test server did not start'); await new Promise(r => setTimeout(r, 100)); }
  }
  const context = await browser.newContext();
  await context.addInitScript(() => {
    window.copies = [];
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async text => { if (window.failCopy) throw Error('denied'); window.copies.push(text); } } });
  });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  let status = 200;
  await page.route('**/api/public-iban/*', route => route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(status === 200 ? card : { error: 'unavailable' }) }));
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto(`${base}/i/TEST01`);
    await page.getByRole('heading', { name: card.business_name, exact: true }).waitFor();
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `overflow at ${width}`);
    await page.getByRole('button', { name: 'IBAN’ı kopyala', exact: true }).click();
    assert.equal(await page.evaluate(() => window.copies.at(-1)), card.iban.replace(/\s+/g, ''));
    await page.getByRole('button', { name: 'Hesap sahibini kopyala', exact: true }).click();
    assert.equal(await page.evaluate(() => window.copies.at(-1)), card.account_holder);
    await page.getByText('Hesap bilgileri kilitli', { exact: true }).click();
    await page.getByText('Kilitlenme tarihi: 02.10.2026', { exact: true }).waitFor();
    assert.ok(!await page.getByText('Doğrulanmış ödeme bilgileri', { exact: true }).count());
    if (width === 390 || width === 1440) {
      await page.getByText('Hesap bilgileri kilitli', { exact: true }).click();
      await page.screenshot({ path: `/tmp/dokunuver-iban-${width}.png`, fullPage: true });
    }
  }
  await page.evaluate(() => { window.failCopy = true; });
  await page.getByRole('button', { name: 'IBAN’ı kopyala', exact: true }).click();
  await page.getByRole('status').filter({ hasText: 'Kopyalama yapılamadı' }).waitFor();
  status = 404;
  await page.goto(`${base}/i/TEST02`);
  await page.getByRole('heading', { name: 'Kart kullanıma açık değil' }).waitFor();
  assert.equal(await page.getByRole('button').count(), 0);
  status = 503;
  await page.goto(`${base}/i/TEST03`);
  await page.getByRole('heading', { name: 'Bilgilere ulaşılamadı' }).waitFor();
  status = 200;
  await page.getByRole('button', { name: 'Tekrar dene' }).click();
  await page.getByRole('heading', { name: card.business_name, exact: true }).waitFor();
  await page.goto(`${base}/i/demo`);
  await page.getByText('Örnek görünüm · Bu bilgilerle ödeme yapmayın.', { exact: true }).waitFor();
  assert.equal(await page.locator('details').count(), 0);
  assert.deepEqual(errors, []);
  console.log('PASS: 320/390/768/1440 px, exact IBAN/name clipboard, locked details, copy failure, inactive/error/retry, demo, no runtime errors.');
} finally { await browser.close(); server?.kill('SIGTERM'); }
