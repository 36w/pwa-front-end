var cacheName = 'hello-pwa3';

self.addEventListener('install', event => {
    console.log('event:',event);
    event.waitUntil(
        caches.open(cacheName)
            .then(cache => cache.addAll(
                [
                    '/',  // 这个一定要包含整个目录，不然无法离线浏览
                    './images/logo.jpg',
                    './index.html',
                    './newStory.html',
                    './login.html',
                    './register.html',
                    './css/index.css',
                    './css/main.css'
                ]
            )).then(() => self.skipWaiting())
    );
});

self.addEventListener('fetch', function (event) {
    console.log('event',event);
    event.respondWith(
        caches.match(event.request)
            .then(function (response) {
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
    );
});
