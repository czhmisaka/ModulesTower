/*
 * @Date: 2021-12-30 16:17:43
 * @LastEditors: CZH
 * @LastEditTime: 2022-05-07 18:38:21
 * @FilePath: /configforpagedemo/src/utils/cellClass.ts
 */



/**
 * @name: templateCellOptions_elementType
 * @description: 适用于infoCellTemplate的特殊处理字段类型
 * @authors: CZH
 * @Date: 2021-12-30 17:18:49
 */
export enum templateCellOptions_elementType {
    tags,
    keyWords,
    button,
}
/**
 * @name: templateCellOptions
 * @description: 特殊处理方案列表
 * @authors: CZH
 * @Date: 2021-12-30 17:20:58
 */
export interface templateCellOptions {
    elemetType: templateCellOptions_elementType,
    return: Function,
}

/**
 * @name: cellMakerOptions
 * @description: 构建单元
 * @authors: CZH
 * @Date: 2021-12-30 17:21:14
 */
export interface cellMakerOptions {
    style?: string,
    width?: string,
    needTranslate?: boolean,
    translateFunc?: Function,
}


/**
 * @name: infoCell
 * @description: 展示用单元格式
 * @authors: CZH
 * @Date: 2021-12-30 20:34:38
 */
export interface infoCell extends cellMakerOptions {
    key: string,
    value: string,
    prop: string,
    label: string,
    template: Array<templateCellOptions>,
}






/**
 * @name: cellPageModule
 * @description: 可配置模块的页面配置
 * @authors: CZH
 * @Date: 2021-12-30 20:21:31
 */
export interface cellPageModule {
    moduleConfig: {
        pageType: pageType,
        name: string,
        nameEn: string,
        tableName?: String,
    },
    tableColumn: Array<object>,
}

// 页面类型
export enum pageType {
    DETAIL,
    LIST,
}