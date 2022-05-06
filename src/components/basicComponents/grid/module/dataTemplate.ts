/*
import { gridCellTemplate } from './dataTemplate';
import { defineAsyncComponent } from 'vue';
 * @Date: 2022-04-28 22:20:23
 * @LastEditors: CZH
 * @LastEditTime: 2022-05-06 09:57:47
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
    component: cardComponent | any,
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


export enum cardComponentType {
    componentList = 'componentList',
    fromData = 'fromData', // 不推荐使用data保存组件
    cusComponent = 'cusComponent', // 使用自定义组件
}



export interface cardComponent {
    name: string,
    type: cardComponentType,
    data?: any | string,
    getFunc?: (data: any) => any,
}


export const componentGetter = (component: cardComponent, componentLists: { [key: string]: any }): any => {
    switch (component.type) {
        case cardComponentType.componentList:
            return componentLists[component.name];
        case cardComponentType.fromData:
            return component.data;
        // case cardComponentType.cusComponent:
    }
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
export const gridCellMaker = (label: string, labelNameCN: string, size: { [key: string]: gridSizeCell } = {}, component: cardComponent | any, options: { [key: string]: any }): gridCellTemplate => {
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
    gridCell.gridInfo.default.size = gridCell.gridInfo.size.middle;
    return gridCell;
}