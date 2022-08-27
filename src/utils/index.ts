/*
 * @Date: 2021-12-30 15:11:39
 * @LastEditors: CZH
 * @LastEditTime: 2022-08-27 18:14:41
 * @FilePath: /configforpagedemo/src/utils/index.ts
 */
import { cellMakerOptions, templateCellOptions } from "./cellClass";
import * as Icons from '@element-plus/icons-vue'
import { h, createApp, Component } from "vue";


// 对象字符串判空
export function isValidKey(key: string | number | symbol, object: object): key is keyof typeof object {
    return key in object;
}

// 获取Icon 对象
export function getIcon(name: string) {
    if (isValidKey(name, Icons)) {
        return Icons[name]
    } else {
        return h('p', {}, ['未找到这个图标'])
    }
}

/**
 * @name: deepClone
 * @description:深度克隆·
 * @authors: CZH
 * @Date: 2022-05-07 18:47:21
 * @param {any} initalObj
 */
export const deepClone = (initalObj: any): any => {
    function clone(searchObj: any): any {
        let back = {} as any;
        for (let item in searchObj) {
            if (searchObj[item] && typeof searchObj[item] === 'object')
                back[item] = clone(searchObj[item]);
            else
                back[item] = searchObj[item];
        }
        return back
    }
    let finalObj: any = clone(initalObj);
    return finalObj
}


// 组件加载模式，为了适配用户自定义组件的载入时的环境
export const createCusApp = (options: Component, rootProps?: Record<string, unknown> | null) => {
    const app = createApp(options);
    // app.config.globalProperties.$pageModules = pageModules
    // app.config.globalProperties.$utils = utils
    // for (let x in Icons) {
    //     if (utils.isValidKey(x, Icons)) {
    //         app.component(x, Icons[x])
    //     } else {
    //         console.log('icon 加载失败 : ', x)
    //     }
    // }
    // app.component('CusIcon', iconCell)
    // app.component('vue-drag-resize', Vue3DraggableResizable)
    // app.use(router)
    // app.use(ElementPlus)
    return app
}


// 全量导出模式
export default {
    /**
     * @name: tableCellMaker
     * @description: 构建表格单元 - @TODO 也可以兼容使用到输入&显示单元
     * @authors: CZH
     * @Date: 2021-12-30 15:18:29
     */
    tableCellMaker: (prop: string, label: string, template: Array<templateCellOptions>, options: cellMakerOptions) => {
        return {
            key: prop,
            value: prop,
            prop,
            label,
            template,
            ...options
        }
    },
    isValidKey,
    deepClone
}



