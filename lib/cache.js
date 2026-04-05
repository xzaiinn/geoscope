// Simple in-memory cache with TTL
// In production you'd use Redis, but this works great for a solo app

const cache = new Map();

export function getCached(key) {
    const entry = cache.get(key);
    if (!entry) return null;

    // Check if expired
    if (Date.now() > entry.expiresAt) {
        cache.delete(key);
        return null;
    }

    return entry.data;
}

export function setCache(key, data, ttlMinutes = 30) {
    cache.set(key, {
        data,
        expiresAt: Date.now() + ttlMinutes * 60 * 1000,
        cachedAt: new Date().toISOString(),
    });
}

export function clearCache() {
    cache.clear();
}
