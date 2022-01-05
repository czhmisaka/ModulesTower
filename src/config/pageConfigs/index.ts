/*
 * @Date: 2021-12-30 19:54:50
 * @LastEditors: CZH
 * @LastEditTime: 2022-01-05 12:10:41
 * @FilePath: /configforpagedemo/src/config/pageConfigs/index.ts
 */


/**
 * @name: requireModule
 * @description: 引用module,目前来看并不能用变量路径来引入文件了，真的难顶啊兄弟们
 * @authors: CZH
 * @Date: 2022-01-05 11:09:09
 */
const requireModule = require.context(
    './',
    true,
    /\.ts$/
)


let modules: any = {}

const upperFirst = (str: string) => {
    return str.replace(/^\S/, s => s.toUpperCase())
}
const camelCase = function (str: string) {
    return str.replace(/(^\w|(\s+\w))/g, (_: any, $1: any) => {
        return $1.trim().toUpperCase()
    })
}

requireModule.keys().map(fileName => {
    if (fileName == './index.ts') return;
    const config_info: any = requireModule(fileName);
    const config_name: string = upperFirst(
        camelCase(
            fileName.split('/').pop().replace(/\.\w+$/, '')
        )
    )
    modules[config_name] = config_info
})


export default {
    ...modules
}