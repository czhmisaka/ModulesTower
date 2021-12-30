/*
 * @Date: 2021-12-30 19:54:50
 * @LastEditors: CZH
 * @LastEditTime: 2021-12-30 21:01:30
 * @FilePath: /configforpagedemo/src/config/pageConfigs/index.ts
 */




import utils from "@/utils";
import { searchOptions } from "@/utils/ImportModule";

let modules: Array<any> = []
let pathList: Array<searchOptions> = []

pathList.push({
    src: './',
})
modules = modules.concat(utils.searchModulesByPath(pathList))


export default {
    ...modules
}