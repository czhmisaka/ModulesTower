import { CardComponentTemplate } from '../dataTemplate';
/*
 * @Date: 2022-11-01 14:48:06
 * @LastEditors: CZH
 * @LastEditTime: 2022-11-01 15:37:05
 * @FilePath: /configforpagedemo/src/components/basicComponents/grid/module/interface/module.ts
 */






export interface moduleOutputInfoTemplate {
    package: { [key: string]: any },
    moduleInfo: {
        name: string
        [key: string]: any
    },
    componentLists: { [key: string]: CardComponentTemplate }
    Api: any[]
}



export default {}