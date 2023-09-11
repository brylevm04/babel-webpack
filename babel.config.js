/* eslint-disable putout/putout */
/* eslint-disable import/no-commonjs */
/* eslint-disable import/unambiguous */
/* eslint-disable unicorn/prefer-module */
/* eslint-disable no-undef */
/* eslint-disable func-names */

module.exports = function (api) {
  api.cache(true)

  return {
    compact: false,
    minified: false,

    plugins: [],

    presets: [
      [
        "@babel/preset-env",
        {
          corejs: { proposals: true, version: "3.31" },
          debug: true,
          modules: "auto",

          shippedProposals: true,
          useBuiltIns: "entry",
        },
      ],
      [
        "@babel/preset-typescript",
        {
          allowDeclareFields: true,
          allowNamespaces: true,
          optimizeConstEnums: true,
        },
      ],
    ],

    sourceType: "unambiguous",
  }
}
