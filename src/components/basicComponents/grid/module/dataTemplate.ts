/*
import { gridCellTemplate } from './dataTemplate';
 * @Date: 2022-04-28 22:20:23
 * @LastEditors: CZH
 * @LastEditTime: 2022-05-05 00:02:21
 * @FilePath: /configforpagedemo/src/components/basicComponents/grid/module/dataTemplate.ts
 */



export const gridSizeConfig = (size: gridInfo_SizeType = gridInfo_SizeType.middle): gridSizeCell => {
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

export interface gridSizeCell {
    width: number,
    height: number,
    [key: string]: any
}


export const gridSizeMaker = (width = 1, height = 1, options: { [key: string]: any } = {}): gridSizeCell => {
    return {
        width,
        height,
        ...options
    }
}
export interface gridCellTemplate {
    label: string,
    labelNameCN: string,
    key: string,
    gridInfo: {
        default: {
            position: {
                x: number,
                y: number,
            },
            size?: gridSizeCell,
        },
        size: {
            middle: gridSizeCell,
            [key: string]: gridSizeCell
        }
    },
    func?: {
        setSize?: (size: gridSizeCell) => void,
        setPosition?: (position: { x: number, y: number }) => void,
        [key: string]: any
    },
    component:any,
    options?: {
        props?: {
            [key: string]: any,
        },
        [key: string]: any
    },
    data?: {
        methods: {

        },
        params: {

        }
    },
}


/**
 * @name: 函数名
 * @description: waitForWriting
 * @authors: CZH
 *  @Date: 2022-04-30 14:25:29
 * @param {string} label
 * @param {object} size
 * @param {object} options
 */
export const gridCellMaker = (label: string, labelNameCN: string, size: { [key: string]: gridSizeCell } = {}, component: any, options: { [key: string]: any }): gridCellTemplate => {
    let gridCell: gridCellTemplate = {
        label,
        labelNameCN,
        key: label,
        options,
        component,
        gridInfo: {
            default: {
                position: {
                    x: 1,
                    y: 1,
                },
            },
            size: {
                middle: gridSizeMaker(2, 2),
                ...size,
            }
        }
    }
    return gridCell;
}