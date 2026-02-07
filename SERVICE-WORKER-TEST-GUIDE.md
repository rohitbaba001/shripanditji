# Service Worker Testing Guide

This guide provides step-by-step instructions for manually testing the service worker functionality in a browser.

## Prerequisites

1. HTTPS server running (service workers require HTTPS)
2. Modern browser (Chrome, Edge, or Firefox recommended)
3. Browser DevTools knowledge

## Test 1: Register Service Worker in Browser

### Steps:
1. Start the HTTPS development server:
   ```bash
   npm run dev
   ```

2. Open browser and navigate to: `https://localhost:8443`

3. Accept the self-signed certificate warning (for development)

4. Open DevTools (F12) → Go to **Application** tab (Chrome) or **Storage** tab (Firefox)

5. Click on **Service Workers** in the left sidebar

### Expected Results:
- ✅ Service worker should be listed as "activated and running"
- ✅ Status should show: `#<worker-id> activated`
- ✅ Source should be: `/sw.js`
- ✅ No errors in the Console tab

---

## Test 2: Verify App Shell is Cached

### Steps:
1. With DevTools open, go to **Application** → **Cache Storage**

2. Expand the cache storage section

3. Look for cache named: `pwa-cache-v1.0.0`

4. Click on the cache to view cached resources

### Expected Results:
- ✅ Cache `pwa-cache-v1.0.0` exists
- ✅ Following resources are cached:
  - `/` or `/index.html`
  - `/offline.html`
  - `/styles.css`
  - `/manifest.json`
  - All icon files (16x16, 32x32, 48x48, 180x180, 192x192, 512x512, maskable icons)

---

## Test 3: Test Offline Functionality

### Steps:
1. With the page loaded and service worker active, open DevTools

2. Go to **Network** tab

3. Check the **Offline** checkbox (or use throttling dropdown → Offline)

4. Reload the page (Ctrl+R or Cmd+R)

### Expected Results:
- ✅ Page should load successfully from cache
- ✅ No network errors in Console
- ✅ Network tab shows resources served from "ServiceWorker"
- ✅ Page displays correctly with all styles and content

---

## Test 4: Verify offline.html for Uncached Pages

### Steps:
1. Keep the browser offline (from Test 3)

2. Try to navigate to an uncached page by typing in the address bar:
   ```
   https://localhost:8443/uncached-page.html
   ```

3. Press Enter

### Expected Results:
- ✅ The offline.html page is displayed
- ✅ Page shows "You are offline" message
- ✅ Shri Pandit Ji branding and logo are visible
- ✅ "Retry Connection" button is present
- ✅ Cached pages list is shown (if any HTML pages are cached)

---

## Test 5: Service Worker Update Lifecycle

### Steps:
1. Go back online (uncheck Offline in Network tab)

2. In DevTools → Application → Service Workers

3. Check the "Update on reload" checkbox

4. Reload the page

### Expected Results:
- ✅ Service worker updates if there are changes
- ✅ New service worker activates
- ✅ Old cache versions are cleaned up

---

## Test 6: Console Logging Verification

### Steps:
1. Open DevTools → Console tab

2. Reload the page (online)

3. Observe the console messages

### Expected Results:
You should see messages like:
- ✅ `[Service Worker] Installing...`
- ✅ `[Service Worker] App shell cached successfully`
- ✅ `[Service Worker] Activating...`
- ✅ `[Service Worker] Old caches cleaned up`
- ✅ `[Service Worker] Claimed all clients`
- ✅ Cache strategy messages (Cache First, Network First, Stale While Revalidate)

---

## Test 7: Caching Strategies Verification

### Test Cache First (Static Assets):
1. Load the page online
2. Go to Network tab
3. Reload the page
4. Look for `/styles.css` request

**Expected**: Should show "from ServiceWorker" or "(ServiceWorker)"

### Test Network First (HTML Pages):
1. Online, navigate to `/index.html`
2. Check Network tab

**Expected**: Should attempt network first, then cache on failure

### Test Stale While Revalidate (Images):
1. Load page with images
2. Check Network tab for image requests

**Expected**: Cached images served immediately, network fetch in background

---

## Troubleshooting

### Service Worker Not Registering:
- Ensure you're using HTTPS (or localhost)
- Check Console for registration errors
- Verify `/sw.js` file exists and is accessible

### Cache Not Working:
- Clear browser cache and reload
- Unregister service worker and re-register
- Check for quota exceeded errors

### Offline Page Not Showing:
- Verify `/offline.html` is in the APP_SHELL_CACHE array
- Check that offline.html is actually cached
- Ensure service worker fetch handler is working

### To Reset Everything:
1. DevTools → Application → Service Workers → Unregister
2. DevTools → Application → Cache Storage → Delete all caches
3. Reload the page

---

## Success Criteria

All tests should pass with the following confirmed:
- ✅ Service worker registers successfully
- ✅ App shell resources are cached
- ✅ Page works offline after initial load
- ✅ Offline.html displays for uncached pages
- ✅ No errors in browser console
- ✅ Caching strategies work as expected
- ✅ Cache versioning and cleanup works

---

## Notes

- Service workers only work on HTTPS or localhost
- Changes to service worker require hard refresh or "Update on reload"
- Cache can be inspected in DevTools → Application → Cache Storage
- Service worker lifecycle: Install → Activate → Fetch
