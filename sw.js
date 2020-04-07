var version = 'hello-pwa3';

// Serverice Worker 安装成功后触发该事件
self.addEventListener('install', event => {
    console.log('event:',event);
    // sw.js 有更新，立即生效
    event.waitUntil(
        caches.open(version)
            .then(cache => cache.addAll(
                [
                    '/',  // 这个一定要包含整个目录，不然无法离线浏览
                    './images/logo.jpg',
                    './index.html',
                    './newStory.html',
                    './login.html',
                    './register.html',
                    './css/index.css',
                    './main.css',
                    './socket.io.js'
                ]
            )).then(() => self.skipWaiting())
    );
});

// sw.js 有更新时触发该事件
self.addEventListener('activate', function (event) {
    event.waitUntil(
        Promise.all([
            // 更新客户端
            self.clients.claim(),

            // 删除旧版本的缓存对象
            caches.keys().then(function (cacheList) {
                return Promise.all(
                    cacheList.map(function (cacheName) {
                        if (cacheName !== version) {
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
        ])
    );
});

// 网页发送请求触发该事件
self.addEventListener('fetch', function (event) {
    // 打印请求资源网址
    console.log('url is', event.request.url);
    event.respondWith(
        // caches 是全局变量，它就是缓存对象
        // 这一步是判断缓存中是否有该资源
        caches.match(event.request).then(function (cacheRes) {

            // cacheRes 不为空，缓存中有该资源，直接返回给浏览器
            // 省去一次 http 请求
            if (cacheRes) {
                return cacheRes;
            }
            // cacheRes 为空，表示缓存中没有该请求
            // 把原始请求拷过来
            var request = event.request.clone();

            // fetch 是浏览器自带的请求库，往服务端发送请求
            return fetch(request).then(function (httpRes) {
                // 请求失败了，直接返回失败的结果就好了。。
                if (!httpRes || httpRes.status !== 200) {
                    return httpRes;
                }
                return httpRes;
            });
        })
    );
});
