/*
 * @Date: 2023-02-14 17:20:57
 * @LastEditors: CZH
 * @LastEditTime: 2023-08-08 21:12:16
 * @FilePath: /ConfigForDesktopPage/babel.config.js
 */
module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset',
    ["@vue/app", {
      useBuiltIns: "entry"
    }],
    [
      "@vue/app",
      {
        useBuiltIns: "entry",
        polyfills: ["es6.promise", "es6.symbol"],
      },
    ],
    [
      "@babel/preset-env",
      {
        modules: false,
        useBuiltIns: "entry",
        corejs: 2,
      },
    ],
  ],
  plugins: ["@vue/babel-plugin-jsx"],
  transpileDependencies: [/node_modules/],
}