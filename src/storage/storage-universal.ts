import type { IStorage } from "./storage"
import type StorageKey from "./storage-key"
import StorageIndexedDatabase from "./storagei"
import StorageMemory from "./storagem"

type StorageBackend = "indexeddb" | "memory"

class StoragePersistentOrMemory implements IStorage {
  private indexed: StorageIndexedDatabase | undefined

  private readonly mapMemory = new StorageMemory()

  public constructor(
    private readonly databaseName: string,
    private readonly storeName: string,
    private readonly hint: StorageBackend,
  ) {}

  private getStorage() {
    if (this.indexed === undefined) {
      return this.mapMemory
    }
    return this.indexed
  }

  public storageBackend(): StorageBackend {
    return this.indexed === undefined ? "memory" : "indexeddb"
  }

  public async init() {
    if (this.hint === "indexeddb") {
      try {
        this.indexed = new StorageIndexedDatabase(
          this.databaseName,
          this.storeName,
        )
        await this.indexed.init()
      } catch {
        this.indexed = undefined
        await this.mapMemory.init()
      }
    } else {
      await this.mapMemory.init()
    }
  }

  public async add(key: Readonly<StorageKey>, data: unknown) {
    await this.getStorage().add(key, data)
  }

  public async entries() {
    return await this.getStorage().entries()
  }

  public async get(key: Readonly<StorageKey>) {
    return await this.getStorage().get(key)
  }

  public async exists(key: Readonly<StorageKey>) {
    return await this.getStorage().exists(key)
  }

  public async remove(key: Readonly<StorageKey>) {
    await this.getStorage().remove(key)
  }

  public async removeAll() {
    await this.getStorage().removeAll()
  }
}

export default StoragePersistentOrMemory
