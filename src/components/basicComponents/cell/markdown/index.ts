/*
 * @Date: 2022-10-10 22:20:52
 * @LastEditors: CZH
 * @LastEditTime: 2022-10-11 10:35:59
 * @FilePath: /configforpagedemo/src/components/basicComponents/cell/markdown/index.ts
 */

import { cardComponentMaker, inputType, gridSizeMaker, CardComponentTemplate } from "../../grid/module/dataTemplate"
import { defineAsyncComponent } from 'vue';

export const componentsList: { [key: string]: CardComponentTemplate } = {
    markedPage: cardComponentMaker(defineAsyncComponent(() => import('./markedPage/index.vue')), {}, {}, {
        label: 'markedPage',
        labelNameCN: 'markdown文件展示',
        key: 'markedPage',
        description: '获取markedPage并展示',
        gridInfo: {
            small: gridSizeMaker(4, 4),
        }
    })
}


export default {}