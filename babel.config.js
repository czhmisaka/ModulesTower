/*
 * @Date: 2023-05-30 10:47:09
 * @LastEditors: CZH
 * @LastEditTime: 2023-08-08 18:18:14
 * @FilePath: /lcdp_fe_setup/babel.config.js
 */
module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset',
    ["@vue/app", {
      useBuiltIns: "entry"
    }]
  ],
  plugins: ["@vue/babel-plugin-jsx"]
}