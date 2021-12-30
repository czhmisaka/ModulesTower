/*
 * @Date: 2021-12-30 15:11:39
 * @LastEditors: CZH
 * @LastEditTime: 2021-12-30 16:29:35
 * @FilePath: /configforpagedemo/src/utils/index.ts
 */
import { cellMakerOptions } from "./cellClass";



export default {
    /**
     * @name: tableCellMaker
     * @description: 构建表格单元
     * @authors: CZH
     * @Date: 2021-12-30 15:18:29
     */
    tableCellMaker: (prop: string, label: string, template: Array<Object>, options: cellMakerOptions) => {
        return {
            prop,
            label,
            template,
            ...options
        }
    },
}
