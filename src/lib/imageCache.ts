// src/lib/imageCache.ts

interface ImageCacheEntry {
  url: string;
  alt: string;
  credit: string;
  timestamp: number; // Add a timestamp for cache expiry
}

class ImageCache {
  private cache = new Map<string, ImageCacheEntry>();
  private readonly CACHE_LIFETIME_MS = 24 * 60 * 60 * 1000; // 24 hours in milliseconds (adjust as needed)
  private readonly MAX_CACHE_SIZE = 500; // Limit the number of entries to prevent excessive memory usage

  constructor() {
    // Optionally, implement a periodic cleanup if not relying solely on on-demand checks
    // setInterval(() => this.cleanupExpiredEntries(), this.CACHE_LIFETIME_MS / 2);
  }

  /**
   * Generates a normalized key for an item name.
   * This helps in consistent caching and retrieval for the same conceptual item.
   * @param itemName The original item name.
   * @returns A normalized string suitable for a cache key.
   */
  private normalizeItemNameKey(itemName: string): string {
    return `ITEM::${itemName.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '')}`;
  }

  /**
   * Checks if a specific key exists in the cache and is not expired.
   * Also performs a cleanup check for the specific entry.
   * @param key The exact cache key.
   * @returns True if the key exists and is valid, false otherwise.
   */
  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (entry && !this.isExpired(entry)) {
      return true;
    }
    // If expired or not found, remove it to keep cache clean
    if (entry) {
      this.delete(key);
    }
    return false;
  }

  /**
   * Retrieves data from the cache using an exact key.
   * Returns undefined if not found or if the entry is expired.
   * @param key The exact cache key.
   * @returns The cached ImageCacheEntry or undefined if not found or expired.
   */
  get(key: string): ImageCacheEntry | undefined {
    const entry = this.cache.get(key);
    if (entry && !this.isExpired(entry)) {
      return entry;
    }
    // If expired or not found, remove it
    if (entry) {
      this.delete(key);
    }
    return undefined;
  }

  /**
   * Stores data in the cache.
   * Implements a simple Least Recently Used (LRU) like eviction strategy
   * if the cache size limit is reached.
   * @param key The cache key.
   * @param data The ImageCacheEntry to store.
   */
  set(key: string, data: Omit<ImageCacheEntry, 'timestamp'>): void {
    // If the key already exists, update its timestamp and data to keep it fresh
    if (this.cache.has(key)) {
      this.cache.set(key, { ...data, timestamp: Date.now() });
      return;
    }

    // If cache size limit is reached, evict the oldest entry
    if (this.cache.size >= this.MAX_CACHE_SIZE) {
      this.evictOldestEntry();
    }
    this.cache.set(key, { ...data, timestamp: Date.now() });
  }

  /**
   * Tries to find a cached image entry related to a given item name.
   * This is useful for finding a previously cached image for the same item,
   * even if the exact query used to fetch it was different.
   *
   * It prioritizes direct normalized item name keys, then falls back to iterating
   * if a more complex lookup (e.g., substring in alt text) is needed.
   *
   * @param itemName The name of the HighlightItem.
   * @returns A cached ImageCacheEntry or undefined.
   */
  findByItemName(itemName: string): ImageCacheEntry | undefined {
    const normalizedKey = this.normalizeItemNameKey(itemName);
    const entry = this.get(normalizedKey); // Try direct normalized key first
    if (entry) {
      return entry;
    }

    const lowerItemName = itemName.toLowerCase();
    for (const [key, value] of this.cache.entries()) {
      // Check if the key starts with the normalized item name *OR*
      // if the alt text explicitly contains the item name (more expensive).
      // Ensure the entry is not expired before returning.
      if (!this.isExpired(value) && (key.startsWith(normalizedKey) || value.alt.toLowerCase().includes(lowerItemName))) {
        // If found via alt text, consider updating the cache with a normalized key
        // to make future lookups faster. This is an optional optimization.
        if (!key.startsWith(normalizedKey)) {
           console.log(`[ImageCache] Found by alt text for "${itemName}". Caching with normalized key: ${normalizedKey}`);
           this.set(normalizedKey, value); // Store it with the more specific key for future hits
        }
        return value;
      }
      // If an entry is found but expired during iteration, delete it.
      if (this.isExpired(value)) {
        this.delete(key);
      }
    }
    return undefined;
  }

  /**
   * Clears all entries from the cache.
   */
  clear(): void {
    this.cache.clear();
    console.log("[ImageCache] Cache cleared.");
  }

  /**
   * Deletes a specific entry from the cache.
   * @param key The key of the entry to delete.
   * @returns True if the entry was deleted, false if it didn't exist.
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Checks if a cache entry has expired.
   * @param entry The ImageCacheEntry to check.
   * @returns True if expired, false otherwise.
   */
  private isExpired(entry: ImageCacheEntry): boolean {
    return (Date.now() - entry.timestamp) > this.CACHE_LIFETIME_MS;
  }

  /**
   * Evicts the oldest entry from the cache.
   * This is a simple LRU-like strategy.
   */
  private evictOldestEntry(): void {
    let oldestKey: string | undefined;
    let oldestTimestamp = Infinity;

    for (const [key, entry] of this.cache.entries()) {
      if (entry.timestamp < oldestTimestamp) {
        oldestTimestamp = entry.timestamp;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
      console.log(`[ImageCache] Evicted oldest entry: ${oldestKey}`);
    }
  }

  /**
   * Periodically cleans up expired entries.
   * Can be called by a setInterval or explicitly when memory usage is high.
   */
  cleanupExpiredEntries(): void {
    const now = Date.now();
    let cleanedCount = 0;
    for (const [key, entry] of this.cache.entries()) {
      if (this.isExpired(entry)) {
        this.cache.delete(key);
        cleanedCount++;
      }
    }
    if (cleanedCount > 0) {
      console.log(`[ImageCache] Cleaned up ${cleanedCount} expired entries.`);
    }
  }

  /**
   * Returns the current size of the cache.
   */
  size(): number {
    return this.cache.size;
  }
}

export const imageCache = new ImageCache();