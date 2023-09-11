import { type IDBPDatabase, openDB } from "idb"
import { zip } from "lodash"

import type { IStorage, StorageEntry } from "./storage"
import type StorageKey from "./storage-key"
import StorageKeyI from "./storage-keyi"

class StorageIndexedDatabase implements IStorage {
  private database: Readonly<IDBPDatabase | undefined>

  public constructor(
    private readonly databaseName: string,
    private readonly storeName: string,
  ) {}

  private async initDatabase(name: string, storename: string) {
    this.database = await openDB(name, undefined, {
      upgrade(database) {
        database.createObjectStore(storename)
      },
    })
  }

  public async init() {
    await this.initDatabase(this.databaseName, this.storeName)
  }

  public async add(path: Readonly<StorageKey>, data: unknown) {
    if (this.database === undefined) {
      throw new Error("StorageIndexedDatabase is not initialized!")
    }
    await this.database.put(this.storeName, data, path.asIdbValidKey())
  }

  public async remove(key: Readonly<StorageKey>) {
    if (this.database === undefined) {
      throw new Error("StorageIndexedDatabase is not initialized!")
    }
    await this.database.delete(this.storeName, key.asIdbValidKey())
  }

  public async removeAll() {
    if (this.database === undefined) {
      throw new Error("StorageIndexedDatabase is not initialized!")
    }
    await this.database.clear(this.storeName)
  }

  public async entries() {
    if (this.database === undefined) {
      throw new Error("StorageIndexedDatabase is not initialized!")
    }
    const { store } = this.database.transaction(this.storeName)
    const values: unknown[] = await store.getAll()
    const keys = await store.getAllKeys()
    const entries = new Set<StorageEntry>()
    for (const [, value] of Object.entries(zip(keys, values))) {
      entries.add({
        key: new StorageKeyI(String(value[0])),
        value: value[1],
      })
    }
    return entries
  }

  public async get(
    key: Readonly<StorageKey>,
  ): Promise<StorageEntry | undefined> {
    if (this.database === undefined) {
      throw new Error("StorageIndexedDatabase is not initialized!")
    }

    const value: unknown = await this.database.get(
      this.storeName,
      key.asIdbValidKey(),
    )
    if (value === undefined) {
      return undefined
    }
    return {
      key,
      value,
    }
  }

  public async exists(key: Readonly<StorageKey>) {
    return undefined !== (await this.get(key))
  }
}

export default StorageIndexedDatabase
