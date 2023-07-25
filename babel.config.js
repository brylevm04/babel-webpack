/* eslint-disable putout/putout */
/* eslint-disable import/no-commonjs */
/* eslint-disable import/unambiguous */
/* eslint-disable unicorn/prefer-module */
/* eslint-disable no-undef */
/* eslint-disable func-names */

module.exports = function (api) {
  api.cache(true)

  return {
    plugins: [
      [
        "@babel/plugin-transform-runtime",
        {
          absoluteRuntime: false,
          corejs: 3,
          helpers: true,
          regenerator: true,
          version: "^7.22.9",
        },
      ],
      ["@babel/plugin-transform-typescript"],
    ],

    presets: [
      [
        "@babel/preset-env",
        {
          corejs: { proposals: true, version: "3.31" },
          modules: "auto",
          debug: true,

          shippedProposals: true,

          useBuiltIns: "usage",
        },
      ],
      [
        "@babel/preset-typescript",
        {
          allowDeclareFields: true,
          optimizeConstEnums: true,
        },
      ],
    ],

    sourceType: "unambiguous",
  }
}
