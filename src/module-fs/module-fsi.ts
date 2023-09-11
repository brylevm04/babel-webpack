import type GameModule from "../module/game-module"
import type StorageKey from "../storage/storage-key"
import StorageKeyI from "../storage/storage-keyi"
import StoragePersistentOrMemory from "../storage/storage-universal"
import type ModuleFS from "./module-fs"

type FsType = "memory" | "persistesnt"
class ModuleFsi implements ModuleFS {
  private storage: StoragePersistentOrMemory | undefined

  public constructor(
    private readonly gameModule: GameModule,
    private readonly directory: string,
    private readonly fsType: FsType = "memory",
  ) {}

  private idbfsEmscriptenFile(contents: Readonly<Uint8Array>) {
    return {
      contents,
      mode: 33_206,
      timestamp: new Date(),
    }
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  private async writeEmscriptenFs(path: string, data: Readonly<ArrayBuffer>) {
    const stream = this.gameModule.FS.open(path, "w+")
    const buf = new Uint8Array(data)
    this.gameModule.FS.write(stream, buf, 0, buf.length, 0)
    this.gameModule.FS.close(stream)
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  public async mount() {
    if (this.storage === undefined) {
      throw new Error("ModuleFS' storage backend is not initialized!")
    }
    const storageType = this.storage.storageBackend()
    this.gameModule.FS.mkdir(this.directory)
    this.gameModule.FS.mount(
      storageType === "memory" ? this.gameModule.MEMFS : this.gameModule.IDBFS,
      {},
      this.directory,
    )
  }

  public async sync(isPopulate: boolean) {
    if (this.storage === undefined) {
      throw new Error("ModuleFS' storage backend is not initialized!")
    }
    if (
      this.fsType === "persistesnt" &&
      this.storage.storageBackend() === "indexeddb"
    ) {
      // eslint-disable-next-line promise/avoid-new
      await new Promise((resolve, reject) => {
        this.gameModule.FS.syncfs(isPopulate, (error) => {
          if (
            error !== null &&
            error !== undefined &&
            typeof error === "object"
          ) {
            reject(error)
          }
          // eslint-disable-next-line promise/no-multiple-resolved
          resolve(true)
        })
      })
    }
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  public async addDirectory(path: string) {
    if (this.storage === undefined) {
      throw new Error("ModuleFS' storage backend is not initialized!")
    }

    throw new Error("Not implemted yet!")
  }

  public async writeFile(path: string, data: Readonly<ArrayBuffer>) {
    if (this.storage === undefined) {
      throw new Error("ModuleFS' storage backend is not initialized!")
    }

    if (this.storage.storageBackend() === "memory") {
      await this.writeEmscriptenFs(path, data)
    }

    // eslint-disable-next-line max-len
    // eslint-disable-next-line total-functions/no-unsafe-readonly-mutable-assignment
    const key: Readonly<StorageKey> = new StorageKeyI(path)
    const object = this.idbfsEmscriptenFile(new Uint8Array(data))
    await this.storage.add(key, object)
  }

  public async readFile(path: string) {
    if (this.storage === undefined) {
      throw new Error("ModuleFS' storage backend is not initialized!")
    }
    const response = await this.storage.get(new StorageKeyI(path))
    if (response === undefined) {
      return undefined
    }
    const { value } = response
    if (
      value === undefined ||
      value === null ||
      Array.isArray(value) ||
      typeof value !== "object" ||
      !("contents" in value)
    ) {
      return undefined
    }

    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    const view = value.contents as Uint8Array
    return view.buffer
  }

  public async initStorage() {
    this.storage = new StoragePersistentOrMemory(
      this.directory,
      "FILE_DATA",
      this.fsType === "memory" ? "memory" : "indexeddb",
    )
    await this.storage.init()
  }
}

export default ModuleFsi
