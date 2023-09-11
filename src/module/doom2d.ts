/// <reference types="emscripten" />
import { feature } from "wasm-check"

import defaultsASMJS from "./doom2d.asm"
import defaultsWASM from "./doom2d.wasm"
import type GameModule from "./game-module.d.ts"

function sufficientWasmSupport() {
  const features = { ...feature }
  return features.bulk && features.mutableGlobal
}

async function createGameModule(module?: Partial<GameModule> | undefined) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return sufficientWasmSupport()
    ? await defaultsWASM(module)
    : await defaultsASMJS(module)
}

export default createGameModule
