/// <reference types="emscripten" />
import type GameModule from "./game-module.d.ts"

declare function create_game_module(mod?: Partial<GameModule>): Promise<GameModule>

export default create_game_module