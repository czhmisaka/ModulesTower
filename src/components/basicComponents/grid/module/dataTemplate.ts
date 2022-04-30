/*
 * @Date: 2022-04-28 22:20:23
 * @LastEditors: CZH
 * @LastEditTime: 2022-04-29 15:23:38
 * @FilePath: /configforpagedemo/src/components/basicComponents/grid/module/dataTemplate.ts
 */

import { hide } from "@popperjs/core";




export const gridSizeConfig = (size: gridInfo_SizeType = gridInfo_SizeType.middle): gridSize => {
    const gridInfo_SizeTypeToGridSize = {
        small: gridSizeMaker(1, 1),
        middle: gridSizeMaker(2, 2),
        large: gridSizeMaker(4, 2),
    }
    return gridInfo_SizeTypeToGridSize[size];
}
export enum gridInfo_SizeType {
    small = 'small',
    middle = 'middle',
    large = 'large',
}

export interface gridSize {
    width: number,
    height: number
}
export const gridSizeMaker = (width = 1, height = 1): gridSize => {
    return {
        width,
        height,
    }
}

export interface gridInfo {
    size: gridSize,
    style?: object,
    cusClass?: string,
}

export interface gridCell {
    label: string,
    key: string,
    gridInfo: gridInfo,
}


export const gridCellMaker = (label: string, gridInfo: gridInfo): gridCell => {
    let gridCell = {
        label,
        key: label,
        gridInfo,
    }
    return gridCell;
}