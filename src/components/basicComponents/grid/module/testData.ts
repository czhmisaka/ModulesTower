/*
 * @Date: 2022-04-28 22:29:05
 * @LastEditors: CZH
 * @LastEditTime: 2022-05-12 18:19:39
 * @FilePath: /configforpagedemo/src/components/basicComponents/grid/module/testData.ts
 */

import { h, defineComponent } from "vue";
import { gridCellMaker, gridSizeMaker, cardComponentType } from "./dataTemplate";
import { ElButton, ElInput, ElTable, ElTableColumn } from 'element-plus'

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
            children: h(ElTable, {}, () => [
                () => h(ElTableColumn, {}, [])
            ])
        }),
    gridCellMaker('cardCell', '卡片容器 测试1', {
        large: gridSizeMaker(4, 4)
    },
        {
            name: 'cardCell',
            type: cardComponentType.componentList
        }
        , {
            children: h(defineComponent({
                setup() {
                    return () => h('div', {}, [
                        h(ElButton, { type: 'danger' }, () => [h('span', '测试按钮')]),
                        h(ElInput, {
                            placeholder: '请输入内容',
                        })
                    ])
                }
            }))
        })
]