/*
 * @Date: 2022-04-28 22:20:23
 * @LastEditors: CZH
 * @LastEditTime: 2022-04-28 23:05:57
 * @FilePath: /configforpagedemo/src/components/basicComponents/grid/module/dataTemplate.ts
 */


export enum gridInfo_Size {
    small = 'small',
    middle = 'middle',
    large = 'large',
}


export interface gridInfo {
    size: gridInfo_Size | Array<number>,
    style?: object,
    cusClass?: string,
}

export interface gridCell {
    label: string,
    key: string,
    gridInfo: gridInfo,
}


export const gridCellMaker = (label:string,gridInfo:gridInfo): gridCell => {
    let gridCell = {
        label,
        key: label,
        gridInfo,
    }
    return gridCell;
}