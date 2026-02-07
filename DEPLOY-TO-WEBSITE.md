# Deploy PWA Files to shripanditji.in

## Current Situation

✅ Your website is live: https://shripanditji.in  
❌ PWA files are NOT deployed yet (manifest.json returns 404)  
✅ PWA files are ready in your local project  

**You need to upload the PWA files to your website before generating the APK.**

---

## Files That Need to Be Uploaded

### Required Files (Must Upload)

```
📁 Root Directory (public_html or www)
├── index.html (your PWA wrapper)
├── manifest.json
├── sw.min.js (service worker)
├── app.min.js
├── install-manager.min.js
├── cache-manager.min.js
├── styles.min.css
├── offline.html
│
├── 📁 icons/
│   ├── icon-16x16.svg
│   ├── icon-32x32.svg
│   ├── icon-48x48.svg
│   ├── icon-180x180.svg
│   ├── icon-192x192.svg
│   ├── icon-512x512.svg
│   ├── icon-192x192-maskable.svg
│   └── icon-512x512-maskable.svg
│
└── 📁 .well-known/
    └── assetlinks.json
```

---

## Deployment Options

### Option 1: Keep Existing Website + Add PWA Wrapper

If you want to keep your current website and just add PWA functionality:

**Upload these files to your root directory**:
- manifest.json
- sw.min.js
- All icon files (to /icons/ folder)
- .well-known/assetlinks.json

**Modify your existing index.html** to add:
```html
<!-- In <head> section -->
<link rel="manifest" href="/manifest.json">
<meta name="theme-color" content="#FF6B35">
<meta name="viewport" content="width=device-width, initial-scale=1">

<!-- Before </body> -->
<script src="/sw.min.js"></script>
```

### Option 2: Replace with PWA Wrapper (Recommended)

Replace your current website with the PWA wrapper we created:

**This will**:
- Show your website in an iframe
- Add PWA functionality
- Enable offline mode
- Allow APK generation

**Upload all files** from your local project to your website.

---

## Step-by-Step Deployment

### Step 1: Access Your Website's File Manager

**Method A: cPanel File Manager**
1. Log in to your hosting cPanel
2. Click "File Manager"
3. Navigate to public_html or www folder

**Method B: FTP Client (FileZilla)**
1. Download FileZilla: https://filezilla-project.org/
2. Connect to your server:
   - Host: ftp.shripanditji.in (or your FTP host)
   - Username: Your FTP username
   - Password: Your FTP password
   - Port: 21
3. Navigate to public_html or www folder

**Method C: SSH/SFTP**
1. Use WinSCP (Windows) or Terminal (Mac/Linux)
2. Connect to your server
3. Navigate to web root

### Step 2: Backup Current Website

**Important**: Always backup before making changes!

1. Download your current website files
2. Save them in a safe location
3. You can restore if needed

### Step 3: Upload PWA Files

**Upload these files from your local project**:

```
From your project folder → To website root:

index.html → /index.html
manifest.json → /manifest.json
sw.min.js → /sw.min.js
app.min.js → /app.min.js
install-manager.min.js → /install-manager.min.js
cache-manager.min.js → /cache-manager.min.js
styles.min.css → /styles.min.css
offline.html → /offline.html

icons/ folder → /icons/ folder (create if doesn't exist)
  - All 8 icon files

.well-known/ folder → /.well-known/ folder (create if doesn't exist)
  - assetlinks.json
```

### Step 4: Set Correct Permissions

**For files**: 644 (rw-r--r--)  
**For folders**: 755 (rwxr-xr-x)

In cPanel File Manager:
1. Right-click file/folder
2. Select "Change Permissions"
3. Set to 644 for files, 755 for folders

### Step 5: Verify Upload

**Check these URLs in your browser**:

1. **Manifest**: https://shripanditji.in/manifest.json
   - Should return JSON
   - Should NOT return 404

2. **Service Worker**: https://shripanditji.in/sw.min.js
   - Should return JavaScript code
   - Should NOT return 404

3. **Icons**: https://shripanditji.in/icons/icon-192x192.svg
   - Should display icon
   - Should NOT return 404

4. **Main Page**: https://shripanditji.in
   - Should load your PWA
   - Should show your website content

5. **Asset Links**: https://shripanditji.in/.well-known/assetlinks.json
   - Should return JSON
   - Should NOT return 404

---

## Important: Update index.html

Your current index.html needs to load your existing website. Update the iframe src:

```html
<iframe 
  id="content-frame" 
  src="https://shripanditji.in/" 
  title="Shri Pandit Ji Website"
  loading="eager">
</iframe>
```

**If your website is in a subfolder**, update the src:
```html
src="https://shripanditji.in/your-subfolder/"
```

**Or if you want to keep the original site separate**:
```html
src="https://shripanditji.in/original-site/"
```

---

## Verification Checklist

After uploading, verify:

### ✅ Files Accessible
- [ ] https://shripanditji.in/manifest.json returns JSON
- [ ] https://shripanditji.in/sw.min.js returns JavaScript
- [ ] https://shripanditji.in/icons/icon-192x192.svg shows icon
- [ ] https://shripanditji.in/.well-known/assetlinks.json returns JSON

### ✅ PWA Functionality
- [ ] Open https://shripanditji.in in Chrome
- [ ] Open DevTools (F12)
- [ ] Go to Application tab
- [ ] Check "Manifest" - should show no errors
- [ ] Check "Service Workers" - should show registered worker
- [ ] Check "Cache Storage" - should show cached files

### ✅ Lighthouse Audit
- [ ] Open Chrome DevTools
- [ ] Go to Lighthouse tab
- [ ] Run PWA audit
- [ ] Score should be ≥ 90%

---

## After Deployment: Generate APK

Once all files are uploaded and verified:

### Step 1: Go to PWA Builder
```
https://www.pwabuilder.com/
```

### Step 2: Enter Your URL
```
https://shripanditji.in
```

### Step 3: Generate APK
Follow the steps in `GENERATE-APK-NOW.md`

---

## Troubleshooting

### Issue: manifest.json returns 404

**Solutions**:
- Verify file is uploaded to root directory
- Check file name is exactly "manifest.json" (lowercase)
- Check file permissions (should be 644)
- Clear browser cache and try again

### Issue: Service worker not registering

**Solutions**:
- Verify sw.min.js is uploaded
- Check browser console for errors
- Ensure HTTPS is enabled (not HTTP)
- Check file permissions

### Issue: Icons not loading

**Solutions**:
- Verify icons folder exists in root
- Check all 8 icon files are uploaded
- Verify file paths in manifest.json match uploaded files
- Check file permissions

### Issue: .well-known folder not accessible

**Solutions**:
- Some servers block .well-known by default
- Add this to .htaccess:
  ```apache
  <IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteRule ^\.well-known/ - [L]
  </IfModule>
  ```
- Or contact your hosting provider

---

## Quick Upload Guide (cPanel)

### 1. Login to cPanel
- Go to your hosting control panel
- Login with your credentials

### 2. Open File Manager
- Click "File Manager" icon
- Navigate to public_html or www

### 3. Upload Files
- Click "Upload" button
- Select all PWA files from your computer
- Wait for upload to complete

### 4. Create Folders
- Click "New Folder" button
- Create "icons" folder
- Create ".well-known" folder

### 5. Upload to Folders
- Open icons folder
- Upload all icon files
- Open .well-known folder
- Upload assetlinks.json

### 6. Verify
- Visit https://shripanditji.in/manifest.json
- Should see JSON content

---

## Alternative: Use Subdomain for PWA

If you want to keep your main website unchanged:

### Option: Create app.shripanditji.in

1. **Create subdomain** in cPanel:
   - Go to "Subdomains"
   - Create: app.shripanditji.in
   - Document root: /public_html/app

2. **Upload PWA files** to subdomain folder

3. **Generate APK** using:
   ```
   https://app.shripanditji.in
   ```

4. **Benefits**:
   - Main website unchanged
   - PWA separate
   - Easy to manage

---

## Summary

**Before generating APK, you must**:

1. ✅ Upload all PWA files to https://shripanditji.in
2. ✅ Verify manifest.json is accessible
3. ✅ Verify service worker is accessible
4. ✅ Verify icons are accessible
5. ✅ Test PWA functionality in browser
6. ✅ Run Lighthouse audit (score ≥ 90%)

**Then you can**:
1. ✅ Go to PWA Builder
2. ✅ Generate APK
3. ✅ Download and install

**Total time**: 
- Upload files: 10-15 minutes
- Generate APK: 5 minutes
- Install: 2 minutes

---

## Need Help with Deployment?

If you need help uploading files:

1. **Contact your hosting provider** - they can help
2. **Hire a developer** - quick task, should be inexpensive
3. **Use FTP client** - FileZilla is free and easy
4. **Use cPanel** - most hosting has this

Once files are uploaded, generating the APK is easy!

---

## Next Steps

1. **Upload PWA files** to your website (follow this guide)
2. **Verify files** are accessible (check URLs)
3. **Test PWA** in browser (Chrome DevTools)
4. **Generate APK** (follow GENERATE-APK-NOW.md)
5. **Install and test** on Android device

Good luck! 🚀
