/*
 * @Date: 2022-04-28 22:29:05
 * @LastEditors: CZH
 * @LastEditTime: 2022-05-06 20:32:20
 * @FilePath: /configforpagedemo/src/components/basicComponents/grid/module/testData.ts
 */


import { gridCellMaker, gridSizeMaker, cardComponentType } from "./dataTemplate";

export const testData = [
    gridCellMaker('iconCell', '标签装饰', {
        small: gridSizeMaker(1, 1),
        large: gridSizeMaker(4, 4)
    },
        {
            name: 'iconCell',
            type: cardComponentType.componentList
        }
        , {
            props: {
                name: 'Aim',
                iconOption: {},
            },
        })
]