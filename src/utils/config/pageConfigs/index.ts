/*
 * @Date: 2021-12-30 19:54:50
 * @LastEditors: CZH
 * @LastEditTime: 2022-10-22 01:43:29
 * @FilePath: /configforpagedemo/src/utils/config/pageConfigs/index.ts
 */


// 两个工具函数，看不看都无所谓
export const upperFirst = (str: string) => {
    return str.replace(/^\S/, s => s.toUpperCase())
}
export const camelCase = function (str: string) {
    return str.replace(/(^\w|(\s+\w))/g, (_: any, $1: any) => {
        return $1.trim().toUpperCase()
    })
}


/**
 * @name: requireModule
 * @description: 引用module,目前看来只能这么配置路径了兄弟们
 * @authors: CZH
 * @Date: 2022-01-05 11:09:09
 */
const requireModule = [require.context(
    './',
    true,
    /\.ts$/
)]


let modules: any = {}

requireModule.map(rm => {
    rm.keys().map(fileName => {
        if (fileName == './index.ts') return;
        const config_info: any = rm(fileName);
        const config_name: string = upperFirst(
            camelCase(
                fileName.split('/').pop().replace(/\.\w+$/, '')
            )
        )
        modules[config_name] = config_info
    })
})


export default {
    ...modules
}