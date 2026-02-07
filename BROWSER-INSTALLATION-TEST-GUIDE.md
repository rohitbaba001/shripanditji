# Browser Installation Testing Guide

## Overview

This guide provides step-by-step instructions for testing PWA installation across different browsers and platforms.

**Requirements Validated**: 5.1, 10.2

## Prerequisites

1. **Start the HTTPS development server**:
   ```bash
   npm run dev
   ```
   App running at: `https://localhost:8443`

2. **Ensure PWA meets installability criteria**:
   - ✅ Served over HTTPS
   - ✅ Has valid manifest.json
   - ✅ Has registered service worker
   - ✅ Has icons (192x192 and 512x512)

## Testing Checklist

### 1. Chrome Desktop (Windows/Mac/Linux)

**Installation Steps**:
1. Open Chrome browser
2. Navigate to `https://localhost:8443`
3. Accept self-signed certificate warning
4. Look for install icon in address bar (⊕ or computer icon)
5. Click the install icon OR click the "Install App" button on the page
6. Verify install prompt appears with app name and icon
7. Click "Install"

**Verification**:
- [ ] Install prompt appeared
- [ ] App installed successfully
- [ ] App opens in standalone window (no browser UI)
- [ ] App icon appears in Start Menu/Applications
- [ ] App can be launched from desktop/start menu
- [ ] Address bar is hidden (standalone mode)
- [ ] Theme color applied to title bar

**Uninstall** (for retesting):
- Click three dots in app window → Uninstall "Shri Pandit Ji"

---

### 2. Chrome Android

**Installation Steps**:
1. Open Chrome on Android device
2. Navigate to `https://[YOUR_IP]:8443` (use your computer's IP address)
   - Find IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
   - Example: `https://192.168.1.100:8443`
3. Accept certificate warning
4. Tap three dots menu → "Install app" OR tap "Install App" button
5. Verify install prompt appears
6. Tap "Install"

**Verification**:
- [ ] Install prompt appeared
- [ ] App installed successfully
- [ ] App icon added to home screen
- [ ] App launches in standalone mode (no browser UI)
- [ ] Status bar uses theme color (#FF6B35)
- [ ] Splash screen displays on launch
- [ ] App appears in app drawer

**Uninstall** (for retesting):
- Long press app icon → App info → Uninstall

---

### 3. Edge Desktop (Windows/Mac)

**Installation Steps**:
1. Open Microsoft Edge browser
2. Navigate to `https://localhost:8443`
3. Accept certificate warning
4. Look for install icon in address bar (⊕ icon)
5. Click the install icon OR click "Install App" button
6. Verify install prompt appears
7. Click "Install"

**Verification**:
- [ ] Install prompt appeared
- [ ] App installed successfully
- [ ] App opens in standalone window
- [ ] App icon appears in Start Menu/Applications
- [ ] App can be launched independently
- [ ] Address bar is hidden
- [ ] Theme color applied

**Uninstall** (for retesting):
- Click three dots in app window → Apps → Uninstall "Shri Pandit Ji"

---

### 4. Safari iOS (iPhone/iPad)

**Note**: Safari iOS uses "Add to Home Screen" instead of standard PWA install.

**Installation Steps**:
1. Open Safari on iOS device
2. Navigate to `https://[YOUR_IP]:8443`
3. Accept certificate warning
4. Tap Share button (square with arrow)
5. Scroll down and tap "Add to Home Screen"
6. Edit name if desired (default: "Shri Pandit Ji")
7. Tap "Add"

**Verification**:
- [ ] "Add to Home Screen" option available
- [ ] App icon added to home screen
- [ ] App launches when tapped
- [ ] App opens in standalone mode (no Safari UI)
- [ ] Status bar uses theme color
- [ ] App name displays correctly

**Limitations**:
- iOS Safari has limited service worker support
- Some offline features may not work fully
- No install prompt (manual "Add to Home Screen")

**Uninstall** (for retesting):
- Long press app icon → Remove App → Delete

---

### 5. Safari Desktop (Mac)

**Note**: Safari desktop has limited PWA support.

**Installation Steps**:
1. Open Safari on Mac
2. Navigate to `https://localhost:8443`
3. Accept certificate warning
4. Look for "Add to Dock" option in File menu or Share menu

**Verification**:
- [ ] Add to Dock option available (if supported)
- [ ] App can be added to Dock
- [ ] App launches in separate window

**Limitations**:
- Safari desktop has very limited PWA support
- May not support full installation
- Service worker support is limited
- Consider this browser as "best effort"

---

## Common Issues and Solutions

### Issue: Install prompt doesn't appear

**Possible Causes**:
1. PWA already installed
2. Installability criteria not met
3. Browser doesn't support PWA installation

**Solutions**:
- Check Chrome DevTools → Application → Manifest (should show no errors)
- Check Chrome DevTools → Application → Service Workers (should be registered)
- Uninstall existing app and try again
- Run Lighthouse audit to verify installability

### Issue: Certificate warning blocks installation

**Solution**:
- Accept the self-signed certificate warning
- For production, use a valid SSL certificate

### Issue: App doesn't launch in standalone mode

**Possible Causes**:
1. Manifest display mode not set to "standalone"
2. Browser doesn't support standalone mode

**Solutions**:
- Verify manifest.json has `"display": "standalone"`
- Check browser compatibility

### Issue: Icons don't display correctly

**Possible Causes**:
1. Icon files missing or incorrect paths
2. Icon sizes not supported

**Solutions**:
- Verify all icon files exist in /icons directory
- Check manifest.json icon paths are correct
- Ensure 192x192 and 512x512 icons are present

### Issue: Can't access app on mobile device

**Solution**:
- Ensure mobile device is on same network as development server
- Use computer's IP address instead of localhost
- Check firewall settings allow connections on port 8443

---

## Testing Results Template

Use this template to document your testing results:

### Chrome Desktop
- **OS**: ___________
- **Browser Version**: ___________
- **Install Prompt**: ✅ / ❌
- **Installation Success**: ✅ / ❌
- **Standalone Mode**: ✅ / ❌
- **Notes**: ___________

### Chrome Android
- **Device**: ___________
- **Android Version**: ___________
- **Browser Version**: ___________
- **Install Prompt**: ✅ / ❌
- **Installation Success**: ✅ / ❌
- **Standalone Mode**: ✅ / ❌
- **Home Screen Icon**: ✅ / ❌
- **Splash Screen**: ✅ / ❌
- **Notes**: ___________

### Edge Desktop
- **OS**: ___________
- **Browser Version**: ___________
- **Install Prompt**: ✅ / ❌
- **Installation Success**: ✅ / ❌
- **Standalone Mode**: ✅ / ❌
- **Notes**: ___________

### Safari iOS
- **Device**: ___________
- **iOS Version**: ___________
- **Add to Home Screen**: ✅ / ❌
- **Installation Success**: ✅ / ❌
- **Standalone Mode**: ✅ / ❌
- **Notes**: ___________

### Safari Desktop
- **macOS Version**: ___________
- **Browser Version**: ___________
- **Installation Available**: ✅ / ❌
- **Notes**: ___________

---

## Success Criteria

Task 16.4 is complete when:
- ✅ PWA installs successfully on Chrome Desktop
- ✅ PWA installs successfully on Chrome Android (or tested on equivalent)
- ✅ PWA installs successfully on Edge Desktop
- ✅ PWA can be added to home screen on Safari iOS (or tested on equivalent)
- ✅ Install prompt appears on supported browsers
- ✅ App launches in standalone mode (no browser UI)
- ✅ All installations documented in results template

---

## Next Steps

After completing browser installation testing:
1. Document any issues found
2. Fix critical installation issues
3. Proceed to Task 16.5 (Test offline functionality)
