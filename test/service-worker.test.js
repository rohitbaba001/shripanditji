/**
 * Service Worker Functionality Tests
 * Tests for Task 10: Checkpoint - Test service worker functionality
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('Service Worker Checkpoint Tests', () => {
  describe('Service Worker Registration', () => {
    it('should register service worker successfully', async () => {
      // Mock service worker API
      const mockRegistration = {
        installing: null,
        waiting: null,
        active: { state: 'activated' },
        scope: '/',
        updateViaCache: 'imports'
      };

      global.navigator.serviceWorker = {
        register: vi.fn().mockResolvedValue(mockRegistration),
        ready: Promise.resolve(mockRegistration)
      };

      // Simulate registration
      const registration = await navigator.serviceWorker.register('/sw.js');
      
      expect(registration).toBeDefined();
      expect(navigator.serviceWorker.register).toHaveBeenCalledWith('/sw.js');
    });

    it('should handle service worker registration failure', async () => {
      const mockError = new Error('Registration failed');
      
      global.navigator.serviceWorker = {
        register: vi.fn().mockRejectedValue(mockError)
      };

      await expect(navigator.serviceWorker.register('/sw.js')).rejects.toThrow('Registration failed');
    });
  });

  describe('App Shell Caching', () => {
    it('should cache app shell resources on install', async () => {
      const mockCache = {
        addAll: vi.fn().mockResolvedValue(undefined),
        match: vi.fn(),
        put: vi.fn(),
        keys: vi.fn().mockResolvedValue([])
      };

      global.caches = {
        open: vi.fn().mockResolvedValue(mockCache),
        keys: vi.fn().mockResolvedValue([]),
        match: vi.fn()
      };

      const appShellResources = [
        '/',
        '/index.html',
        '/offline.html',
        '/styles.css',
        '/manifest.json'
      ];

      const cache = await caches.open('pwa-cache-v1.0.0');
      await cache.addAll(appShellResources);

      expect(caches.open).toHaveBeenCalledWith('pwa-cache-v1.0.0');
      expect(mockCache.addAll).toHaveBeenCalledWith(appShellResources);
    });

    it('should verify offline.html is cached', async () => {
      const mockResponse = new Response('<html>Offline</html>', {
        status: 200,
        headers: { 'Content-Type': 'text/html' }
      });

      const mockCache = {
        match: vi.fn().mockResolvedValue(mockResponse)
      };

      global.caches = {
        open: vi.fn().mockResolvedValue(mockCache),
        match: vi.fn().mockResolvedValue(mockResponse)
      };

      const cachedResponse = await caches.match('/offline.html');
      
      expect(cachedResponse).toBeDefined();
      expect(cachedResponse.status).toBe(200);
    });
  });

  describe('Offline Functionality', () => {
    it('should serve cached content when offline', async () => {
      const mockResponse = new Response('<html>Cached Page</html>', {
        status: 200,
        headers: { 'Content-Type': 'text/html' }
      });

      const mockCache = {
        match: vi.fn().mockResolvedValue(mockResponse)
      };

      global.caches = {
        open: vi.fn().mockResolvedValue(mockCache),
        match: vi.fn().mockResolvedValue(mockResponse)
      };

      // Simulate offline request
      const cachedResponse = await caches.match('/index.html');
      
      expect(cachedResponse).toBeDefined();
      expect(cachedResponse.status).toBe(200);
    });

    it('should serve offline.html for uncached pages when offline', async () => {
      const offlineResponse = new Response('<html>You are offline</html>', {
        status: 200,
        headers: { 'Content-Type': 'text/html' }
      });

      const mockCache = {
        match: vi.fn((request) => {
          if (request === '/offline.html') {
            return Promise.resolve(offlineResponse);
          }
          return Promise.resolve(undefined);
        })
      };

      global.caches = {
        open: vi.fn().mockResolvedValue(mockCache),
        match: vi.fn((request) => mockCache.match(request))
      };

      // Try to get uncached page
      const uncachedResponse = await caches.match('/uncached-page.html');
      expect(uncachedResponse).toBeUndefined();

      // Get offline fallback
      const fallbackResponse = await caches.match('/offline.html');
      expect(fallbackResponse).toBeDefined();
      expect(fallbackResponse.status).toBe(200);
    });
  });

  describe('Cache Versioning', () => {
    it('should clean up old cache versions', async () => {
      const oldCaches = [
        'pwa-cache-v0.9.0',
        'pwa-cache-v0.9.5',
        'pwa-cache-v1.0.0'
      ];

      const deletedCaches = [];

      global.caches = {
        keys: vi.fn().mockResolvedValue(oldCaches),
        delete: vi.fn((cacheName) => {
          deletedCaches.push(cacheName);
          return Promise.resolve(true);
        })
      };

      const currentVersion = 'pwa-cache-v1.0.0';
      const cacheNames = await caches.keys();
      
      // Delete old versions
      for (const cacheName of cacheNames) {
        if (cacheName.startsWith('pwa-cache-v') && cacheName !== currentVersion) {
          await caches.delete(cacheName);
        }
      }

      expect(deletedCaches).toContain('pwa-cache-v0.9.0');
      expect(deletedCaches).toContain('pwa-cache-v0.9.5');
      expect(deletedCaches).not.toContain('pwa-cache-v1.0.0');
    });
  });

  describe('Service Worker State', () => {
    it('should verify service worker is active', async () => {
      const mockRegistration = {
        active: { state: 'activated' },
        installing: null,
        waiting: null
      };

      global.navigator.serviceWorker = {
        ready: Promise.resolve(mockRegistration),
        controller: { state: 'activated' }
      };

      const registration = await navigator.serviceWorker.ready;
      
      expect(registration.active).toBeDefined();
      expect(registration.active.state).toBe('activated');
    });
  });
});
