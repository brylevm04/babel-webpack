/* eslint-disable putout/putout */
/* eslint-disable import/no-commonjs */
/* eslint-disable import/unambiguous */
/* eslint-disable unicorn/prefer-module */
/* eslint-disable no-undef */

const path = require("node:path")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const TerserPlugin = require("terser-webpack-plugin")

module.exports = [
  {
    entry: "./src/index.ts",

    mode: "development",

    module: {
      rules: [
        {
          exclude: /node_modules/u,
          loader: "babel-loader",
          test: /\.ts$/u,
        },
        {
          test: /\.css$/u,

          use: [
            {
              loader: "style-loader",

              options: {
                injectType: "singletonStyleTag",
                insert: "head",
              },
            },
            "css-loader",
          ],
        },
      ],
    },

    node: {
      __dirname: false,
    },

    optimization: {
      minimize: true,

      minimizer: [
        new TerserPlugin({
          terserOptions: {
            compress: {
              defaults: true,
              drop_console: true,
              keep_infinity: true,
            },
          },
        }),
      ],
    },

    output: {
      filename: "index.js",
      path: path.join(__dirname, "build"),
    },

    plugins: [
      new HtmlWebpackPlugin({
        template: "src/index.html",

        title: "Doom 2D",
      }),
    ],

    resolve: {
      extensions: [".ts", ".js"],

      fallback: {
        buffer: false,
        constants: false,
        crypto: false,
        "crypto-browserify": false,
        fs: false,
        http: false,
        https: false,
        module: false,
        net: false,
        os: false,
        path: false,
        stream: false,
        tls: false,
        zlib: false,
      },
    },

    target: "web",
  },
]
