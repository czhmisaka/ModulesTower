/*
 * @Date: 2022-04-28 22:29:05
 * @LastEditors: CZH
 * @LastEditTime: 2022-05-07 21:39:46
 * @FilePath: /configforpagedemo/src/components/basicComponents/grid/module/testData.ts
 */

import { h } from "vue";
import { gridCellMaker, gridSizeMaker, cardComponentType } from "./dataTemplate";
import { ElButton } from 'element-plus'

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
        }),
    gridCellMaker('cardCell', '卡片容器', {
        large: gridSizeMaker(4, 4)
    },
        {
            name: 'cardCell',
            type: cardComponentType.componentList
        }
        , {
            slots: () => h('div', {}, '这是一个卡片')
        }),
    gridCellMaker('cardCell', '卡片容器 测试1', {
        large: gridSizeMaker(4, 4)
    },
        {
            name: 'cardCell',
            type: cardComponentType.componentList
        }
        , {
            slots: () => h(ElButton, {
            }, '这是一个卡片中的按钮')
        })
]