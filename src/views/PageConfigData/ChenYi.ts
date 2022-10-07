/*
 * @Date: 2022-10-06 23:41:41
 * @LastEditors: CZH
 * @LastEditTime: 2022-10-07 11:36:09
 * @FilePath: /configforpagedemo/src/views/PageConfigData/ChenYi.ts
 */







import { gridCellMaker, gridSizeMaker, cardComponentType, cardOnChangeType, gridCellTemplate } from "@/components/basicComponents/grid/module/dataTemplate"
import { changeVisible, changeCardSize, changeCardPosition, changeCardProperties } from "@/components/basicComponents/grid/module/cardApi/index";
import { setPosition, setSize } from '../../components/basicComponents/grid/module/util';

import { infoTemplate, infoType } from '@/components/basicComponents/cell/info/DynamicIsland'


let fucker = false;
let fuckerMoon = false;
export const ChenYi = [
   
   
    gridCellMaker('elcard1', '卡片', {}, {
        name: 'elcard',
        type: cardComponentType.componentList
    }, {
        props: {
            isBlack: false,
            // content: '-- 来自浙江石浦',
            img: '/img/dada.jpeg',
        },
    }).setPosition(0, 0.5).setSize(4, 6.5),
   
    // gridCellMaker('DynamicIsland', '灵动岛岛', {}, {
    //     name: 'DynamicIsland',
    //     type: cardComponentType.componentList
    // }, {
    //     props: {
    //         info: [],
    //         size: {
    //             x: 2,
    //             y: 0.25,
    //             width: 0,
    //             height: 0.5,
    //             maxWidth: 4,
    //             maxHeight: 2
    //         }
    //     },
    // }),
    // gridCellMaker('sendMessage', '发送信息', {}, {
    //     type: cardComponentType.componentList,
    //     name: 'icon'
    // }, {
    //     props: {
    //         name: 'Sunrise',
    //         onClickFunc: (content: any) => {
    //             const { context } = content;
    //             let info = {
    //                 message: '陈宜',
    //                 type: infoType.message,
    //                 time: 10,
    //             } as infoTemplate
    //             changeCardProperties(context, {
    //                 DynamicIsland: {
    //                     info: [info]
    //                 }
    //             })
    //         }
    //     },
    // }).setPosition(1.5, 7.5).setSize(1, 1),
] as gridCellTemplate[]