/* eslint-disable ssr-friendly/no-dom-globals-in-module-scope */
/// <reference types="emscripten" />

import { type IDBPDatabase, openDB } from "idb"

import { createGameModule, type GameModule } from "./module/doom2d"

const databaseName = "/persistent"
const storeName = "FILE_DATA"

const shouldLog = true

const launcher = document.querySelector("#launcher")
const game = document.querySelector("#game")
const canvas = document.querySelector("#canvas")
const area = document.querySelector("#area")
const options = document.querySelector("#options")
const buttons = document.querySelector("#buttons")
const argumentLabel = document.querySelector("#label-arg")
const argumentInput = document.querySelector("#text-arg")
const divInput = document.querySelector("#input")
const buttonStart = document.querySelector("#start-game")
const buttonOptions = document.querySelector("#options")
const status = document.querySelector("#progress")

function debugLog(messaged: unknown) {
  // eslint-disable-next-line max-len
  // eslint-disable-next-line putout/putout, @typescript-eslint/no-unnecessary-condition
  if (shouldLog) {
    // eslint-disable-next-line no-console
    console.log("DEBUG:", messaged)
  }
}

function printStatus(message: string) {
  if (status !== null) {
    // eslint-disable-next-line no-unsanitized/property
    status.innerHTML = message
  }
}

function splitIntoArguments(source: string) {
  return source
    .replaceAll(/(?<temp1>\s+)/gu, "$<temp1>§sep§")
    .split("§sep§")
    .filter((element) => element !== "")
    .map((element) => element.replaceAll(/\s+/gu, ""))
}

async function initDatabase(name: string, storename: string) {
  return await openDB(name, undefined, {
    upgrade(database) {
      database.createObjectStore(storename)
    },
  })
}

// eslint-disable-next-line max-params
async function put(
  database: Readonly<IDBPDatabase>,
  store: string,
  contents: unknown,
  path: IDBKeyRange | IDBValidKey | undefined,
) {
  const mode = 33_206
  const object = {
    contents,
    mode,
    timestamp: new Date(),
  }
  await database.put(store, object, path)
}

async function existsInDatabase(
  database: IDBPDatabase,
  store: string,
  key: IDBKeyRange | IDBValidKey,
) {
  const storehandle = database.transaction(store).objectStore(store)
  const test: unknown = await storehandle.get(key)
  return test !== undefined
}

function mountFs(module: Readonly<GameModule>) {
  module.FS.mkdir("/persistent")
  module.FS.mount(module.IDBFS, {}, "/persistent")
}

async function syncFs(isPopulate: boolean, module: Readonly<GameModule>) {
  // eslint-disable-next-line promise/avoid-new
  await new Promise((resolve, reject) => {
    module.FS.syncfs(isPopulate, (error) => {
      if (error !== null && error !== undefined && typeof error === "object") {
        reject(error)
      }
      // eslint-disable-next-line promise/no-multiple-resolved
      resolve(true)
    })
  })
}

async function toMemfs(
  source: string,
  target: string,
  module: Readonly<GameModule>,
) {
  const buf = module.FS.readFile(source, {})
  const stream = module.FS.open(target, "w+")
  module.FS.write(stream, buf, 0, buf.length, 0)
  module.FS.close(stream)
}

async function writeWads(module: Readonly<GameModule>) {
  await toMemfs("/persistent/doom2d.wad", "/doom2d.wad", module)
}

async function initFs(module: Readonly<GameModule>) {
  mountFs(module)
  await syncFs(true, module)
  await writeWads(module)
}

async function initGame(module: Readonly<GameModule>) {
  printStatus("Loading Doom 2D...")
  module.addRunDependency("syncfs")
  await initFs(module)
  module.removeRunDependency("syncfs")
  launcher!.style.display = "none"
  game!.style.display = "block"
}

async function fetchAndPut(database: Readonly<IDBPDatabase>, store: string) {
  const wad = "DOOM2D.WAD"
  const source = "."
  const stem = wad.toLocaleLowerCase()
  const path = `${source}/${wad}`
  const target = `/persistent/${stem}`
  const response = await fetch(path)
  const buf = await response.arrayBuffer()
  await put(database, store, new Uint8Array(buf), target)
}

async function downloadGamefiles() {
  printStatus("Checking game resources")
  const persistentDatabase = await initDatabase(databaseName, storeName)
  const isExists = await existsInDatabase(
    persistentDatabase,
    storeName,
    "/persistent/doom2d.wad",
  )

  if (isExists) {
    printStatus("Game resources found")
    debugLog("All is well.")
  } else {
    debugLog("DOOM2D.WAD is not found.")
    printStatus("Downloading game resources")
    await fetchAndPut(persistentDatabase, storeName)
  }
}

const module: Partial<GameModule> = {
  arguments: [],

  canvas: (() => {
    const canv = document.querySelector("#canvas")

    if (canv === null) {
      throw new Error("Canvas is not defined!")
    }

    return canv
  })(),

  postRun: [],

  preInit: [
    async () => {
      await initGame(module)
    },
  ],

  setStatus: printStatus,

  totalDependencies: 0,
}

// eslint-disable-next-line complexity
async function startGame(argv: string) {
  if (
    status === null ||
    buttonOptions === null ||
    buttonStart === null ||
    divInput === null ||
    argumentInput === null ||
    argumentLabel === null ||
    buttons === null ||
    options === null ||
    area === null ||
    canvas === null ||
    launcher === null ||
    game === null
  ) {
    throw new Error("Invalid DOM!")
  }
  await downloadGamefiles()
  if (argv !== "") {
    module.arguments = splitIntoArguments(argv)
  }
  await createGameModule(module)
}

window.addEventListener("error", () => {
  printStatus(
    "An error has occured. Please reload the page and try again. If the issue persists, make sure you have a reasonably up-to-date browser.",
  )
})

export { startGame }
