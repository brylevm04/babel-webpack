interface StorageKey {
  asIdbValidKey: () => IDBValidKey
  asString: () => string
}

export default StorageKey
