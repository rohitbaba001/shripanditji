/**
 * CacheManager - Manages service worker cache versioning, limits, and cleanup
 * 
 * Handles:
 * - Cache versioning with version prefix
 * - Adding resources to cache
 * - Cleaning up old cache versions
 * - Enforcing cache size limits with FIFO eviction
 * - Clearing expired cache entries
 */

class CacheManager {
  constructor(version = '1.0.0') {
    this.version = version;
    this.maxCacheSize = 50; // Maximum number of cache entries
    this.maxCacheAge = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
  }

  /**
   * Get cache name with version prefix
   * @returns {string} Cache name with version (e.g., "pwa-cache-v1.0.0")
   */
  getCacheName() {
    return `pwa-cache-v${this.version}`;
  }

  /**
   * Add resources to cache
   * @param {string} cacheName - Name of the cache
   * @param {string[]} resources - Array of resource URLs to cache
   * @returns {Promise<void>}
   */
  async addToCache(cacheName, resources) {
    try {
      const cache = await caches.open(cacheName);
      await cache.addAll(resources);
    } catch (error) {
      console.error('Failed to add resources to cache:', error);
      throw error;
    }
  }

  /**
   * Clean up old cache versions, keeping only the current version
   * @returns {Promise<void>}
   */
  async cleanOldCaches() {
    try {
      const cacheNames = await caches.keys();
      const currentCacheName = this.getCacheName();
      
      const deletePromises = cacheNames
        .filter(cacheName => cacheName.startsWith('pwa-cache-v') && cacheName !== currentCacheName)
        .map(cacheName => caches.delete(cacheName));
      
      await Promise.all(deletePromises);
    } catch (error) {
      console.error('Failed to clean old caches:', error);
      throw error;
    }
  }

  /**
   * Enforce cache size limits using FIFO eviction
   * Removes oldest entries when cache exceeds maxCacheSize
   * @param {string} cacheName - Name of the cache to enforce limits on
   * @returns {Promise<void>}
   */
  async enforceCacheLimits(cacheName) {
    try {
      const cache = await caches.open(cacheName);
      const requests = await cache.keys();
      
      if (requests.length <= this.maxCacheSize) {
        return; // Within limits, no action needed
      }
      
      // Get entries with timestamps
      const entries = await Promise.all(
        requests.map(async (request) => {
          const response = await cache.match(request);
          const timestamp = response?.headers.get('x-cache-timestamp') || '0';
          return {
            request,
            timestamp: parseInt(timestamp, 10)
          };
        })
      );
      
      // Sort by timestamp (oldest first)
      entries.sort((a, b) => a.timestamp - b.timestamp);
      
      // Remove oldest entries until within limit
      const entriesToRemove = entries.slice(0, requests.length - this.maxCacheSize);
      const deletePromises = entriesToRemove.map(entry => cache.delete(entry.request));
      
      await Promise.all(deletePromises);
    } catch (error) {
      console.error('Failed to enforce cache limits:', error);
      throw error;
    }
  }

  /**
   * Clear expired cache entries based on maxCacheAge
   * @param {string} cacheName - Name of the cache to clear expired entries from
   * @returns {Promise<void>}
   */
  async clearExpiredEntries(cacheName) {
    try {
      const cache = await caches.open(cacheName);
      const requests = await cache.keys();
      const now = Date.now();
      
      const deletePromises = [];
      
      for (const request of requests) {
        const response = await cache.match(request);
        const timestamp = response?.headers.get('x-cache-timestamp');
        
        if (timestamp) {
          const age = now - parseInt(timestamp, 10);
          if (age > this.maxCacheAge) {
            deletePromises.push(cache.delete(request));
          }
        }
      }
      
      await Promise.all(deletePromises);
    } catch (error) {
      console.error('Failed to clear expired entries:', error);
      throw error;
    }
  }
}

// Export for use in service worker and tests
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CacheManager;
}
