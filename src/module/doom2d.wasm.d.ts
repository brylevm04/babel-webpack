/// <reference types="emscripten" />
import { type GameModule } from "./doom2d"


export default function create_game_module(mod?: Partial<GameModule>): Promise<GameModule>