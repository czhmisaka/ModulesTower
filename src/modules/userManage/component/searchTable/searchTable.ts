/*
 * @Date: 2022-11-10 08:56:53
 * @LastEditors: CZH
 * @LastEditTime: 2022-11-10 14:16:24
 * @FilePath: /configforpagedemo/src/modules/userManage/component/searchTable/searchTable.ts
 */



/**
 * @name: searchCellStorage
 * @description: 表单元素存储库构建工具
 * @authors: CZH
 * @Date: 2022-11-10 09:33:04
 */
export class SearchCellStorage {
    storage = []
    constructor(storage) {
        this.storage = storage;
    }
    getByLabel(label: string) {
        let back = {} as { [key: string]: any };
        this.storage.map((cell) => {
            if (label && label == cell.label) back = cell;
        })
        if (!back.label) return {
            label: `-${label}-`,
            prop: `no_label_${Math.random()}`
        }
        return back
    }
}


/**
 * @name: 表格单元配置
 * @description: tableCellOptions
 * @authors: CZH
 * @Date: 2022-11-10 09:30:21
 */
export interface tableCellOptions {
    label?: string,
    key?: string,
    [key: string]: any
}

/**
 * @name: tableCellTemplate
 * @description: 表格单元
 * @authors: CZH
 * @Date: 2022-11-10 09:52:01
 */
export interface tableCellTemplate {

}


/**
 * @name: tableCellTemplateMaker
 * @description: 表单构建模块
 * @authors: CZH
 * @Date: 2022-11-10 09:17:52
 * @param {string} label
 * @param {string} key
 * @param {tableCellOptions} options
 */
export const tableCellTemplateMaker = (label: string, key: string, options: tableCellOptions = {}) => {
    return {
        label,
        key,
        ...options
    }
}

