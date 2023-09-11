/* eslint-disable ssr-friendly/no-dom-globals-in-module-scope */
/// <reference types="emscripten" />
//import "./index.css"
// eslint-disable-next-line import/no-extraneous-dependencies
import "core-js"

import { range } from "lodash"

import StorageKeyI from "./storage/storage-keyi.ts"
import StorageIndexedDatabase from "./storage/storagei.ts"
import ModuleFsi from "./module-fs/module-fsi.ts"

// import { startGame } from "./init.ts"

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
  // void startGame(argumentText)
})

/*
{
  const obj = new StorageIndexedDatabase("TEST", "TEST")
  await obj.init()
  for (const [, v] of Object.entries(range(50))) {
    const key = new StorageKeyI(String(v))
    await obj.add(key, {
      mode: 434_343,
      value: v,
    })
  }
  const all = await obj.entries()
  console.log(all)
}
*/
