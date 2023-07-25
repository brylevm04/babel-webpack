/* eslint-disable putout/putout */
/* eslint-disable import/no-commonjs */
/* eslint-disable import/unambiguous */
/* eslint-disable unicorn/prefer-module */
/* eslint-disable no-undef */

const path = require("node:path")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const TerserPlugin = require("terser-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const HTMLInlineCSSWebpackPlugin =
  require("html-inline-css-webpack-plugin").default

module.exports = [
  {
    entry: "./src/index.ts",

    mode: "development",

    module: {
      rules: [
        {
          exclude: [
            /\bcore-js\b/u,
            /\bwebpack\/buildin\b/u,
            /@babel\/runtime-corejs3/u,
            /doom2d.*\.m?js/u,
          ],

          loader: "babel-loader",

          options: {
            sourceType: "unambiguous",
          },

          // eslint-disable-next-line max-len
          // eslint-disable-next-line prefer-named-capture-group, regexp/prefer-named-capture-group
          test: /\.(m?js|m?ts)$/u,
        },
        {
          test: /\.css$/u,

          use: [MiniCssExtractPlugin.loader, "css-loader"],
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
      new MiniCssExtractPlugin({
        chunkFilename: "[id].css",
        filename: "[name].css",
      }),
      new HtmlWebpackPlugin({
        template: "src/index.html",

        title: "Doom 2D",
      }),
      new HTMLInlineCSSWebpackPlugin(),
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

    target: "browserslist",
  },
]
