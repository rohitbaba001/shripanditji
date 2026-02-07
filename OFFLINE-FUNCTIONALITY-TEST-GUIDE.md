# Offline Functionality Testing Guide

## Overview

This guide provides comprehensive testing procedures for verifying PWA offline functionality.

**Requirements Validated**: 10.3

## Prerequisites

1. **Start the HTTPS development server**:
   ```bash
   npm run dev
   ```
   App running at: `https://localhost:8443`

2. **Open Chrome browser** (recommended for testing)
3. **Open Chrome DevTools** (F12 or Right-click → Inspect)

## Test Scenarios

### Scenario 1: Initial Load and Cache Population

**Objective**: Verify service worker registers and caches app shell

**Steps**:
1. Navigate to `https://localhost:8443`
2. Accept certificate warning
3. Open DevTools → Application tab
4. Click "Service Workers" in left sidebar
5. Verify service worker is registered and status is "activated"
6. Click "Cache Storage" in left sidebar
7. Expand cache entries

**Expected Results**:
- [ ] Service worker shows as "activated and running"
- [ ] Cache storage contains cache with version number (e.g., "shripanditji-pwa-v1.0.0")
- [ ] Cache includes:
  - [ ] `/` or `/index.html`
  - [ ] `/offline.html`
  - [ ] `/styles.min.css`
  - [ ] `/manifest.json`
  - [ ] All icon files (8 icons)

**Console Output**:
Look for these messages in Console:
```
[Service Worker] Installing...
[Service Worker] App shell cached successfully
[Service Worker] Activating...
[Service Worker] Old caches cleaned up
[Service Worker] Claimed all clients
Service Worker registered successfully
```

---

### Scenario 2: Navigate to Cached Pages While Offline

**Objective**: Verify cached pages work when offline

**Steps**:
1. While online, navigate to `https://localhost:8443`
2. Wait for page to fully load
3. Open DevTools → Network tab
4. Check "Offline" checkbox (top of Network tab)
5. Reload the page (Ctrl+R or Cmd+R)

**Expected Results**:
- [ ] Page reloads successfully
- [ ] App shell displays correctly (header, footer, iframe)
- [ ] No error messages
- [ ] Service worker serves content from cache
- [ ] Network tab shows requests served from "ServiceWorker"

**Console Output**:
```
[Service Worker] Using Network First for: /
[Service Worker] Network failed, trying cache: https://localhost:8443/
[Service Worker] Serving from cache: https://localhost:8443/
```

---

### Scenario 3: Navigate to Uncached Pages While Offline

**Objective**: Verify offline.html is displayed for uncached resources

**Steps**:
1. While online, navigate to `https://localhost:8443`
2. Wait for page to fully load
3. Open DevTools → Network tab
4. Check "Offline" checkbox
5. Try to navigate to a non-existent page: `https://localhost:8443/nonexistent.html`

**Expected Results**:
- [ ] offline.html page is displayed
- [ ] Page shows "You are offline" message
- [ ] Page displays app branding and logo
- [ ] Page shows "Available Cached Pages" section
- [ ] Retry button is visible and functional
- [ ] No browser error page (e.g., "This site can't be reached")

**Visual Verification**:
- Orange logo circle with icon
- "Shri Pandit Ji" heading
- "You are offline" message
- List of cached pages (if any)
- Orange "Retry Connection" button

---

### Scenario 4: Go Back Online and Fetch Fresh Content

**Objective**: Verify app fetches fresh content when connection is restored

**Steps**:
1. Start offline (Network tab → "Offline" checked)
2. Navigate to `https://localhost:8443`
3. Verify offline content is served
4. Uncheck "Offline" checkbox (go back online)
5. Reload the page

**Expected Results**:
- [ ] Page reloads successfully
- [ ] Fresh content is fetched from network
- [ ] Service worker updates cache with new content
- [ ] No errors in console
- [ ] Network tab shows requests going to network (not just ServiceWorker)

**Console Output**:
```
[Service Worker] Using Network First for: /
[Service Worker] Network success, updating cache: https://localhost:8443/
```

---

### Scenario 5: Test Offline Fallback for External Resources

**Objective**: Verify external resources (iframe content) handle offline gracefully

**Steps**:
1. While online, load `https://localhost:8443`
2. Wait for iframe to load shripanditji.in content
3. Open DevTools → Network tab
4. Check "Offline" checkbox
5. Reload the page

**Expected Results**:
- [ ] App shell loads from cache
- [ ] Iframe shows connection error (expected - external content)
- [ ] App remains functional (header, footer, install button)
- [ ] No JavaScript errors
- [ ] User can still interact with app shell

**Note**: The iframe content (shripanditji.in) won't work offline since it's external. This is expected behavior.

---

### Scenario 6: Test Cache-First Strategy for Static Assets

**Objective**: Verify CSS/JS files are served from cache without network requests

**Steps**:
1. While online, load `https://localhost:8443`
2. Wait for full page load
3. Open DevTools → Network tab
4. Clear network log (🚫 icon)
5. Check "Offline" checkbox
6. Reload the page
7. Observe network requests

**Expected Results**:
- [ ] `/styles.min.css` served from ServiceWorker
- [ ] `/app.min.js` served from ServiceWorker
- [ ] `/install-manager.min.js` served from ServiceWorker
- [ ] No network errors for cached assets
- [ ] All static assets load successfully

**Network Tab Verification**:
Look for "Size" column showing "(ServiceWorker)" instead of file size.

---

### Scenario 7: Test Stale-While-Revalidate for Images

**Objective**: Verify images are served from cache while updating in background

**Steps**:
1. While online, load `https://localhost:8443`
2. Wait for all icons to load
3. Open DevTools → Network tab
4. Clear network log
5. Reload the page
6. Observe icon requests

**Expected Results**:
- [ ] Icons load immediately from cache
- [ ] Network requests for icons happen in background
- [ ] Console shows "Serving stale from cache" messages
- [ ] Console shows "Updating cache in background" messages
- [ ] No delay in icon display

**Console Output**:
```
[Service Worker] Using Stale While Revalidate for: /icons/icon-192x192.svg
[Service Worker] Serving stale from cache: https://localhost:8443/icons/icon-192x192.svg
[Service Worker] Updating cache in background: https://localhost:8443/icons/icon-192x192.svg
```

---

### Scenario 8: Test Offline Page Cached Pages List

**Objective**: Verify offline page displays list of cached pages

**Steps**:
1. While online, navigate to `https://localhost:8443`
2. Navigate to `https://localhost:8443/offline.html` (to cache it)
3. Go back to home page
4. Open DevTools → Network tab
5. Check "Offline" checkbox
6. Navigate to a non-existent page
7. Observe the "Available Cached Pages" section

**Expected Results**:
- [ ] Offline page displays
- [ ] "Available Cached Pages" section shows cached HTML pages
- [ ] List includes "Home" (/) and "offline.html"
- [ ] Links are clickable
- [ ] Clicking links navigates to cached pages

---

### Scenario 9: Test Retry Button Functionality

**Objective**: Verify retry button works correctly

**Steps**:
1. Go offline (Network tab → "Offline" checked)
2. Navigate to a non-existent page to trigger offline.html
3. Click "Retry Connection" button
4. Observe behavior
5. Uncheck "Offline" checkbox (go back online)
6. Click "Retry Connection" button again

**Expected Results**:
- [ ] While offline: Alert shows "You are still offline"
- [ ] While online: Page reloads and fetches fresh content
- [ ] Button is touch-friendly (44x44 minimum)
- [ ] Button has proper focus styles

---

### Scenario 10: Test Automatic Reconnection

**Objective**: Verify app automatically reloads when connection is restored

**Steps**:
1. Go offline (Network tab → "Offline" checked)
2. Navigate to offline.html
3. Keep offline.html open
4. Uncheck "Offline" checkbox (simulate connection restored)
5. Observe behavior

**Expected Results**:
- [ ] Page automatically reloads when online
- [ ] Fresh content is fetched
- [ ] User is redirected to home page or last requested page

**Note**: This uses the `window.addEventListener('online', ...)` event in offline.html.

---

## Testing Checklist Summary

Complete all scenarios:
- [ ] Scenario 1: Initial load and cache population
- [ ] Scenario 2: Navigate to cached pages while offline
- [ ] Scenario 3: Navigate to uncached pages while offline
- [ ] Scenario 4: Go back online and fetch fresh content
- [ ] Scenario 5: Test offline fallback for external resources
- [ ] Scenario 6: Test cache-first strategy for static assets
- [ ] Scenario 7: Test stale-while-revalidate for images
- [ ] Scenario 8: Test offline page cached pages list
- [ ] Scenario 9: Test retry button functionality
- [ ] Scenario 10: Test automatic reconnection

---

## Common Issues and Solutions

### Issue: Service worker not registering

**Solutions**:
- Ensure app is served over HTTPS
- Check for JavaScript errors in console
- Verify sw.min.js file exists and is accessible
- Clear browser cache and reload

### Issue: Offline page not displaying

**Solutions**:
- Verify offline.html is cached (check Cache Storage)
- Check service worker fetch handler returns offline.html
- Ensure offline.html is in APP_SHELL_CACHE array

### Issue: Cached content not updating

**Solutions**:
- Increment CACHE_VERSION in sw.js
- Unregister service worker and re-register
- Clear cache storage manually
- Check network-first strategy is working

### Issue: External iframe content not working offline

**Expected Behavior**: This is normal - external content (shripanditji.in) won't work offline unless it has its own service worker.

---

## Testing Results Template

Document your testing results:

### Scenario Results

| Scenario | Status | Notes |
|----------|--------|-------|
| 1. Initial load and cache | ✅ / ❌ | |
| 2. Cached pages offline | ✅ / ❌ | |
| 3. Uncached pages offline | ✅ / ❌ | |
| 4. Back online fresh content | ✅ / ❌ | |
| 5. External resources offline | ✅ / ❌ | |
| 6. Cache-first static assets | ✅ / ❌ | |
| 7. Stale-while-revalidate images | ✅ / ❌ | |
| 8. Offline page cached list | ✅ / ❌ | |
| 9. Retry button | ✅ / ❌ | |
| 10. Automatic reconnection | ✅ / ❌ | |

### Overall Assessment

- **All scenarios passed**: ✅ / ❌
- **Critical issues found**: (list any)
- **Non-critical issues**: (list any)
- **Offline functionality working**: ✅ / ❌

---

## Success Criteria

Task 16.5 is complete when:
- ✅ Service worker registers and caches app shell
- ✅ Cached pages work offline
- ✅ Uncached pages show offline.html
- ✅ Fresh content fetched when back online
- ✅ All caching strategies work correctly
- ✅ All 10 test scenarios pass

---

## Next Steps

After completing offline functionality testing:
1. Document any issues found
2. Fix critical offline issues
3. Proceed to Task 16.6 (Test responsive design)
