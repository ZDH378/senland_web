'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"version.json": "5e7c80b8aee364e3d988672a0da774f5",
"index.html": "e9c39ec489c6122d878107bb5cdf0e08",
"/": "e9c39ec489c6122d878107bb5cdf0e08",
"main.dart.js": "239308169a9ba993f8702b16e534c3fe",
"flutter.js": "7d69e653079438abfbb24b82a655b0a4",
"favicon.png": "0d2f7bef7165941ee6598ed03368269b",
"icons/Icon-192.png": "f790073cc5e8b7e5cf28066d1274e1c3",
"icons/Icon-maskable-192.png": "f790073cc5e8b7e5cf28066d1274e1c3",
"icons/Icon-maskable-512.png": "0d2f926e30dccdab1999ed744220bf8d",
"icons/Icon-512.png": "0d2f926e30dccdab1999ed744220bf8d",
"manifest.json": "4cb9702a2e1ce961701461d09c3c9a02",
"assets/AssetManifest.json": "4c90890fcfec183939ce5ed4192bba35",
"assets/NOTICES": "d857e38cfc96d22506d71df82918ea5a",
"assets/FontManifest.json": "a98aa6c293c4a6617420367680be3d70",
"assets/AssetManifest.bin.json": "76483d075ca20206ed002ffa49ce5efc",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "89ed8f4e49bcdfc0b5bfc9b24591e347",
"assets/shaders/ink_sparkle.frag": "4096b5150bac93c41cbc9b45276bd90f",
"assets/AssetManifest.bin": "db119dd9be414e420f90a42d08ebd64b",
"assets/fonts/MaterialIcons-Regular.otf": "1ebd28512077f676d8e8b4c4e55d20ee",
"assets/assets/images/ic_hot_search.png": "aabc5e487667b31947444264c3356350",
"assets/assets/images/ic_logo_oval_96.png": "5840bc839bee373a49dd61874cfd1349",
"assets/assets/images/ic_checkbox_normal.png": "56acb6b36ac2f99a48e06d66544e4e9e",
"assets/assets/images/ic_main_mine_normal.png": "6bfc7b209301519e29794f88cb6f60f3",
"assets/assets/images/ic_main_mine_checked.png": "2ac163e67488cd8effa388dba203cd2c",
"assets/assets/images/ic_main_home_checked.png": "cde9e740ab1b62cf358560f4d44ddacf",
"assets/assets/images/ic_index_go_top.png": "3a9bd7d794a71a2ac60cebba3c949d82",
"assets/assets/images/ic_dialog_close.png": "8006ba38ef3af862f7f61d2905271a8a",
"assets/assets/images/ic_home_search.png": "71200678770334c94b37eaa3d7819098",
"assets/assets/images/ic_main_home_normal.png": "00820a0ca7d1b78e56b730fefb1a7ff6",
"assets/assets/images/ic_launcher.png": "d4b976fe0d0a43274ff7054c23772f06",
"assets/assets/images/ic_main_publish_normal.png": "6bc503642709270912f25fb0cdd0667b",
"assets/assets/images/ic_menu_bottom.png": "be1088a4f5d9d30547dac66ad77fc25f",
"assets/assets/images/ic_main_order_checked.png": "07e1cfea1c3d2573750784dc0bcba6d4",
"assets/assets/images/ic_main_publish_checked.png": "e9850c962bb2190b202efcb8874d554b",
"assets/assets/images/ic_checkbox_checked.png": "2d2ef00849425372a6d32878d179ce2a",
"assets/assets/images/ic_main_order_normal.png": "e9ee942477dda4d41ae0b0c718ec8b02",
"assets/assets/images/ic_share_wechat.png": "2b8ee5063a53c2d477bf6d4f898384a8",
"assets/assets/images/ic_menu_top.png": "1d3efffd05c8a2adaafe9da2578e83fd",
"assets/assets/images/ic_logo_text.png": "1604b7529415d1ed79f5325605026986",
"assets/assets/lottie/refresh_loading.json": "b90bcb6ceb76c0b8d884749a00dc68e4",
"assets/assets/lottie/empty_list.json": "b1aae2addb824615bc8211e3a5d738fd",
"assets/assets/lottie/search_empty.json": "c4529e6ff37f7dd6a82483180859bb16",
"assets/assets/fonts/fangyuantivf_thin.ttf": "3b91e1b64cb787e106fb8fb1b58ed045",
"canvaskit/skwasm.js": "87063acf45c5e1ab9565dcf06b0c18b8",
"canvaskit/skwasm.wasm": "4124c42a73efa7eb886d3400a1ed7a06",
"canvaskit/chromium/canvaskit.js": "0ae8bbcc58155679458a0f7a00f66873",
"canvaskit/chromium/canvaskit.wasm": "f87e541501c96012c252942b6b75d1ea",
"canvaskit/canvaskit.js": "eb8797020acdbdf96a12fb0405582c1b",
"canvaskit/canvaskit.wasm": "64edb91684bdb3b879812ba2e48dd487",
"canvaskit/skwasm.worker.js": "bfb704a6c714a75da9ef320991e88b03"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"assets/AssetManifest.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
