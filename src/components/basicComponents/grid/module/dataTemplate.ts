/*
 * @Date: 2022-04-28 22:20:23
 * @LastEditors: CZH
 * @LastEditTime: 2022-05-21 15:43:44
 * @FilePath: /configforpagedemo/src/components/basicComponents/grid/module/dataTemplate.ts
 */


import { cardUtil } from "./util";
export enum cardOnChangeType {
    upOnChange = 'upOnChange',
    onChange = 'onChange',
    forceRefresh = 'forceRefresh',
    gridCardListonChange = 'gridCardListonChange',
}



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
    [key: string]: any
}


/**
 * @name: cardComponentType
 * @description: 组件加载方式
 * @authors: CZH
 * @Date: 2022-05-16 18:43:10
 */
export enum cardComponentType {
    componentList = 'componentList',
    fromData = 'fromData', // 不推荐使用data保存组件
    cusComponent = 'cusComponent', // 使用自定义组件
}


/**
 * @name: inputType
 * @description: 输入类型
 * @authors: CZH
 * @Date: 2022-05-19 14:38:50
 */
export enum inputType {
    text = 'text',
    number = 'number',
    numberSlider = 'numberSlider',
}

export interface CardComponentTemplate {
    name?: string,
    settngDetail: {
        props?: {
            [key: string]: {
                type: inputType,
                localData?: {
                    [key: string]: any,
                }
            }
        },
        baseProps?: {
            [key: string]: any,
        },
        [key: string]: any
    },
    component: any,
    [key: string]: any,
}

/**
 * @name: cardComponentMaker
 * @description: 可用组件生成器
 * @authors: CZH
 * @Date: 2022-05-19 14:06:02
 */
export const cardComponentMaker = (
    component: any,
    props: {
        [key: string]: {
            type: inputType,
            localData?: {
                [key: string]: any,
            }
        }
    },
    baseProps: { [key: string]: any },
): CardComponentTemplate => {
    let cardComponent = {
        settngDetail: {
            props,
            baseProps,
        },
        component,
    } as CardComponentTemplate;
    return cardComponent;
}



/**
 * @name: cardComponent
 * @description: waitForWriting
 * @authors: CZH
 * @Date: 2022-05-19 16:00:11
 */
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
                    x: 0,
                    y: 0,
                },
            },
            size: {
                middle: gridSizeMaker(2, 2),
                ...size,
            }
        }
    }
    gridCell.gridInfo.default.size = gridCell.gridInfo.size.middle;
    for (let key in cardUtil) {
        gridCell[key] = cardUtil[key]
    }
    return gridCell;
}