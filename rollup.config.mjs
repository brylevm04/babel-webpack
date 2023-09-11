import pbabel from "@rollup/plugin-babel"
import commonjs from "@rollup/plugin-commonjs"
import resolve from "@rollup/plugin-node-resolve"

const extensions = [
  ".js",
  ".jsx",
  ".es6",
  ".es",
  ".mjs",
  "ts",
  "tsx",
  "json",
  "node",
]

const config = {
  input: "src/index.ts",

  output: {
    file: "build/index.js",
    format: "iife",
  },

  plugins: [
    commonjs(),
    resolve({
      browser: true,
      extensions,
    }),
    pbabel({
      babelHelpers: "bundled",
      extensions,
    }),
  ],
}

export default config
