/*
 * @Date: 2022-04-29 14:11:20
 * @LastEditors: CZH
 * @LastEditTime: 2022-04-30 11:02:45
 * @FilePath: /configforpagedemo/src/router/util.ts
 */
import { menuInfoTemplate } from "./../components/menu/menuConfigTemplate";
import { RouteRecordRaw } from 'vue-router';

/**
 * @name: metaInfoTemplate
 * @description: 路由meta数据控制
 * @authors: CZH
 * @Date: 2022-04-29 14:45:01
 */
export interface metaInfoTemplate {
    menuInfo: {
        asideMenu: boolean | Array<menuInfoTemplate>,
        headerMenu: boolean | Array<menuInfoTemplate>,
    },
    options: {
        [key: string]: any
    }
}

export const noAsideMenu = (options: { [key: string]: any } = {}): metaInfoTemplate => {
    return {
        menuInfo: {
            asideMenu: false,
            headerMenu: true,
        },
        options,
    }
}
export const noMenu = (options: { [key: string]: any } = {}): metaInfoTemplate => {
    return {
        menuInfo: {
            asideMenu: false,
            headerMenu: false,
        },
        options,
    }
}


/**
 * @name: routerCellMaker
 * @description: 路由单元构建函数
 * @authors: CZH
 * @Date: 2022-04-29 14:49:39
 */
export const routerCellMaker = (
    path: string,
    name: string,
    component: any,
    meta: metaInfoTemplate,
    options: { [key: string]: any } = {},
): RouteRecordRaw => {
    let routerCell: RouteRecordRaw = {
        path,
        name,
        component,
        meta: {
            ...meta,
            options,
        }
    }
    return routerCell;
}

export default {}