/*
 * @Date: 2022-01-29 10:11:51
 * @LastEditors: CZH
 * @LastEditTime: 2022-04-29 14:43:42
 * @FilePath: /configforpagedemo/src/components/menu/menuConfigTemplate.ts
 */


export enum menuInfoType {
    Function = 'Function',
    Link = 'link',
    Router = 'router',
}
export interface menuInfoTemplate {
    label: string,
    value: string,
    key?: string,
    icon?: string,
    type: menuInfoType,
    action: {
        Function?: Function,
        Link?: string,
        Router?: any,
    },
    options: {
        [key: string]: any
    }
}

/**
 * @name: menuCellMaker
 * @description: 菜单构建
 * @authors: CZH
 * @Date: 2022-04-29 14:43:34
 */
export const menuCellMaker = (
    label: string,
    value: string,
    type: menuInfoType = menuInfoType.Link, 
    action = {
        Link:'https://www.czht.top'
    },
    options: { [key: string]: any } = {},
    icon = '',
    key = '',
): menuInfoTemplate => {
    let menuCell: menuInfoTemplate = {
        icon,
        label,
        value,
        type,
        key,
        action,
        options,
    }
    return menuCell
}