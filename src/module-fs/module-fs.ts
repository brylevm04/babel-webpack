interface ModuleFS {
  addDirectory: (path: string) => Promise<void>
  exists: (path: string) => Promise<boolean>
  initStorage: () => Promise<void>
  mount: () => Promise<void>
  readFile: (path: string) => Promise<ArrayBuffer | undefined>
  sync: (isPopulate: true) => Promise<void>
  writeFile: (path: string, data: Readonly<ArrayBuffer>) => Promise<void>
}

export default ModuleFS
