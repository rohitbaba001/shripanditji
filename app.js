/**
 * Main Application Script
 * 
 * Handles service worker registration, updates, and install manager initialization
 * Requirements: 3.1, 5.2, 5.4
 */

// Import InstallManager (will be loaded via script tag)
// InstallManager class is available globally from install-manager.js

/**
 * Initialize the application
 * - Register service worker
 * - Set up update checking
 * - Initialize install manager
 * - Set up install button handler
 */
function initApp() {
  // Check if service workers are supported
  if ('serviceWorker' in navigator) {
    // Register service worker on page load
    window.addEventListener('load', () => {
      registerServiceWorker();
    });
  } else {
    console.warn('Service Workers are not supported in this browser');
    // App can still function without offline capabilities
  }

  // Initialize install manager
  initInstallManager();
}

/**
 * Register the service worker
 * Handles registration success, failure, and updates
 */
async function registerServiceWorker() {
  try {
    // Register /sw.min.js
    const registration = await navigator.serviceWorker.register('/sw.min.js');
    
    console.log('Service Worker registered successfully:', registration.scope);
    
    // Check for service worker updates
    checkForUpdates(registration);
    
    // Check for updates periodically (every hour)
    setInterval(() => {
      registration.update();
    }, 60 * 60 * 1000);
    
  } catch (error) {
    // Handle registration failure
    console.error('Service Worker registration failed:', error);
    
    // Log detailed error information
    if (error.name === 'SecurityError') {
      console.error('Service Worker registration blocked by security policy. Ensure the app is served over HTTPS.');
    } else if (error.name === 'TypeError') {
      console.error('Service Worker script could not be loaded. Check that /sw.min.js exists and is accessible.');
    }
    
    // App continues to function without service worker
    // User will not have offline capabilities
  }
}

/**
 * Check for service worker updates
 * Listens for updatefound event and notifies when new version is available
 * 
 * @param {ServiceWorkerRegistration} registration - The service worker registration
 */
function checkForUpdates(registration) {
  // Listen for updatefound event
  registration.addEventListener('updatefound', () => {
    const newWorker = registration.installing;
    
    console.log('Service Worker update found');
    
    if (!newWorker) {
      return;
    }
    
    // Listen for state changes on the new worker
    newWorker.addEventListener('statechange', () => {
      console.log('Service Worker state changed to:', newWorker.state);
      
      // If new worker is installed and there's an existing controller
      // it means an update is available
      if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
        console.log('New Service Worker available. Refresh to update.');
        
        // Optionally show a notification to the user
        showUpdateNotification();
      }
      
      // If new worker is activated, it's now controlling the page
      if (newWorker.state === 'activated') {
        console.log('New Service Worker activated');
      }
    });
  });
  
  // Also check if there's already an update waiting
  if (registration.waiting) {
    console.log('Service Worker update is waiting');
    showUpdateNotification();
  }
}

/**
 * Show update notification to user
 * Informs user that a new version is available
 */
function showUpdateNotification() {
  // Simple console notification
  console.log('%c🔄 Update Available', 'font-size: 16px; font-weight: bold; color: #FF6B35;');
  console.log('A new version of the app is available. Refresh the page to update.');
  
  // In a production app, you might show a toast notification or banner
  // Example: showToast('New version available! Refresh to update.');
}

/**
 * Initialize the install manager
 * Sets up PWA installation prompt handling
 */
function initInstallManager() {
  // Check if InstallManager is available
  if (typeof InstallManager === 'undefined') {
    console.warn('InstallManager not loaded. Install functionality will not be available.');
    return;
  }
  
  // Create new InstallManager instance
  const installManager = new InstallManager();
  
  // Initialize event listeners
  installManager.init();
  
  console.log('InstallManager initialized');
  
  // Set up install button click handler
  setupInstallButton(installManager);
}

/**
 * Set up install button click handler
 * Triggers installation prompt when button is clicked
 * 
 * @param {InstallManager} installManager - The install manager instance
 */
function setupInstallButton(installManager) {
  const installButton = document.getElementById('install-button');
  
  if (!installButton) {
    console.warn('Install button not found in DOM');
    return;
  }
  
  // Add click event listener
  installButton.addEventListener('click', async () => {
    console.log('Install button clicked');
    
    try {
      // Trigger the installation prompt
      await installManager.promptInstall();
    } catch (error) {
      console.error('Error triggering install prompt:', error);
    }
  });
  
  console.log('Install button click handler set up');
}

// Initialize the app when script loads
initApp();
