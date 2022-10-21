/*
 * @Date: 2022-04-29 14:11:20
 * @LastEditors: CZH
 * @LastEditTime: 2022-10-21 09:06:35
 * @FilePath: /configforpagedemo/src/router/util.ts
 */
import { menuInfoTemplate } from "./../components/menu/menuConfigTemplate";
import { RouteRecordRaw } from 'vue-router';
import { CardComponentTemplate } from '../components/basicComponents/grid/module/dataTemplate';

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

export interface modulesCell {
    name: string,
    path: string,
    components: CardComponentTemplate[],
    baseInfo?: {
        info: string,
        output?: boolean,
        authorize?: string
        fitScreenSize?: string
    },
}

export const getModuleFromView = () => {
    let moduleList = [] as modulesCell[]
    const requireModule = require.context(
        '@/modules/',
        true,
    )
    requireModule.keys().map((fileName: string) => {
        console.log(fileName, 'asd')
        if (fileName.split('/').length == 2) {
            moduleList.push({
                name: fileName.split('./')[1],
                path: fileName,
                components: []
            })
        }
    })
    return moduleList
}

export default {}