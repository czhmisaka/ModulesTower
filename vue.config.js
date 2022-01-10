/*
 * @Date: 2022-01-05 09:21:49
 * @LastEditors: CZH
 * @LastEditTime: 2022-01-05 10:52:22
 * @FilePath: /configforpagedemo/vue.config.js
 */


// development & production
const Env = process.env.NODE_ENV
const projectVersion = '0.0.1'

module.exports = {
    publicPath: '',
    devServer: {
        port: 9050,
        // proxy: {}
    },
    configureWebpack: {
        // webpack 配置
        output: {
            // 输出重构  打包编译后的 文件名称  【模块名称.环境-版本号.时间戳】
            filename: `[name].${Env}-${projectVersion}.js`,
            chunkFilename: `[name].${Env}-${projectVersion}.js`,
        },
    }
}