// src/lib/cache.ts
const cache = new Map<string, { value: any; expiry: number }>();

export const getFromCache = <T>(key: string): T | undefined => {
  const entry = cache.get(key);
  if (entry && entry.expiry > Date.now()) {
    return entry.value as T;
  }
  cache.delete(key); // Remove expired entry
  return undefined;
};

export const setInCache = <T>(key: string, value: T, ttlMs: number) => {
  const expiry = Date.now() + ttlMs;
  cache.set(key, { value, expiry });
};
