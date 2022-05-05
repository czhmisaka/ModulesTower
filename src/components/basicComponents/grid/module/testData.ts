/*
 * @Date: 2022-04-28 22:29:05
 * @LastEditors: CZH
 * @LastEditTime: 2022-05-05 08:57:11
 * @FilePath: /configforpagedemo/src/components/basicComponents/grid/module/testData.ts
 */


import { gridCellMaker, gridSizeMaker } from "./dataTemplate";
import { defineAsyncComponent } from 'vue';

export const testData = [
    gridCellMaker('iconCell', '标签装饰', {
        small: gridSizeMaker(1, 1),
        large: gridSizeMaker(4, 4)
    },
        defineAsyncComponent(() => import('@/components/basicComponents/cell/icon/iconCell.vue'))
        , {
            props: {
                name: 'Aim',
                iconOption: {},
            },
        })
]