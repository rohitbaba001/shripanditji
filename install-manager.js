/**
 * InstallManager - Manages PWA installation prompt and tracking
 * 
 * Handles the beforeinstallprompt event, provides methods to show/hide
 * install UI, trigger the installation prompt, and track installation outcomes.
 * 
 * Requirements: 5.2, 5.3, 5.4, 5.5, 5.6
 */

class InstallManager {
  constructor() {
    // Store the deferred prompt event
    this.deferredPrompt = null;
    
    // Track installation state
    this.isInstalled = false;
    this.promptShown = false;
  }

  /**
   * Initialize event listeners for installation events
   * Sets up listeners for beforeinstallprompt and appinstalled events
   */
  init() {
    // Listen for beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent the default mini-infobar from appearing
      e.preventDefault();
      
      // Store the event for later use
      this.deferredPrompt = e;
      
      // Show the custom install button
      this.showInstallButton();
      
      console.log('beforeinstallprompt event captured');
    });

    // Listen for appinstalled event
    window.addEventListener('appinstalled', (e) => {
      console.log('PWA was installed');
      
      // Track the installation
      this.trackInstallation('accepted');
      
      // Update state
      this.isInstalled = true;
      
      // Hide the install button
      this.hideInstallButton();
      
      // Clear the deferred prompt
      this.deferredPrompt = null;
    });
  }

  /**
   * Show the custom install button in the UI
   */
  showInstallButton() {
    const installButton = document.getElementById('install-button');
    if (installButton) {
      installButton.style.display = 'block';
      console.log('Install button shown');
    }
  }

  /**
   * Hide the install button from the UI
   */
  hideInstallButton() {
    const installButton = document.getElementById('install-button');
    if (installButton) {
      installButton.style.display = 'none';
      console.log('Install button hidden');
    }
  }

  /**
   * Trigger the installation prompt
   * Shows the browser's native install dialog
   * @returns {Promise<void>}
   */
  async promptInstall() {
    if (!this.deferredPrompt) {
      console.log('No deferred prompt available');
      return;
    }

    // Mark that prompt was shown
    this.promptShown = true;

    // Show the install prompt
    this.deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await this.deferredPrompt.userChoice;
    
    console.log(`User response to install prompt: ${outcome}`);

    // Track the installation outcome
    this.trackInstallation(outcome);

    // Clear the deferred prompt
    this.deferredPrompt = null;

    // Hide the install button if user accepted
    if (outcome === 'accepted') {
      this.hideInstallButton();
    }
  }

  /**
   * Track installation outcome for analytics
   * @param {string} outcome - 'accepted' or 'dismissed'
   */
  trackInstallation(outcome) {
    console.log(`Installation outcome: ${outcome}`);
    
    // Log to console for debugging
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] PWA Installation ${outcome}`);
    
    // In a production app, you would send this to analytics
    // Example: analytics.track('pwa_install', { outcome, timestamp });
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = InstallManager;
}
