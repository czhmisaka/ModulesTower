/*
 * @Date: 2022-04-28 22:29:05
 * @LastEditors: CZH
 * @LastEditTime: 2022-05-22 18:11:17
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
                iconOption: {
                    size: 300
                },
            },
        }).setPosition(1, 0).setSize(1, 1),

    gridCellMaker('editable', '编辑', {}, {
        name: 'setting_editable',
        type: cardComponentType.componentList
    }, {
        isSettingTool: true
    }).setPosition(2, 0).setSize(1, 1),
    gridCellMaker('elcard', '卡片', {}, {
        name: 'elcard',
        type: cardComponentType.componentList
    }, {
        props: {
            title:'洪都拉斯,荔枝兰',
            content: '口味偏酸,香气非常的浓郁,入口就能感受果香味',
            img:'https://storage.inewsdb.com/268963341081de7c525437a6bdba1e17.jpg',
        }
    }).setPosition(2, 1).setSize(4, 4)
]