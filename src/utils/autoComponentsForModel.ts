/*
 * @Date: 2022-10-25 16:39:47
 * @LastEditors: CZH
 * @LastEditTime: 2022-10-31 14:52:35
 * @FilePath: /configforpagedemo/src/utils/autoComponentsForModel.ts
 */


import { CardComponentTemplate } from '../components/basicComponents/grid/module/dataTemplate';



let moduleComponentList = {} as { [key: string]: { [key: string]: CardComponentTemplate } }

const componentsFiles = require.context('@/modules/', true, /component\/index.ts$/)

componentsFiles.keys().map((componentsName: string) => {
    moduleComponentList = {
        ...moduleComponentList,
        ...componentsFiles(componentsName)
    }
})

export const ModuleComponentList = { ...moduleComponentList }