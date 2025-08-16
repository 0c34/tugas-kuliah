// sw.js – Cache First (mengacu pada web.dev/learn/pwa/serving – strategi Cache First)
// [MODIFIKASI] Tambahan cache app shell, offline fallback yang mencantumkan Nama/NIM.

const CACHE_NAME = 'cache-first-v1';
const APP_SHELL = [
  './',
  './index.html'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
  const req = event.request;

  // Strategi Cache First (lihat web.dev: caches.match() lalu fallback ke fetch)
  // Jika ini permintaan navigasi (dokumen), gunakan cache terlebih dahulu, lalu jaringan, lalu fallback offline.
  if (req.mode === 'navigate') {
    event.respondWith((async () => {
      // 1) Coba dari cache
      const cached = await caches.match('./index.html');
      if (cached) return cached;

      // 2) Coba jaringan
      try {
        const net = await fetch(req);
        // Simpan snapshot ke cache untuk kunjungan berikutnya
        const cache = await caches.open(CACHE_NAME);
        cache.put('./index.html', net.clone());
        return net;
      } catch (err) {
        // 3) Fallback offline (respons HTML dinamis)
        const offlineHtml = `<!doctype html>
<html lang="id"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Offline – Sulhaedir (225411113)</title>
<style>
  body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial;margin:0;display:grid;place-items:center;min-height:100vh;background:#0b1220;color:#e5ecff}
  .box{max-width:42rem;padding:1.25rem;border:1px solid #1f2a44;border-radius:14px;background:#0f172a}
  h1{margin:.25rem 0}
  .meta{opacity:.85;margin-top:.25rem}
  .badge{display:inline-block;padding:.35rem .6rem;border-radius:999px;background:#fef2f2;color:#b91c1c;border:1px solid #fecaca;font-weight:700}
</style>
<main class="box">
  <h1>Anda Offline</h1>
  <p class="meta">Konten utama tidak tersedia. Cobalah online kembali.</p>
  <p><strong>Nama:</strong> Sulhaedir &nbsp;|&nbsp; <strong>NIM:</strong> 225411113 <!-- [MODIFIKASI] Identitas pada halaman offline --></p>
  <p><span class="badge">OFFLINE</span></p>
</main>`;
        return new Response(offlineHtml, { headers: { 'Content-Type': 'text/html; charset=UTF-8' } });
      }
    })());
    return;
  }

  // Untuk request selain navigasi: coba Cache First (serve dari cache, jika tidak ada baru ke network)
  event.respondWith((async () => {
    const cached = await caches.match(req);
    if (cached) return cached;
    try {
      const net = await fetch(req);
      // (opsional) tulis ke cache untuk permintaan berikutnya
      const cache = await caches.open(CACHE_NAME);
      cache.put(req, net.clone());
      return net;
    } catch (err) {
      // Jika benar-benar gagal, bubble error
      return Response.error();
    }
  })());
});
