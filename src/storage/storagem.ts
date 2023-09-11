import type { IStorage, StorageEntries } from "./storage"
import type StorageKey from "./storage-key"

class StorageMemory implements IStorage {
  private readonly map: Readonly<Map<StorageKey, unknown>> = new Map()

  // eslint-disable-next-line @typescript-eslint/require-await
  public async add(key: Readonly<StorageKey>, value: unknown) {
    this.map.set(key, value)
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  public async remove(key: Readonly<StorageKey>) {
    this.map.delete(key)
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  public async removeAll() {
    for (const [key] of this.map.entries()) {
      this.map.delete(key)
    }
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  public async entries() {
    const set: StorageEntries = new Set()
    for (const [key, value] of this.map.entries()) {
      set.add({
        key,
        value,
      })
    }
    return set
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  public async get(key: Readonly<StorageKey>) {
    const value = this.map.get(key)
    if (value !== undefined) {
      return {
        key,
        value,
      }
    }
    return undefined
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  public async exists(key: Readonly<StorageKey>) {
    const value = this.map.get(key)
    return value !== undefined
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public async init() {}
}

export default StorageMemory
