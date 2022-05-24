/*
 * @Date: 2022-05-06 09:09:06
 * @LastEditors: CZH
 * @LastEditTime: 2022-05-25 00:06:20
 * @FilePath: /configforpagedemo/src/components/basicComponents/grid/module/gridCard/module/componentLists.ts
 */
import { defineAsyncComponent, defineComponent, h } from 'vue';
import { cardComponentMaker, inputType } from './../../dataTemplate'
export const componentLists: { [key: string]: any } = {
    'iconCell': cardComponentMaker(defineAsyncComponent(() => import('@/components/basicComponents/cell/icon/iconCell.vue')), {
        icon: {
            label: '标签名称',
            type: inputType.text,
        }
    }, {}),
    'cardCell': cardComponentMaker(defineAsyncComponent(() => import('@/components/basicComponents/cell/card/cardCell.vue')), {}, {}),
    'setting_editable': cardComponentMaker(defineAsyncComponent(() => import('@/components/basicComponents/grid/module/baseToolComponents/editable.vue')), {}, {}),
    'elcard': cardComponentMaker(defineAsyncComponent(() => import('@/components/basicComponents/cell/info/infoCard.vue')), {
        title:{
            label: '标题',
            type: inputType.text,
        },
        content:{
            label: '内容',
            type: inputType.text,
        },
        img:{
            label: '图片',
            type: inputType.text,
        },
        isBlack:{
            label: '是否黑色背景',
            type: inputType.text
        }
    }, {}),
    'iframe': cardComponentMaker(defineAsyncComponent(() => import('@/components/basicComponents/cell/info/iframe.vue')), {
        url: {
            label: '网页链接',
            type: inputType.text,
        }
    }, {}),
}