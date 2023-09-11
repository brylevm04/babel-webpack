import type StorageKey from "./storage-key"

type StorageEntry = Readonly<{
  key: Readonly<StorageKey>
  value: unknown
}>

type StorageEntries = Readonly<Set<StorageEntry>>

interface IStorage {
  add: (key: Readonly<StorageKey>, data: unknown) => Promise<unknown>
  entries: () => Promise<StorageEntries> | StorageEntries
  exists: (key: Readonly<StorageKey>) => Promise<boolean>
  get: (key: Readonly<StorageKey>) => Promise<StorageEntry | undefined>
  init: () => Promise<void>
  remove: (key: Readonly<StorageKey>) => Promise<void>
  removeAll: () => Promise<void>
}

export type { IStorage, StorageEntries, StorageEntry }
