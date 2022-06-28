/*
 * @Date: 2022-05-06 09:09:06
 * @LastEditors: CZH
 * @LastEditTime: 2022-06-27 22:02:19
 * @FilePath: /configforpagedemo/src/components/basicComponents/grid/module/gridCard/module/componentLists.ts
 */
import { defineAsyncComponent } from 'vue';
import { cardComponentMaker, inputType, gridSizeMaker, CardComponentTemplate } from './../../dataTemplate'
export const componentLists: { [key: string]: CardComponentTemplate } = {
    'iconCell': cardComponentMaker(defineAsyncComponent(() => import('@/components/basicComponents/cell/icon/iconCell.vue')), {
        name: {
            label: '标签名称',
            type: inputType.text,
        },
    }, {}, {
        label: 'Icon',
        labelNameCN: '图标',
        key: 'iconCell',
        description: '输入图标名称,展示对应图标,基于ElementPlus的图标库',
        gridInfo: {
            small: gridSizeMaker(1, 1),
        }
    }),
    'icon': cardComponentMaker(defineAsyncComponent(() => import('@/components/basicComponents/cell/icon/icon.vue')), {
        name: {
            label: '图标名称',
            type: inputType.text,
        },
        onClickFunc: {
            label: '触发事件',
            type: inputType.text,
        }
    }, {
        onClickFunc: () => { alert('icon点击事件触发') },
    }, {
        label: 'Icon',
        labelNameCN: '图标触发器',
        key: 'icon',
        description: '输入图标名称,展示对应图标,基于ElementPlus的图标库,点击时触发对应自定义事件',
        gridInfo: {
            small: gridSizeMaker(1, 1),
        }
    }),
    'cardCell': cardComponentMaker(defineAsyncComponent(() => import('@/components/basicComponents/cell/card/cardCell.vue')), {}, {}, {
        label: 'cardCell',
        labelNameCN: '卡片',
        key: 'cardCell',
        description: '卡片背景',
        gridInfo: {
            small: gridSizeMaker(1, 1),
        }
    }),
    'setting_editable': cardComponentMaker(defineAsyncComponent(() => import('@/components/basicComponents/grid/module/baseToolComponents/editable.vue')), {}, {}, {
        label: 'EditSwitch',
        labelNameCN: '编辑开关',
        key: 'setting_editable',
        description: '编辑开关',
        gridInfo: {
            small: gridSizeMaker(1, 1),
        }
    }),
    'elcard': cardComponentMaker(defineAsyncComponent(() => import('@/components/basicComponents/cell/info/infoCard.vue')), {
        title: {
            label: '标题',
            type: inputType.text,
        },
        content: {
            label: '内容',
            type: inputType.text,
        },
        img: {
            label: '图片',
            type: inputType.text,
        },
        isBlack: {
            label: '是否黑色背景',
            type: inputType.boolean
        }
    }, {}, {
        label: 'InfoCard',
        labelNameCN: '信息卡片',
        key: 'elcard',
        description: '信息卡片',
        gridInfo: {
            small: gridSizeMaker(2, 2),
            middle: gridSizeMaker(3, 4),
            large: gridSizeMaker(4, 6),
        }
    }),
    'iframe': cardComponentMaker(defineAsyncComponent(() => import('@/components/basicComponents/cell/info/iframe.vue')), {
        url: {
            label: '网页链接',
            type: inputType.text,
        }
    }, {}, {
        label: 'Iframe',
        labelNameCN: '网页',
        key: 'iframe',
        description: '网页',
        gridInfo: {
            small: gridSizeMaker(6, 4),
            middle: gridSizeMaker(9, 6),
            large: gridSizeMaker(12, 8)
        }
    }),
}