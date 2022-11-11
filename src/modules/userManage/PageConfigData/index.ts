
/*
 * @Date: 2022-08-15 23:37:57
 * @LastEditors: CZH
 * @LastEditTime: 2022-11-11 16:28:45
 * @FilePath: /configforpagedemo/src/modules/userManage/PageConfigData/index.ts
 */

import { mainDesktop } from './main';
import { gridCellTemplate } from '@/components/basicComponents/grid/module/dataTemplate';
import { isValidKey } from '@/utils/index';

export interface desktopDataTemplate {
    desktopData?: gridCellTemplate[],
    gridColNum?: number,
    cusStyle?: {
        wholeScreen: boolean;
        maxRows: number;
        margin: number;
    }
}


const pageConfig = {
    user: {
        name:'用户管理',
        desktopData: mainDesktop,
        gridColNum: 12,
        cusStyle: {
            wholeScreen: true,
            maxRows: 8,
            margin: 12
        },
    },
    department: {
        name:'部门管理',
        desktopData: mainDesktop,
        gridColNum: 12,
        cusStyle: {
            wholeScreen: true,
            maxRows: 8,
            margin: 12
        },
    },
} as { [key: string]: desktopDataTemplate }



let Page = {} as {
    [key: string]: desktopDataTemplate
}

Object.keys(pageConfig).map((key: string) => {
    if (isValidKey(key, pageConfig))
        Page[String(key).toUpperCase()] = pageConfig[key] as desktopDataTemplate
})

export const PageConfig = { ...Page }