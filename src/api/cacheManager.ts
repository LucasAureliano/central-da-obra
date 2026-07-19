/**
 * Cache Manager for CentralObra
 * Handles memory and local storage caching for API responses.
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresIn: number; // in milliseconds
}

class CacheManager {
  private memoryCache: Map<string, CacheEntry<any>> = new Map();

  /**
   * Set data to cache
   */
  set<T>(key: string, data: T, expiresInMs: number = 1000 * 60 * 5, useLocalStorage: boolean = false): void {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      expiresIn: expiresInMs
    };

    this.memoryCache.set(key, entry);

    if (useLocalStorage) {
      try {
        localStorage.setItem(`co_cache_${key}`, JSON.stringify(entry));
      } catch (err) {
        console.warn('Failed to save to localStorage cache', err);
      }
    }
  }

  /**
   * Get data from cache if valid
   */
  get<T>(key: string, useLocalStorage: boolean = false): T | null {
    // Check Memory First
    let entry = this.memoryCache.get(key);

    // Check Local Storage if not in memory
    if (!entry && useLocalStorage) {
      try {
        const stored = localStorage.getItem(`co_cache_${key}`);
        if (stored) {
          entry = JSON.parse(stored);
        }
      } catch (err) {
        console.warn('Failed to parse localStorage cache', err);
      }
    }

    if (!entry) return null;

    // Check expiration
    if (Date.now() - entry.timestamp > entry.expiresIn) {
      this.remove(key, useLocalStorage);
      return null;
    }

    // Re-populate memory cache if retrieved from localStorage
    if (useLocalStorage && !this.memoryCache.has(key)) {
      this.memoryCache.set(key, entry);
    }

    return entry.data as T;
  }

  /**
   * Remove specific key
   */
  remove(key: string, useLocalStorage: boolean = false): void {
    this.memoryCache.delete(key);
    if (useLocalStorage) {
      localStorage.removeItem(`co_cache_${key}`);
    }
  }

  /**
   * Clear all caches
   */
  clear(): void {
    this.memoryCache.clear();
    const keys = Object.keys(localStorage);
    for (const key of keys) {
      if (key.startsWith('co_cache_')) {
        localStorage.removeItem(key);
      }
    }
  }
}

export const cacheManager = new CacheManager();
