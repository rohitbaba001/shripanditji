# APK Generation Guide - Shri Pandit Ji PWA

## Overview

This guide provides step-by-step instructions for converting your PWA into an Android APK that can be downloaded and installed on Android devices.

**Two Methods Available**:
1. **PWA Builder** (Recommended - Easiest, No coding required)
2. **Bubblewrap CLI** (Advanced - More control)

---

## Prerequisites

Before generating the APK, ensure:

- ✅ PWA is deployed to a **public HTTPS URL** (e.g., https://shripanditji.in)
- ✅ Lighthouse PWA score ≥ 90%
- ✅ Service worker is registered and working
- ✅ Web app manifest is valid
- ✅ All icons are present (192x192, 512x512)
- ✅ assetlinks.json is configured

**IMPORTANT**: You **cannot** generate an APK from localhost. You must deploy your PWA to a public HTTPS domain first.

---

## Method 1: PWA Builder (Recommended)

PWA Builder is the easiest way to generate an APK. It's a free online tool that converts your PWA into an Android app.

### Step 1: Deploy Your PWA

1. **Choose a hosting provider**:
   - GitHub Pages (free)
   - Netlify (free)
   - Vercel (free)
   - Your own web server

2. **Upload your PWA files**:
   - All HTML, CSS, JS files
   - manifest.json
   - sw.min.js (service worker)
   - All icons
   - .well-known/assetlinks.json

3. **Verify deployment**:
   - Visit your deployed URL (e.g., https://shripanditji.in)
   - Verify PWA loads correctly
   - Check service worker registers
   - Test offline functionality

### Step 2: Use PWA Builder

1. **Go to PWA Builder**:
   - Visit: https://www.pwabuilder.com/

2. **Enter your PWA URL**:
   - Enter your deployed URL (e.g., https://shripanditji.in)
   - Click "Start"

3. **Review PWA Score**:
   - PWA Builder will analyze your PWA
   - Review the score and any issues
   - Fix any critical issues before proceeding

4. **Generate Android Package**:
   - Click on "Android" platform
   - Click "Generate Package"

### Step 3: Configure Android App Settings

PWA Builder will ask you to configure:

1. **Package ID** (required):
   - Format: `com.yourcompany.appname`
   - Example: `com.shripanditji.app`
   - Must be unique (used in Google Play Store)

2. **App Name** (required):
   - Display name: "Shri Pandit Ji"
   - Already set from manifest.json

3. **App Version** (required):
   - Version code: 1 (increment for updates)
   - Version name: "1.0.0"

4. **Host URL** (required):
   - Your PWA URL: https://shripanditji.in
   - Must match deployed URL

5. **Start URL** (required):
   - Usually: `/` or `/index.html`
   - Already set from manifest.json

6. **Theme Color** (optional):
   - Already set from manifest.json: #FF6B35

7. **Background Color** (optional):
   - Already set from manifest.json: #FFFFFF

8. **Display Mode** (optional):
   - Already set from manifest.json: standalone

9. **Orientation** (optional):
   - Already set from manifest.json: portrait

### Step 4: Signing Options

PWA Builder offers two signing options:

#### Option A: Use PWA Builder's Signing Key (Easiest)

- PWA Builder generates and manages the signing key
- **Pros**: No setup required, instant download
- **Cons**: You don't own the signing key, can't publish updates independently

**Steps**:
1. Select "Use PWA Builder signing"
2. Click "Generate"
3. Download the APK

#### Option B: Use Your Own Signing Key (Recommended for Production)

- You generate and manage your own signing key
- **Pros**: You own the key, can publish to Google Play Store
- **Cons**: Requires additional setup

**Steps**:
1. Generate a signing key (see "Generating Signing Key" section below)
2. Upload your signing key to PWA Builder
3. Click "Generate"
4. Download the APK

### Step 5: Download APK

1. **Wait for generation** (usually 1-2 minutes)
2. **Download the APK file**:
   - File name: `app-release-signed.apk`
   - Size: Usually 1-5 MB

3. **Download the signing key** (if you used PWA Builder's signing):
   - Save this file securely
   - You'll need it for future updates

### Step 6: Configure Asset Links (Digital Asset Links)

For TWA (Trusted Web Activity) verification:

1. **Get your app's SHA-256 fingerprint**:
   - PWA Builder provides this after generation
   - Or extract from signing key (see below)

2. **Update assetlinks.json**:
   ```json
   [
     {
       "relation": ["delegate_permission/common.handle_all_urls"],
       "target": {
         "namespace": "android_app",
         "package_name": "com.shripanditji.app",
         "sha256_cert_fingerprints": [
           "YOUR_SHA256_FINGERPRINT_HERE"
         ]
       }
     }
   ]
   ```

3. **Deploy assetlinks.json**:
   - Upload to: `https://shripanditji.in/.well-known/assetlinks.json`
   - Verify accessible: Visit the URL in browser
   - Must be publicly accessible (no authentication)

### Step 7: Test the APK

1. **Transfer APK to Android device**:
   - Email to yourself
   - Upload to Google Drive
   - Use USB cable (ADB)

2. **Enable "Install from Unknown Sources"**:
   - Settings → Security → Unknown Sources → Enable
   - Or Settings → Apps → Special Access → Install Unknown Apps

3. **Install the APK**:
   - Open the APK file on your device
   - Tap "Install"
   - Wait for installation to complete

4. **Test the app**:
   - Launch the app from app drawer
   - Verify it opens in full-screen (no browser UI)
   - Test offline functionality
   - Test all features

---

## Method 2: Bubblewrap CLI (Advanced)

Bubblewrap is a command-line tool for generating Android APKs from PWAs.

### Prerequisites

- Node.js installed (v14 or higher)
- Java Development Kit (JDK) 8 or higher
- Android SDK (optional, Bubblewrap can download it)

### Step 1: Install Bubblewrap

```bash
npm install -g @bubblewrap/cli
```

Verify installation:
```bash
bubblewrap --version
```

### Step 2: Initialize Project

```bash
bubblewrap init --manifest https://shripanditji.in/manifest.json
```

Bubblewrap will ask you to configure:

1. **Package ID**: `com.shripanditji.app`
2. **App Name**: Shri Pandit Ji (from manifest)
3. **Host URL**: https://shripanditji.in
4. **Start URL**: / (from manifest)
5. **Theme Color**: #FF6B35 (from manifest)
6. **Background Color**: #FFFFFF (from manifest)
7. **Display Mode**: standalone (from manifest)
8. **Orientation**: portrait (from manifest)
9. **Icon URL**: https://shripanditji.in/icons/icon-512x512.svg
10. **Maskable Icon URL**: https://shripanditji.in/icons/icon-512x512-maskable.svg

This creates a `twa-manifest.json` file with your configuration.

### Step 3: Generate Signing Key

If you don't have a signing key:

```bash
bubblewrap keygen
```

This generates:
- `android.keystore` - Your signing key
- Key password (save this securely!)

**IMPORTANT**: Keep your signing key and password secure. You'll need them for all future updates.

### Step 4: Build APK

```bash
bubblewrap build
```

This will:
1. Download Android SDK (if needed)
2. Generate Android project
3. Build the APK
4. Sign the APK

Build output: `app-release-signed.apk`

### Step 5: Get SHA-256 Fingerprint

Extract the SHA-256 fingerprint from your signing key:

```bash
keytool -list -v -keystore android.keystore -alias android
```

Enter your keystore password when prompted.

Look for the SHA-256 fingerprint in the output:
```
Certificate fingerprints:
  SHA256: AA:BB:CC:DD:EE:FF:00:11:22:33:44:55:66:77:88:99:AA:BB:CC:DD:EE:FF:00:11:22:33:44:55:66:77:88:99
```

### Step 6: Update assetlinks.json

Update your assetlinks.json with the SHA-256 fingerprint:

```json
[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "com.shripanditji.app",
      "sha256_cert_fingerprints": [
        "AA:BB:CC:DD:EE:FF:00:11:22:33:44:55:66:77:88:99:AA:BB:CC:DD:EE:FF:00:11:22:33:44:55:66:77:88:99"
      ]
    }
  }
]
```

Deploy to: `https://shripanditji.in/.well-known/assetlinks.json`

### Step 7: Test the APK

Same as Method 1, Step 7.

---

## Generating Your Own Signing Key (Manual Method)

If you want to generate a signing key manually:

### Using keytool (Java)

```bash
keytool -genkey -v -keystore android.keystore -alias android -keyalg RSA -keysize 2048 -validity 10000
```

You'll be prompted for:
- Keystore password (create a strong password)
- Key password (can be same as keystore password)
- Your name
- Organization
- City, State, Country

**IMPORTANT**: 
- Save the keystore file (`android.keystore`) securely
- Save the passwords securely
- You'll need these for all future app updates
- If you lose them, you cannot update your app in Google Play Store

---

## Deploying assetlinks.json

The assetlinks.json file is required for TWA verification. It proves you own both the website and the Android app.

### File Location

Must be at: `https://yourdomain.com/.well-known/assetlinks.json`

For Shri Pandit Ji: `https://shripanditji.in/.well-known/assetlinks.json`

### File Content

```json
[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "com.shripanditji.app",
      "sha256_cert_fingerprints": [
        "YOUR_SHA256_FINGERPRINT_HERE"
      ]
    }
  }
]
```

### Deployment Steps

1. **Create .well-known directory** in your web root
2. **Create assetlinks.json** file
3. **Upload to server**
4. **Verify accessibility**:
   - Visit: https://shripanditji.in/.well-known/assetlinks.json
   - Should return JSON (not 404)
   - Should have correct MIME type: `application/json`

### Verification

Test your assetlinks.json:
- Visit: https://digitalassetlinks.googleapis.com/v1/statements:list?source.web.site=https://shripanditji.in&relation=delegate_permission/common.handle_all_urls

Should return your assetlinks configuration.

---

## Testing Checklist for APK

After generating the APK, test thoroughly:

### Installation Testing
- [ ] APK installs successfully on Android device
- [ ] App icon appears in app drawer
- [ ] App name displays correctly ("Shri Pandit Ji")

### Launch Testing
- [ ] App launches from app drawer
- [ ] App opens in full-screen (no browser UI)
- [ ] Splash screen displays (if configured)
- [ ] Theme color applied to status bar

### Functionality Testing
- [ ] All pages load correctly
- [ ] Navigation works
- [ ] Forms work (if any)
- [ ] Images load
- [ ] External links work

### Offline Testing
- [ ] Enable airplane mode
- [ ] Launch app - should work
- [ ] Navigate to cached pages - should work
- [ ] Uncached pages show offline fallback

### TWA Verification Testing
- [ ] No browser address bar visible
- [ ] No browser UI elements
- [ ] App feels like native app
- [ ] assetlinks.json verification successful

### Performance Testing
- [ ] App loads quickly
- [ ] Smooth scrolling
- [ ] No lag or freezing
- [ ] Reasonable battery usage

### Update Testing
- [ ] Increment version code
- [ ] Rebuild APK
- [ ] Install over existing app
- [ ] Verify update works without data loss

---

## Publishing to Google Play Store (Optional)

Once your APK is tested and working:

### Step 1: Create Google Play Developer Account

1. Go to: https://play.google.com/console
2. Sign in with Google account
3. Pay one-time registration fee ($25 USD)
4. Complete account setup

### Step 2: Create App Listing

1. Click "Create app"
2. Enter app details:
   - App name: "Shri Pandit Ji"
   - Default language: English
   - App type: App
   - Free or Paid: Free

3. Complete store listing:
   - Short description (80 chars)
   - Full description (4000 chars)
   - Screenshots (at least 2)
   - Feature graphic (1024x500)
   - App icon (512x512)
   - Category: Lifestyle or Religion & Spirituality
   - Content rating questionnaire
   - Privacy policy URL

### Step 3: Upload APK

1. Go to "Release" → "Production"
2. Click "Create new release"
3. Upload your signed APK
4. Add release notes
5. Review and rollout

### Step 4: Review Process

- Google reviews your app (usually 1-7 days)
- Fix any issues if rejected
- Once approved, app goes live

---

## Troubleshooting

### Issue: PWA Builder says "Not a valid PWA"

**Solutions**:
- Run Lighthouse audit, ensure score ≥ 90%
- Verify manifest.json is valid
- Verify service worker is registered
- Ensure HTTPS is enabled

### Issue: APK won't install on device

**Solutions**:
- Enable "Install from Unknown Sources"
- Check APK is not corrupted (re-download)
- Ensure device has enough storage
- Try different device

### Issue: App shows browser UI (address bar visible)

**Cause**: TWA verification failed

**Solutions**:
- Verify assetlinks.json is deployed correctly
- Verify SHA-256 fingerprint matches
- Verify package name matches
- Wait 24-48 hours for verification to propagate

### Issue: App doesn't work offline

**Solutions**:
- Verify service worker is registered
- Check cache strategies are working
- Test PWA in browser first
- Check console for errors

### Issue: "App not installed" error

**Solutions**:
- Uninstall any existing version
- Clear app data and cache
- Restart device
- Re-download APK

### Issue: Can't update app (signature mismatch)

**Cause**: Using different signing key

**Solutions**:
- Use the same signing key for updates
- If key is lost, users must uninstall and reinstall
- For Play Store, you cannot change signing key

---

## Quick Start Summary

### For Quick Testing (PWA Builder Method)

1. **Deploy PWA** to public HTTPS URL
2. **Go to** https://www.pwabuilder.com/
3. **Enter** your PWA URL
4. **Click** "Generate Package" for Android
5. **Configure** package ID: `com.shripanditji.app`
6. **Download** APK
7. **Install** on Android device
8. **Test** thoroughly

### For Production (Bubblewrap Method)

1. **Deploy PWA** to public HTTPS URL
2. **Install Bubblewrap**: `npm install -g @bubblewrap/cli`
3. **Initialize**: `bubblewrap init --manifest https://shripanditji.in/manifest.json`
4. **Generate key**: `bubblewrap keygen`
5. **Build APK**: `bubblewrap build`
6. **Get fingerprint**: `keytool -list -v -keystore android.keystore`
7. **Update assetlinks.json** with fingerprint
8. **Deploy assetlinks.json** to /.well-known/
9. **Test APK** on device
10. **Publish** to Google Play Store (optional)

---

## Important Notes

### About Localhost

- **Cannot generate APK from localhost**
- Must deploy to public HTTPS URL first
- Use free hosting: GitHub Pages, Netlify, Vercel

### About Signing Keys

- **Keep signing key secure**
- **Backup signing key** (multiple locations)
- **Never share** signing key
- **Same key required** for all updates
- **Lost key = cannot update app**

### About assetlinks.json

- **Required for TWA** (no browser UI)
- **Must be publicly accessible**
- **Must match package name** and fingerprint
- **Verification takes time** (up to 48 hours)

### About Updates

- **Increment version code** for each update
- **Use same signing key**
- **Test update** before publishing
- **Users get updates** from Play Store automatically

---

## Support Resources

### PWA Builder
- Website: https://www.pwabuilder.com/
- Documentation: https://docs.pwabuilder.com/
- GitHub: https://github.com/pwa-builder

### Bubblewrap
- GitHub: https://github.com/GoogleChromeLabs/bubblewrap
- Documentation: https://github.com/GoogleChromeLabs/bubblewrap/tree/main/packages/cli

### Google Play Console
- Console: https://play.google.com/console
- Help Center: https://support.google.com/googleplay/android-developer

### Digital Asset Links
- Documentation: https://developers.google.com/digital-asset-links
- Testing Tool: https://developers.google.com/digital-asset-links/tools/generator

---

## Conclusion

You now have two methods to generate an Android APK from your PWA:

1. **PWA Builder** - Easy, web-based, no coding required
2. **Bubblewrap CLI** - Advanced, more control, command-line based

Choose the method that best fits your needs and technical expertise.

**Remember**: You must deploy your PWA to a public HTTPS URL before generating the APK!

---

**Next Steps**:
1. Deploy your PWA to a public HTTPS domain
2. Choose your APK generation method
3. Follow the step-by-step instructions
4. Test the APK thoroughly
5. Publish to Google Play Store (optional)

Good luck with your APK generation! 🚀
