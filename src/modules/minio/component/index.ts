/*
 * @Date: 2022-10-20 21:59:45
 * @LastEditors: CZH
 * @LastEditTime: 2022-10-25 16:47:13
 * @FilePath: /configforpagedemo/src/modules/minio/component/index.ts
 */
import { CardComponentTemplate } from '../../../components/basicComponents/grid/module/dataTemplate';

const componentsFiles = require.context('./', true, /.vue$/)

let componentLists = [] as CardComponentTemplate[]
componentsFiles.keys().map((componentsName: string) => {
    console.log(componentsFiles, 'asd')
})


export default {
    componentLists
}



