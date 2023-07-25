/* eslint-disable ssr-friendly/no-dom-globals-in-module-scope */
/// <reference types="emscripten" />
import "./index.css"

import { startGame } from "./init"

const argumentInput = document.querySelector<HTMLInputElement>("#text-arg")
const buttonStart = document.querySelector<HTMLButtonElement>("#start-game")
const buttonOptions = document.querySelector("#options")

if (argumentInput === null || buttonStart === null || buttonOptions === null) {
  throw new Error("Invalid DOM!")
}

let argumentText = ""

argumentInput.addEventListener("change", () => {
  argumentText = argumentInput.value
})

buttonStart.addEventListener("click", () => {
  void startGame(argumentText)
})
