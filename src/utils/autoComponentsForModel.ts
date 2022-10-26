/*
 * @Date: 2022-10-25 16:39:47
 * @LastEditors: CZH
 * @LastEditTime: 2022-10-26 09:52:53
 * @FilePath: /configforpagedemo/src/utils/autoComponentsForModel.ts
 */


import { CardComponentTemplate } from '../components/basicComponents/grid/module/dataTemplate';



let moduleComponentList = {} as { [key: string]: { [key: string]: CardComponentTemplate } }

const componentsFiles = require.context('@/modules/', true, /component\/index.ts$/)

componentsFiles.keys().map((componentsName: string) => {
    console.log(componentsName, 'asd', componentsFiles(componentsName))
})

export const ModuleComponentList = { ...moduleComponentList }