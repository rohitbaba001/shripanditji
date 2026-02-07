/**
 * Service Worker for Shri Pandit Ji PWA
 * 
 * Implements caching strategies:
 * - Cache First: Static assets (CSS, JS, fonts)
 * - Network First: HTML pages
 * - Stale While Revalidate: Images
 */

// Import CacheManager (for service worker context)
importScripts('/cache-manager.min.js');

// Cache version constant
const CACHE_VERSION = '1.0.0';

// App shell cache - static assets to cache on install
const APP_SHELL_CACHE = [
  '/',
  '/index.html',
  '/offline.html',
  '/styles.min.css',
  '/manifest.json',
  '/icons/icon-16x16.svg',
  '/icons/icon-32x32.svg',
  '/icons/icon-48x48.svg',
  '/icons/icon-180x180.svg',
  '/icons/icon-192x192.svg',
  '/icons/icon-512x512.svg',
  '/icons/icon-192x192-maskable.svg',
  '/icons/icon-512x512-maskable.svg'
];

// Initialize cache manager
const cacheManager = new CacheManager(CACHE_VERSION);

/**
 * Install Event Handler
 * Caches app shell resources on service worker installation
 */
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  
  event.waitUntil(
    (async () => {
      try {
        const cacheName = cacheManager.getCacheName();
        await cacheManager.addToCache(cacheName, APP_SHELL_CACHE);
        console.log('[Service Worker] App shell cached successfully');
        
        // Skip waiting to activate immediately
        await self.skipWaiting();
      } catch (error) {
        console.error('[Service Worker] Installation failed:', error);
        throw error;
      }
    })()
  );
});

/**
 * Activate Event Handler
 * Cleans up old cache versions and takes control of all clients
 */
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  
  event.waitUntil(
    (async () => {
      try {
        // Clean up old cache versions
        await cacheManager.cleanOldCaches();
        console.log('[Service Worker] Old caches cleaned up');
        
        // Take control of all clients immediately
        await self.clients.claim();
        console.log('[Service Worker] Claimed all clients');
      } catch (error) {
        console.error('[Service Worker] Activation failed:', error);
        throw error;
      }
    })()
  );
});

/**
 * Cache First Strategy
 * Serves from cache if available, otherwise fetches from network and caches
 * Used for: Static assets (CSS, JS, fonts)
 * 
 * @param {Request} request - The request to handle
 * @returns {Promise<Response>} The response from cache or network
 */
async function cacheFirst(request) {
  try {
    const cacheName = cacheManager.getCacheName();
    const cache = await caches.open(cacheName);
    
    // Check cache for request
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      console.log('[Service Worker] Cache hit:', request.url);
      return cachedResponse;
    }
    
    // Not in cache, fetch from network
    console.log('[Service Worker] Cache miss, fetching:', request.url);
    const networkResponse = await fetch(request);
    
    // Cache the network response for future use
    if (networkResponse && networkResponse.status === 200) {
      // Clone the response before caching
      const responseToCache = networkResponse.clone();
      
      // Add timestamp header for cache management
      const headers = new Headers(responseToCache.headers);
      headers.set('x-cache-timestamp', Date.now().toString());
      
      const responseWithTimestamp = new Response(responseToCache.body, {
        status: responseToCache.status,
        statusText: responseToCache.statusText,
        headers: headers
      });
      
      await cache.put(request, responseWithTimestamp);
      
      // Enforce cache limits
      await cacheManager.enforceCacheLimits(cacheName);
    }
    
    return networkResponse;
  } catch (error) {
    console.error('[Service Worker] Cache first strategy failed:', error);
    throw error;
  }
}

/**
 * Network First Strategy
 * Attempts network fetch with timeout, falls back to cache on failure
 * Used for: HTML pages
 * 
 * @param {Request} request - The request to handle
 * @returns {Promise<Response>} The response from network or cache
 */
async function networkFirst(request) {
  const cacheName = cacheManager.getCacheName();
  const cache = await caches.open(cacheName);
  
  try {
    // Create a timeout promise (10 seconds)
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Network timeout')), 10000);
    });
    
    // Race between fetch and timeout
    const networkResponse = await Promise.race([
      fetch(request),
      timeoutPromise
    ]);
    
    // Update cache with successful response
    if (networkResponse && networkResponse.status === 200) {
      console.log('[Service Worker] Network success, updating cache:', request.url);
      
      // Clone the response before caching
      const responseToCache = networkResponse.clone();
      
      // Add timestamp header for cache management
      const headers = new Headers(responseToCache.headers);
      headers.set('x-cache-timestamp', Date.now().toString());
      
      const responseWithTimestamp = new Response(responseToCache.body, {
        status: responseToCache.status,
        statusText: responseToCache.statusText,
        headers: headers
      });
      
      await cache.put(request, responseWithTimestamp);
      
      // Enforce cache limits
      await cacheManager.enforceCacheLimits(cacheName);
    }
    
    return networkResponse;
  } catch (error) {
    // Network failed, try cache
    console.log('[Service Worker] Network failed, trying cache:', request.url);
    
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      console.log('[Service Worker] Serving from cache:', request.url);
      return cachedResponse;
    }
    
    // Not in cache either, serve offline page
    console.log('[Service Worker] Not in cache, serving offline page');
    const offlineResponse = await cache.match('/offline.html');
    
    if (offlineResponse) {
      return offlineResponse;
    }
    
    // Fallback if offline page is not cached
    return new Response('Offline - No cached content available', {
      status: 503,
      statusText: 'Service Unavailable',
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}

/**
 * Stale While Revalidate Strategy
 * Serves cached version immediately while fetching fresh version in background
 * Used for: Images
 * 
 * @param {Request} request - The request to handle
 * @returns {Promise<Response>} The response from cache or network
 */
async function staleWhileRevalidate(request) {
  const cacheName = cacheManager.getCacheName();
  const cache = await caches.open(cacheName);
  
  // Check cache for request
  const cachedResponse = await cache.match(request);
  
  // Fetch from network in background to update cache
  const fetchPromise = fetch(request)
    .then(async (networkResponse) => {
      if (networkResponse && networkResponse.status === 200) {
        console.log('[Service Worker] Updating cache in background:', request.url);
        
        // Clone the response before caching
        const responseToCache = networkResponse.clone();
        
        // Add timestamp header for cache management
        const headers = new Headers(responseToCache.headers);
        headers.set('x-cache-timestamp', Date.now().toString());
        
        const responseWithTimestamp = new Response(responseToCache.body, {
          status: responseToCache.status,
          statusText: responseToCache.statusText,
          headers: headers
        });
        
        await cache.put(request, responseWithTimestamp);
        
        // Enforce cache limits
        await cacheManager.enforceCacheLimits(cacheName);
      }
      
      return networkResponse;
    })
    .catch((error) => {
      console.log('[Service Worker] Background fetch failed:', error.message);
      return null;
    });
  
  // If cached, return immediately
  if (cachedResponse) {
    console.log('[Service Worker] Serving stale from cache:', request.url);
    return cachedResponse;
  }
  
  // Not cached, wait for network response
  console.log('[Service Worker] Not cached, waiting for network:', request.url);
  return fetchPromise;
}

/**
 * Fetch Event Handler
 * Routes requests to appropriate caching strategy based on resource type
 */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Only handle requests from our origin
  if (url.origin !== location.origin) {
    return;
  }
  
  event.respondWith(
    (async () => {
      try {
        // Route based on resource type
        
        // Static assets (CSS, JS, fonts) → Cache First
        if (
          request.destination === 'style' ||
          request.destination === 'script' ||
          request.destination === 'font' ||
          url.pathname.endsWith('.css') ||
          url.pathname.endsWith('.js') ||
          url.pathname.endsWith('.woff') ||
          url.pathname.endsWith('.woff2') ||
          url.pathname.endsWith('.ttf') ||
          url.pathname.endsWith('.otf')
        ) {
          console.log('[Service Worker] Using Cache First for:', url.pathname);
          return await cacheFirst(request);
        }
        
        // Images → Stale While Revalidate
        if (
          request.destination === 'image' ||
          url.pathname.endsWith('.jpg') ||
          url.pathname.endsWith('.jpeg') ||
          url.pathname.endsWith('.png') ||
          url.pathname.endsWith('.gif') ||
          url.pathname.endsWith('.webp') ||
          url.pathname.endsWith('.svg') ||
          url.pathname.endsWith('.ico')
        ) {
          console.log('[Service Worker] Using Stale While Revalidate for:', url.pathname);
          return await staleWhileRevalidate(request);
        }
        
        // HTML pages and documents → Network First
        if (
          request.destination === 'document' ||
          request.mode === 'navigate' ||
          url.pathname.endsWith('.html') ||
          url.pathname === '/'
        ) {
          console.log('[Service Worker] Using Network First for:', url.pathname);
          return await networkFirst(request);
        }
        
        // Default: try network first for other resources
        console.log('[Service Worker] Using Network First (default) for:', url.pathname);
        return await networkFirst(request);
        
      } catch (error) {
        console.error('[Service Worker] Fetch handler error:', error);
        
        // Serve offline fallback page on error
        const cacheName = cacheManager.getCacheName();
        const cache = await caches.open(cacheName);
        const offlineResponse = await cache.match('/offline.html');
        
        if (offlineResponse) {
          return offlineResponse;
        }
        
        // Ultimate fallback
        return new Response('Service Worker Error - Unable to serve content', {
          status: 503,
          statusText: 'Service Unavailable',
          headers: { 'Content-Type': 'text/plain' }
        });
      }
    })()
  );
});
