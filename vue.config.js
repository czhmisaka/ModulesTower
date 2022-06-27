/*
 * @Date: 2022-01-05 09:21:49
 * @LastEditors: CZH
 * @LastEditTime: 2022-06-27 08:43:27
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

const MonacoEditorPlugin = require('monaco-editor-webpack-plugin')


module.exports = {
    publicPath: Env == 'production' ? '' : '',
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
            new MonacoEditorPlugin({
                // https://github.com/Microsoft/monaco-editor-webpack-plugin#options
                // Include a subset of languages support
                // Some language extensions like typescript are so huge that may impact build performance
                // e.g. Build full languages support with webpack 4.0 takes over 80 seconds
                // Languages are loaded on demand at runtime
                languages: ['javascript', 'css', 'html', 'typescript']
            })
        ]
    },

}