/*
 * @Date: 2022-08-21 00:08:11
 * @LastEditors: CZH
 * @LastEditTime: 2022-08-24 00:22:12
 * @FilePath: /configforpagedemo/src/components/basicComponents/grid/module/cardApi/index.ts
 */

import { cardOnChangeType, gridCellOptions, gridPositionCell, gridSizeCell } from '../dataTemplate'

/**
 * @name: checkContext
 * @description: 检查context对象以及输入value是否存在
 * @authors: CZH
 * @Date: 2022-08-17 19:12:22
 * @param {object} content
 * @param {object} value
 */
const checkContext = (content: { [key: string]: any }, value: { [key: string]: any }) => {
    if (Object.keys(value).length == 0) console.error('setData_数据上报错误:', '当前上报数据为空');
    else if (!content) console.error('setData_数据上报错误:', '没有组件对象');
    else return true
}


/**
 * @name: deepMerge
 * @description: 合并对象
 * @authors: CZH
 * @Date: 2022-08-23 23:58:35
 * @param {any} target
 * @param {any} other
 */
export const deepMerge = (target: any, other: any) => {
    const targetToString = Object.prototype.toString.call(target);
    if (targetToString === "[object Object]") {
        for (let [key, val] of Object.entries(other)) {
            if (key in target) {
                target[key] = deepMerge(target[key], val);
            } else {
                target[key] = val;
            }
        }
    } else if (targetToString === "[object Array]") {
        for (let [key, val] of Object.entries(other)) {
            if (target[key]) {
                target[key] = deepMerge(target[key], val);
            } else {
                target.push(val);
            }
        }
    }
    return target;
}


/**
 * @name: setData
 * @description: 简易组件数据推送到桌面baseData的工具
 * @authors: CZH
 * @Date: 2022-07-29 16:25:14
 */
export const setData = (content: {
    [key: string]: any
}, value: { [key: string]: any }): void => {
    if (!checkContext(content, value)) return;
    try {
        let func = content['$emit'] ? '$emit' : 'emit';
        content[func]('onChange', value, {
            type: [
                cardOnChangeType.onChange
            ]
        })
    } catch (err) {
        console.error('setData_数据上报错误:', err, content, value);
    }
}


/**
 * @name: changeVisible
 * @description: 组件可视状态修改
 * @authors: CZH
 * @Date: 2022-08-17 20:07:07
 * @param {object} content
 * @param {object} value
 */
export const changeVisible = (content: { [key: string]: any }, value: { [key: string]: Boolean }) => {
    if (!checkContext(content, value)) return;
    try {
        let func = content['$emit'] ? '$emit' : 'emit';
        let data = {} as gridCellOptions;
        Object.keys(value).map((name: string) => {
            data[name] = {
                options: { showInGridDesktop: value[name] }
            }
        })
        content[func]('onChange', data, {
            type: [
                cardOnChangeType.cardConfigChange
            ]
        })
    } catch (err) {
        console.error('changeVisible 错误:', err, content, value);
    }
}

/**
 * @name: changeCardPosition
 * @description: 使用组件名称修改组件位置
 * @authors: CZH
 * @Date: 2022-08-17 21:01:15
 * @param {object} content
 * @param {object} value
 */
export const changeCardPosition = (content: { [key: string]: any }, value: { [key: string]: gridPositionCell }) => {
    if (!checkContext(content, value)) return;
    try {
        let func = content['$emit'] ? '$emit' : 'emit';
        let data = {} as gridCellOptions;
        Object.keys(value).map((name: string) => {
            data[name] = {
                gridInfo: {
                    default: {
                        position: value[name]
                    }
                }
            }
        })
        content[func]('onChange', data, {
            type: [
                cardOnChangeType.cardConfigChange
            ]
        })
    } catch (err) {
        console.error('changeVisible 错误:', err, content, value);
    }
}


/**
 * @name: changeCardPosition
 * @description: 使用组件名称修改组件Size
 * @authors: CZH
 * @Date: 2022-08-17 21:01:15
 * @param {object} content
 * @param {object} value
 */
export const changeCardSize = (content: { [key: string]: any }, value: { [key: string]: gridSizeCell }) => {
    if (!checkContext(content, value)) return;
    try {
        let func = content['$emit'] ? '$emit' : 'emit';
        let data = {} as gridCellOptions;
        Object.keys(value).map((name: string) => {
            data[name] = {
                gridInfo: {
                    default: {
                        size: value[name]
                    }
                }
            }
        })
        content[func]('onChange', data, {
            type: [
                cardOnChangeType.cardConfigChange
            ]
        })
    } catch (err) {
        console.error('changeVisible 错误:', err, content, value);
    }
}
