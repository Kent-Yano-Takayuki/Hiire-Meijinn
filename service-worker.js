// 火入れ名人 - Service Worker
// オフラインでも起動できるように、アプリの中身をキャッシュしておくための最小限のスクリプト。
//
// ★ツールの中身(index.html)を更新したときは、必ずCACHE_NAMEの数字を上げてください。
//   (例: v1 -> v2)。これをしないと、スマホがキャッシュを使い続けて、
//   古いバージョンのまま更新に気づかない場合があります。
const CACHE_NAME = "hi-ire-meijin-v35";

const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "./apple-touch-icon.png",
  "./favicon.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// キャッシュ優先、なければネットワークから取得。
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
