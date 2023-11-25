/*
 * @Date: 2023-08-10 20:54:22
 * @LastEditors: CZH
 * @LastEditTime: 2023-09-25 20:17:31
 * @FilePath: /lcdp_fe_setup/src/modules/knowledge/component/template/useAbleComponents.tsx
 */

import { iconType, stringAnyObj, tableCellTemplate } from "@/modules/userManage/types";
import { baseComponents } from "./componentsList/baseComponents";
import { getAction } from "@/router/util";
import { gridDesktopComponents } from "./componentsList/gridDesktopComponents";
import { deepClone } from '@/components/basicComponents/grid/module/cardApi/deepClone';

export const base = () => {
    return {
        gridColNum: 12,
        cusStyle: {
            wholeScreen: true,
            maxRows: 8,
            margin: 6,
        },
        componentLists: getAction().getAllComponents(),
    }
}



export const makeComponents = (target: tableCellTemplate, options: tableCellTemplate) => {
    return {
        ...target,
        input: {
            ...options.input,
            ...target.input,
            extraOptions: options.input.extraOptions || {},
            inputOptions: options.input.inputOptions || {},
            description: options.input.description
        },
        label: options.label,
        key: options.key
    } as tableCellTemplate
}


export interface useAbleComponentsCellTemplate {
    name: string;
    icon: iconType;
    tableCellMaker: tableCellTemplate;
    componentPropsTemplate: tableCellTemplate[];
    dealFunc?: (data: stringAnyObj, key: string, schema?: stringAnyObj) => any
}

export interface useAbleComponentsCellModuleTemplate {
    name: string;
    icon: iconType;
    componentslist: useAbleComponentsCellTemplate[]
}



export const useAbleComponents = [baseComponents, gridDesktopComponents] as useAbleComponentsCellModuleTemplate[];


export const baseDealFunc = (data, key) => data[key]

export interface inUseModulesComponent extends tableCellTemplate {
    __name: string;
    __key: string;
}


// 数据输入输出转换
export const getDataFromUseAbleComponentsModule = (
    data: stringAnyObj, componentList: inUseModulesComponent[], schema?: stringAnyObj
) => {

    // 数据预备
    let componentStorage = {}
    let backData = deepClone(data)

    useAbleComponents.map(x => {
        x.componentslist.map(x => {
            componentStorage[x.name] = x.dealFunc ? x.dealFunc : baseDealFunc
        })
    })
    console.log(componentStorage, 'fuck', componentList)
    componentList.map((comp: inUseModulesComponent) => {
        if (Object.keys(componentStorage).indexOf(comp.__name) > -1) {
            let dealFuncComp = componentStorage[comp.__name]
            backData[comp.key] = dealFuncComp(data, comp.key, schema[comp.key])
        }
    })

    return backData
}


export const getUseAbleComponents = (name: string) => {
    for (let i = 0; i < useAbleComponents.length; i++) {
        for (let c = 0; c < useAbleComponents[i].componentslist.length; c++) {
            if (useAbleComponents[i].componentslist[c].name === name) return useAbleComponents[i].componentslist[c]
        }
    }
}