/*
 * @Date: 2021-12-30 16:17:43
 * @LastEditors: CZH
 * @LastEditTime: 2021-12-30 17:23:29
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
    style: String,
    width: String,
    needTranslate: Boolean,
    translateFunc: Function,
};
