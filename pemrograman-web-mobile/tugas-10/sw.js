console.log('Service Worker: Skrip dimuat.');

// Event 'install' - Terjadi saat Service Worker pertama kali diinstal
self.addEventListener('install', (event) => {
  console.log('Service Worker: Event install dipicu.');
  // SkipWaiting akan mengaktifkan Service Worker baru segera setelah diinstal
  // tanpa menunggu semua tab yang ada ditutup.
  self.skipWaiting();
});

// Event 'activate' - Terjadi saat Service Worker menjadi aktif
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Event activate dipicu.');
  // Clients.claim akan membuat Service Worker mengambil kendali atas
  // semua klien yang terbuka (tab/windows) dalam lingkupnya.
  event.waitUntil(clients.claim());
  console.log('Service Worker: Berhasil mengklaim klien.');
});

// Event 'fetch' - Terjadi setiap kali ada permintaan jaringan dari halaman
// yang dikendalikan
self.addEventListener('fetch', (event) => {
  console.log('Service Worker: Mencegat permintaan untuk:', event.request.url);
  // Dalam contoh ini, kita tidak melakukan caching.
  // Kita hanya mengembalikan permintaan ke jaringan secara default.
  event.respondWith(fetch(event.request));
});

console.log('Service Worker: Skrip selesai dieksekusi.');