interface GameModule extends globalThis.EmscriptenModuleFactory {
  addRunDependency: (id: string) => void
  arguments: string[]
  canvas: HTMLCanvasElement
  // eslint-disable-next-line @typescript-eslint/naming-convention
  FS: typeof globalThis.FS
  // eslint-disable-next-line @typescript-eslint/naming-convention
  IDBFS: typeof globalThis.IDBFS
  // eslint-disable-next-line @typescript-eslint/naming-convention
  MEMFS: typeof globalThis.MEMFS
  // eslint-disable-next-line putout/putout
  postRun: ((...args: unknown[]) => unknown)[]
  // eslint-disable-next-line putout/putout
  preInit: ((...args: unknown[]) => unknown)[]
  // eslint-disable-next-line putout/putout
  preRun: ((...args: unknown[]) => unknown)[]
  print: (message: string) => unknown
  printErr: (message: string) => unknown
  removeRunDependency: (id: string) => void
  setStatus: (message: string) => unknown
  totalDependencies: number
}

export default GameModule