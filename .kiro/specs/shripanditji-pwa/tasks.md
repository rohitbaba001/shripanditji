# Implementation Plan: Shri Pandit Ji PWA

## Overview

This implementation plan breaks down the PWA development into discrete, incremental steps. Each task builds on previous work, with testing integrated throughout to catch issues early. The implementation follows the App Shell architecture pattern with service worker-based offline functionality.

## Tasks

- [x] 1. Set up project structure and development environment
  - Create project directory structure (root, assets, icons, etc.)
  - Set up package.json with required dependencies (fast-check for testing)
  - Configure HTTPS development server (required for service workers)
  - Create .gitignore for node_modules and build artifacts
  - _Requirements: 10.5_

- [x] 2. Create Web App Manifest
  - [x] 2.1 Create manifest.json with all required fields
    - Add name: "Shri Pandit Ji"
    - Add short_name: "Pandit Ji" (max 12 chars)
    - Add description
    - Add start_url: "/"
    - Add scope: "/"
    - Add display: "standalone"
    - Add orientation: "portrait"
    - Add theme_color and background_color (use website branding colors)
    - Add icons array (will populate in next task)
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.10_
  
  - [ ]* 2.2 Write unit tests for manifest validation
    - Test manifest.json is valid JSON
    - Test all required fields are present
    - Test short_name length ≤ 12 characters
    - Test display mode is "standalone"
    - Test orientation is "portrait"
    - Test colors are valid hex codes
    - _Requirements: 1.1, 1.2, 1.3, 1.7_

- [x] 3. Generate and configure app icons
  - [x] 3.1 Create app icons in multiple sizes
    - Generate 192x192 icon for standard displays
    - Generate 512x512 icon for high-resolution displays
    - Generate maskable versions of both sizes
    - Generate favicons (16x16, 32x32, 48x48)
    - Generate Apple touch icon (180x180)
    - Save all icons to /icons directory
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_
  
  - [x] 3.2 Update manifest.json with icon references
    - Add 192x192 icon with purpose "any"
    - Add 512x512 icon with purpose "any"
    - Add 192x192 maskable icon with purpose "maskable"
    - Add 512x512 maskable icon with purpose "maskable"
    - _Requirements: 1.9, 2.3_
  
  - [ ]* 3.3 Write unit tests for icon configuration
    - Test icon files exist at specified paths
    - Test manifest references correct icon sizes
    - Test maskable icons are included
    - _Requirements: 1.9, 2.1, 2.2, 2.3_

- [x] 4. Create app shell HTML structure
  - [x] 4.1 Create index.html with mobile optimization
    - Add DOCTYPE and html lang attribute
    - Add viewport meta tag: width=device-width, initial-scale=1
    - Add theme-color meta tag matching manifest
    - Add apple-mobile-web-app-capable meta tag
    - Add apple-mobile-web-app-status-bar-style meta tag
    - Link to manifest.json
    - Link to favicon and Apple touch icon
    - Add app shell HTML structure (header, main, footer)
    - Add iframe or content wrapper for shripanditji.in website
    - Add install button UI element (initially hidden)
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 5.3_
  
  - [ ]* 4.2 Write unit tests for HTML meta tags
    - Test viewport meta tag exists with correct content
    - Test theme-color meta tag exists
    - Test Apple meta tags exist
    - Test manifest link exists
    - Test icon links exist
    - _Requirements: 6.1, 6.2, 6.3, 6.4_
  
  - [ ]* 4.3 Write property test for touch target sizes
    - **Property 8: Touch Target Minimum Size**
    - Generate random interactive elements
    - Measure computed dimensions
    - Verify all meet 44x44 pixel minimum
    - **Validates: Requirements 6.6**

- [x] 5. Implement app shell CSS
  - [x] 5.1 Create styles.css with responsive design
    - Add CSS reset/normalize
    - Implement mobile-first responsive layout
    - Style app shell components (header, main, footer)
    - Ensure touch targets are minimum 44x44 pixels
    - Add CSS to prevent horizontal scrolling (overflow-x: hidden)
    - Add text-size-adjust: none for mobile
    - Inline critical CSS in HTML head for fast rendering
    - _Requirements: 6.5, 6.6, 6.7, 6.8, 9.6_
  
  - [ ]* 5.2 Write unit tests for CSS properties
    - Test overflow-x is hidden on body
    - Test text-size-adjust is set
    - Test critical CSS is inlined
    - _Requirements: 6.7, 6.8, 9.6_

- [x] 6. Create offline fallback page
  - [x] 6.1 Create offline.html
    - Add app branding and logo
    - Add clear "You are offline" message
    - Add list element for cached pages (populated by JS)
    - Add retry button
    - Include minimal inline CSS (must be cached)
    - _Requirements: 4.1, 4.2, 4.3, 4.4_
  
  - [ ]* 6.2 Write unit tests for offline page
    - Test offline.html exists
    - Test page contains branding elements
    - Test page contains offline message
    - Test page contains cached pages list element
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [x] 7. Checkpoint - Verify static assets
  - Ensure all HTML, CSS, and icon files are created
  - Verify manifest.json is valid JSON
  - Test pages load correctly in browser
  - Ask the user if questions arise

- [x] 8. Implement Cache Manager
  - [x] 8.1 Create cache-manager.js module
    - Implement CacheManager class
    - Add getCacheName() method with version prefix
    - Add addToCache() method to add resources to cache
    - Add cleanOldCaches() method to remove old versions
    - Add enforceCacheLimits() method with FIFO eviction
    - Add clearExpiredEntries() method
    - Set maxCacheSize = 50 entries
    - Set maxCacheAge = 7 days
    - _Requirements: 3.7, 7.4, 7.5, 7.6_
  
  - [ ]* 8.2 Write unit tests for Cache Manager
    - Test getCacheName() includes version
    - Test addToCache() adds resources successfully
    - Test cleanOldCaches() removes old versions
    - _Requirements: 3.7_
  
  - [ ]* 8.3 Write property test for cache size limits
    - **Property 5: Cache Size Limit Enforcement**
    - Generate random number of cache entries (including over limit)
    - Add entries to cache
    - Verify cache never exceeds configured limit
    - **Validates: Requirements 7.5**
  
  - [ ]* 8.4 Write property test for FIFO eviction
    - **Property 6: FIFO Cache Eviction Policy**
    - Generate random cache entries with timestamps
    - Fill cache to limit
    - Add new entry
    - Verify oldest entry was removed
    - **Validates: Requirements 7.6**

- [x] 9. Implement Service Worker with caching strategies
  - [x] 9.1 Create sw.js with install event handler
    - Define CACHE_VERSION constant
    - Define APP_SHELL_CACHE array with static assets
    - Implement install event listener
    - Cache app shell resources on install
    - Cache offline.html
    - Call skipWaiting() after caching
    - _Requirements: 3.1, 3.3_
  
  - [x] 9.2 Implement activate event handler
    - Implement activate event listener
    - Clean up old cache versions (keep only current)
    - Call clients.claim() to take control immediately
    - _Requirements: 3.7_
  
  - [x] 9.3 Implement fetch event handler with routing
    - Implement fetch event listener
    - Route requests based on resource type:
      - Static assets (CSS, JS, fonts) → cacheFirst()
      - HTML pages → networkFirst()
      - Images → staleWhileRevalidate()
    - Implement offline fallback for failed requests
    - _Requirements: 3.2, 3.4, 3.5, 7.1, 7.2, 7.3_
  
  - [x] 9.4 Implement cacheFirst strategy function
    - Check cache for request
    - Return cached response if found
    - Fetch from network if not cached
    - Update cache with network response
    - _Requirements: 3.4, 7.1_
  
  - [x] 9.5 Implement networkFirst strategy function
    - Attempt network fetch with timeout (10 seconds)
    - Update cache with successful response
    - Return network response
    - On failure, serve from cache
    - If not in cache, serve offline.html
    - _Requirements: 7.2, 3.5_
  
  - [x] 9.6 Implement staleWhileRevalidate strategy function
    - Check cache for request
    - If cached, return cached response immediately
    - Simultaneously fetch from network in background
    - Update cache with fresh response
    - If not cached, fetch from network
    - _Requirements: 7.3_
  
  - [ ]* 9.7 Write unit tests for service worker
    - Test install event caches app shell
    - Test activate event cleans old caches
    - Test fetch event routes to correct strategy
    - Test offline fallback is served when appropriate
    - _Requirements: 3.1, 3.3, 3.7, 3.5_
  
  - [ ]* 9.8 Write property test for cache-first strategy
    - **Property 1: Cache-First Strategy for Static Assets**
    - Generate random static asset URLs
    - Add them to cache with mock responses
    - Verify service worker serves from cache without network access
    - **Validates: Requirements 3.4, 7.1**
  
  - [ ]* 9.9 Write property test for offline fallback
    - **Property 2: Offline Fallback for Uncached Resources**
    - Generate random uncached URLs
    - Simulate offline network condition
    - Verify offline fallback page is returned
    - **Validates: Requirements 3.5**
  
  - [ ]* 9.10 Write property test for network-first strategy
    - **Property 3: Network-First Strategy for HTML Pages**
    - Generate random HTML page URLs
    - Verify network is attempted before cache
    - Verify cache is used only on network failure
    - **Validates: Requirements 7.2**
  
  - [ ]* 9.11 Write property test for stale-while-revalidate
    - **Property 4: Stale-While-Revalidate Strategy for Images**
    - Generate random image URLs
    - Verify cached version served immediately
    - Verify network fetch happens in background
    - **Validates: Requirements 7.3**

- [x] 10. Checkpoint - Test service worker functionality
  - Register service worker in browser
  - Verify app shell is cached
  - Test offline functionality (go offline, reload page)
  - Verify offline.html is displayed for uncached pages
  - Ensure all tests pass
  - Ask the user if questions arise

- [x] 11. Implement Install Manager
  - [x] 11.1 Create install-manager.js module
    - Implement InstallManager class
    - Add init() method to set up event listeners
    - Listen for beforeinstallprompt event and store it
    - Listen for appinstalled event for tracking
    - Add showInstallButton() method
    - Add hideInstallButton() method
    - Add promptInstall() method to trigger install prompt
    - Add trackInstallation() method to log outcome
    - _Requirements: 5.2, 5.3, 5.4, 5.5, 5.6_
  
  - [ ]* 11.2 Write unit tests for Install Manager
    - Test init() sets up event listeners
    - Test showInstallButton() displays button
    - Test hideInstallButton() hides button
    - Test promptInstall() calls prompt() on deferred event
    - Test trackInstallation() logs outcome
    - _Requirements: 5.2, 5.3, 5.4, 5.5, 5.6_

- [x] 12. Implement service worker registration and install UI
  - [x] 12.1 Create app.js with service worker registration
    - Check if 'serviceWorker' in navigator
    - Register /sw.js on page load
    - Handle registration success and failure
    - Check for service worker updates
    - Initialize InstallManager
    - Set up install button click handler
    - _Requirements: 3.1, 5.2, 5.4_
  
  - [ ]* 12.2 Write unit tests for app initialization
    - Test service worker registration is attempted
    - Test registration success is handled
    - Test registration failure is handled
    - Test InstallManager is initialized
    - _Requirements: 3.1, 10.6_

- [x] 13. Optimize assets for performance
  - [x] 13.1 Optimize images
    - Compress all images to appropriate sizes
    - Convert images to WebP format with PNG/JPG fallbacks
    - Add loading="lazy" to images below the fold
    - _Requirements: 9.2, 9.4, 9.5_
  
  - [x] 13.2 Minify CSS and JavaScript
    - Minify styles.css
    - Minify all JavaScript files
    - _Requirements: 9.3_
  
  - [x] 13.3 Optimize JavaScript loading
    - Add defer attribute to non-critical script tags
    - Ensure critical JS is inline or loaded synchronously
    - _Requirements: 9.7_
  
  - [ ]* 13.4 Write property test for image optimization
    - **Property 9: Image File Size Optimization**
    - Generate random image files
    - Check file sizes
    - Verify all are below threshold for their dimensions
    - **Validates: Requirements 9.4**
  
  - [ ]* 13.5 Write unit tests for asset optimization
    - Test CSS files are minified (no unnecessary whitespace)
    - Test JS files are minified
    - Test images have lazy loading attribute
    - Test scripts have defer attribute
    - _Requirements: 9.2, 9.3, 9.7_

- [x] 14. Configure for APK generation
  - [x] 14.1 Create assetlinks.json for TWA verification
    - Create .well-known directory
    - Create assetlinks.json with TWA configuration
    - Add relation: delegate_permission/common.handle_all_urls
    - Add target with android_app namespace
    - Add placeholder for package_name (to be filled during APK generation)
    - Add placeholder for sha256_cert_fingerprints
    - _Requirements: 8.6_
  
  - [x] 14.2 Verify HTTPS-only resources
    - Audit all URLs in manifest.json
    - Audit all URLs in HTML files
    - Audit all URLs in service worker
    - Ensure all use https:// protocol
    - _Requirements: 8.3, 8.4_
  
  - [ ]* 14.3 Write property test for HTTPS-only resources
    - **Property 7: HTTPS-Only Resources**
    - Generate random resource URLs from manifest and HTML
    - Verify all URLs use HTTPS protocol
    - Verify no mixed content
    - **Validates: Requirements 8.4**
  
  - [ ]* 14.4 Write unit tests for APK compatibility
    - Test assetlinks.json exists and is valid JSON
    - Test manifest includes all PWA Builder required fields
    - Test all resource URLs use HTTPS
    - _Requirements: 8.2, 8.3, 8.6_

- [x] 15. Create APK generation documentation
  - [x] 15.1 Create APK-GENERATION.md with instructions
    - Document PWA Builder method (https://www.pwabuilder.com/)
    - Document Bubblewrap CLI method
    - Include step-by-step instructions for both methods
    - Document how to configure package name
    - Document how to generate signing key
    - Document how to update assetlinks.json with certificate fingerprint
    - Document how to deploy assetlinks.json to /.well-known/
    - Include testing checklist for APK
    - _Requirements: 8.7_

- [x] 16. Final testing and validation
  - [x] 16.1 Run all unit tests

    - Execute test suite
    - Verify all tests pass
    - Fix any failing tests
  
  - [ ]* 16.2 Run all property tests
    - Execute property test suite with 100 iterations each
    - Verify all properties hold
    - Fix any failing properties
  
  - [x] 16.3 Run Lighthouse PWA audit
    - Run Lighthouse in Chrome DevTools
    - Verify PWA score ≥ 90%
    - Address any failing criteria
    - _Requirements: 8.5, 10.1_
  
  - [x] 16.4 Test installation across browsers
    - Test installation on Chrome (desktop and Android)
    - Test installation on Edge (desktop)
    - Test installation on Safari (iOS and desktop)
    - Verify install prompt appears
    - Verify app installs successfully
    - Verify app launches in standalone mode
    - _Requirements: 5.1, 10.2_
  
  - [x] 16.5 Test offline functionality
    - Load app while online
    - Go offline (disable network in DevTools)
    - Navigate to cached pages - should work
    - Navigate to uncached pages - should show offline.html
    - Go back online - should fetch fresh content
    - _Requirements: 10.3_
  
  - [x] 16.6 Test responsive design
    - Test on 320px viewport (small mobile)
    - Test on 375px viewport (iPhone)
    - Test on 768px viewport (tablet)
    - Test on 1920px viewport (desktop)
    - Verify no horizontal scrolling
    - Verify content is readable at all sizes
    - _Requirements: 10.4_

- [ ] 17. Final checkpoint - Complete PWA validation
  - Ensure all tests pass (unit and property tests)
  - Verify Lighthouse PWA score ≥ 90%
  - Verify app installs on mobile devices
  - Verify offline functionality works
  - Verify APK generation documentation is complete
  - Ask the user if questions arise

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Service worker requires HTTPS - use localhost or ngrok for development
- Test service worker updates by incrementing CACHE_VERSION
- Use Chrome DevTools → Application → Service Workers for debugging
- Property tests use fast-check library with minimum 100 iterations
- APK generation requires the PWA to be deployed to a public HTTPS URL
