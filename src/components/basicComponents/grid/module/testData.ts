/*
 * @Date: 2022-04-28 22:29:05
 * @LastEditors: CZH
 * @LastEditTime: 2022-05-10 14:29:09
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
            slots: () => h(ElTable,{},[
                h(ElTableColumn,{},[])
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
            slots: () =>
                h(defineComponent({
                    setup() {
                        return () => h('div', {}, ['这是一个卡片',
                            h(ElButton, { type: 'danger' },'测试按钮'),
                            h(ElInput,{
                                placeholder:'请输入内容',
                            },'')
                        ])
                    }
                }))
        })
]