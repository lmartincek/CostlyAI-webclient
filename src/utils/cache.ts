class MemoryCache {
  private cache: Map<string, any>

  constructor() {
    this.cache = new Map()
  }

  get<T>(key: string): T | null {
    return this.cache.get(key) ?? null
  }

  set<T>(key: string, value: T): void {
    this.cache.set(key, value)
  }

  has(key: string): boolean {
    return this.cache.has(key)
  }

  delete(key: string): void {
    this.cache.delete(key)
  }

  clear(): void {
    this.cache.clear()
  }
}

export const memoryCache = new MemoryCache()
