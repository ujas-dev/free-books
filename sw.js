const CACHE_NAME = 'document-library-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/favicon.ico',
    '/favicon-32x32.png',
    '/favicon-16x16.png',
    '/apple-touch-icon.png'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(urlsToCache))
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                if (response) {
                    return response;
                }
                return fetch(event.request).catch(() => {
                    // Return offline fallback for document requests
                    if (event.request.url.includes('/documents/')) {
                        return new Response('Document not available offline', {
                            headers: { 'Content-Type': 'text/plain' }
                        });
                    }
                });
            })
    );
});
