import logger from '../utils/logger';

/**
 * Cache entry with expiration time
 */
interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

/**
 * Simple in-memory cache service with TTL support
 */
class CacheService {
  private cache: Map<string, CacheEntry<unknown>>;

  constructor() {
    this.cache = new Map();
  }

  /**
   * Gets a cached value if it exists and hasn't expired
   *
   * @param key - Cache key
   * @returns Cached value or null if not found/expired
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key) as CacheEntry<T> | undefined;

    if (!entry) {
      return null;
    }

    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      logger.debug('Cache expired', { key });
      return null;
    }

    logger.debug('Cache hit', { key });
    return entry.data;
  }

  /**
   * Sets a cache value with TTL
   *
   * @param key - Cache key
   * @param data - Data to cache
   * @param ttlSeconds - Time to live in seconds
   */
  set<T>(key: string, data: T, ttlSeconds: number): void {
    const expiresAt = Date.now() + ttlSeconds * 1000;
    this.cache.set(key, { data, expiresAt });
    logger.debug('Cache set', { key, ttlSeconds });
  }

  /**
   * Removes a specific cache entry
   *
   * @param key - Cache key to remove
   */
  delete(key: string): void {
    this.cache.delete(key);
    logger.debug('Cache deleted', { key });
  }

  /**
   * Clears all cache entries
   */
  clear(): void {
    this.cache.clear();
    logger.info('Cache cleared');
  }

  /**
   * Gets cache size
   *
   * @returns Number of entries in cache
   */
  size(): number {
    return this.cache.size;
  }
}

// Export singleton instance
export const cacheService = new CacheService();
