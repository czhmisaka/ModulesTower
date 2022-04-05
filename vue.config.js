/*
 * @Date: 2022-01-05 09:21:49
 * @LastEditors: CZH
 * @LastEditTime: 2022-04-05 14:43:50
 * @FilePath: /configforpagedemo/vue.config.js
 */


// development & production
const Env = process.env.NODE_ENV
const projectVersion = '0.0.1'


const proxyObjCreate = require('./config/proxyTable.js')

const AutoImport = require('unplugin-auto-import/webpack');
const Components = require('unplugin-vue-components/webpack');
const {
    ElementPlusResolver
} = require('unplugin-vue-components/resolvers');




module.exports = {
    publicPath: '',
    devServer: {
        port: 9050,
        proxy: {
            ...proxyObjCreate(['/']),
        }
    },
    configureWebpack: {
        // webpack 配置
        output: {
            // 输出重构  打包编译后的 文件名称  【模块名称.环境-版本号.时间戳】
            filename: `[name].${Env}-${projectVersion}.js`,
            chunkFilename: `[name].${Env}-${projectVersion}.js`,
        },
        plugins: [
            AutoImport({
                resolvers: [ElementPlusResolver()],
            }),
            Components({
                resolvers: [ElementPlusResolver()],
            }),
        ]
    },
   
}