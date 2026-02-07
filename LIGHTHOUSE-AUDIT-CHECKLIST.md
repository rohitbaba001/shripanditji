# Lighthouse PWA Audit Checklist

## Prerequisites

1. **Start the HTTPS development server**:
   ```bash
   npm run dev
   ```
   The app should be running at `https://localhost:8443`

2. **Open Chrome browser** and navigate to `https://localhost:8443`
   - Accept the self-signed certificate warning (click "Advanced" → "Proceed to localhost")

## Running Lighthouse Audit

### Method 1: Chrome DevTools (Recommended)

1. Open Chrome DevTools (F12 or Right-click → Inspect)
2. Click on the "Lighthouse" tab (may be under >> menu)
3. Configure the audit:
   - ✅ Categories: Check "Progressive Web App"
   - ✅ Device: Select "Mobile"
   - ✅ Mode: Select "Navigation"
4. Click "Analyze page load"
5. Wait for the audit to complete (30-60 seconds)

### Method 2: Lighthouse CLI

```bash
npm install -g lighthouse
lighthouse https://localhost:8443 --view --preset=desktop
```

## PWA Audit Criteria Checklist

### Required Criteria (Must Pass)

- [ ] **Installable**
  - [ ] Web app manifest meets requirements
  - [ ] Service worker registered
  - [ ] HTTPS enabled
  - [ ] Has icons (192x192 and 512x512)

- [ ] **PWA Optimized**
  - [ ] Viewport meta tag present
  - [ ] Theme color meta tag present
  - [ ] Content sized correctly for viewport
  - [ ] Display mode is standalone or fullscreen

- [ ] **Offline Functionality**
  - [ ] Service worker controls page and assets
  - [ ] Start URL responds with 200 when offline
  - [ ] Offline fallback page available

- [ ] **Performance**
  - [ ] Page loads fast on mobile networks
  - [ ] First Contentful Paint < 3s
  - [ ] Time to Interactive < 5s

### Expected PWA Score

**Target: ≥ 90%**

## Common Issues and Fixes

### Issue: "Does not register a service worker"
**Fix**: Ensure sw.js is being served and app.js registers it correctly

### Issue: "Web app manifest does not meet installability requirements"
**Fix**: Check manifest.json has all required fields (name, short_name, start_url, display, icons)

### Issue: "Does not respond with a 200 when offline"
**Fix**: Verify service worker caches the start_url and serves it when offline

### Issue: "Manifest doesn't have a maskable icon"
**Fix**: Already included in manifest.json - verify icon files exist

### Issue: "Page does not work offline"
**Fix**: Check service worker fetch handler and cache strategies

## Verification Steps

After running Lighthouse:

1. **Check PWA Score**: Should be ≥ 90%
2. **Review Failed Audits**: Address any red items
3. **Check Warnings**: Review and fix yellow items if possible
4. **Verify Installability**: 
   - Look for install button in Chrome address bar
   - Click to verify install prompt appears
5. **Test Offline**:
   - Open DevTools → Network tab
   - Check "Offline" checkbox
   - Reload page - should still work

## Results Documentation

Record your results:

- **PWA Score**: ____%
- **Installable**: ✅ / ❌
- **Offline Ready**: ✅ / ❌
- **Performance Score**: ____%
- **Failed Audits**: (list any)
- **Warnings**: (list any)

## Next Steps

If PWA score < 90%:
1. Review failed audits in detail
2. Fix issues one by one
3. Re-run Lighthouse
4. Repeat until score ≥ 90%

If PWA score ≥ 90%:
✅ Task 16.3 complete - proceed to task 16.4
