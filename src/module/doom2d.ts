// eslint-disable-next-line spaced-comment
/// <reference types="emscripten" />
import { feature } from "wasm-check"

import defaultsASMJS from "./doom2d.asm.mjs"
import defaultsWASM from "./doom2d.wasm.mjs"

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface GameModule extends globalThis.EmscriptenModuleFactory {}

function sufficientWasmSupport() {
  const features = { ...feature }
  return features.bulk && features.mutableGlobal
}

// eslint-disable-next-line @typescript-eslint/promise-function-async
function createGameModule(
  module?: Partial<GameModule> | undefined,
): Promise<GameModule> {
  return sufficientWasmSupport() ? defaultsWASM(module) : defaultsASMJS(module)
}

export { createGameModule, type GameModule }
