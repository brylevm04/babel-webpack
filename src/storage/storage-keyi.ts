import type StorageKey from "./storage-key"

class StorageKeyI implements StorageKey {
  public constructor(private readonly value: string) {}

  public asIdbValidKey() {
    return this.value
  }

  public asString() {
    return this.value
  }
}

export default StorageKeyI
