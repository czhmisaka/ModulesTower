/*
 * @Date: 2022-04-28 22:29:05
 * @LastEditors: CZH
 * @LastEditTime: 2022-04-30 14:29:59
 * @FilePath: /configforpagedemo/src/components/basicComponents/grid/module/testData.ts
 */


import { gridCellMaker, gridSizeMaker } from "./dataTemplate";


export const testData = [
    gridCellMaker('icon', {
        small: gridSizeMaker(1, 1),
        large: gridSizeMaker(4, 4)
    }, {})
]
export default {}