/*
 * @Date: 2022-05-06 09:09:06
 * @LastEditors: CZH
 * @LastEditTime: 2022-11-21 18:41:18
 * @FilePath: /configforpagedemo/src/components/basicComponents/grid/module/gridCard/module/componentLists.ts
 */
import { defineAsyncComponent } from 'vue';
import { cardComponentMaker, inputType, gridSizeMaker, CardComponentTemplate } from './../../dataTemplate'



export const componentLists: { [key: string]: CardComponentTemplate } = {
    'iconCell': cardComponentMaker(defineAsyncComponent(() => import('@/components/basicComponents/cell/icon/iconCell.vue')), {
        name: {
            label: '标签',
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
            type: inputType.functionEditor,
        },
        tips: {
            label: '提示标签',
            type: inputType.text
        }
    }, {
        name: 'Position',
        onClickFunc: (content: any) => {
            const { props, context, e } = content;
            console.log(props, context, e)
        },
    }, {
        label: 'IconButton',
        labelNameCN: '图标触发器',
        key: 'icon',
        description: '输入图标名称,展示对应图标,基于ElementPlus的图标库,点击时触发对应自定义事件',
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
    }, {
        title:'标题',
        content:'内容文本',
        img:'https://img1.baidu.com/it/u=4240725319,2204124531&fm=253&fmt=auto&app=120&f=JPEG?w=1422&h=800',
        isBlack:true
    }, {
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
    'userLogin': cardComponentMaker(defineAsyncComponent(() => import('@/components/userInfo/login.vue')), {
    }, {
    }, {
        label: 'userLogin',
        labelNameCN: '用户登录',
        key: 'userLogin',
        description: '一个用户登录用组件',
        gridInfo: {
            small: gridSizeMaker(4, 2),
        }
    }),
    'GridDesktop': cardComponentMaker(defineAsyncComponent(() => import('@/components/basicComponents/grid/gridDesktop.vue')), {
        cusStyle: {
            label: '自定义样式',
            type: inputType.obj
        },
        editable: {
            label: '编辑状态',
            type: inputType.boolean
        },
        gridColNum: {
            label: '渲染列数',
            type: inputType.number
        },
        desktopData: {
            label: '组件载入列表',
            type: inputType.obj
        }
    }, {}, {
        label: 'GridDesktop',
        labelNameCN: '扩展桌面组件',
        key: 'GridDesktop',
        description: '一个扩展桌面，需要载入组件后，提供桌面内的数据交互',
        gridInfo: {
            small: gridSizeMaker(6, 4),
            middle: gridSizeMaker(9, 6),
            large: gridSizeMaker(12, 8)
        }
    }),

    'cardApiControler': cardComponentMaker(defineAsyncComponent(() => import('@/components/basicComponents/cell/action/cardApiControler.vue')), {}, {}, {
        label: 'cardApiControler',
        labelNameCN: 'cardApi调用大师',
        key: 'cardApiControler',
        description: '用来主动触发不同的cardApi的组件',
        gridInfo: {
            small: gridSizeMaker(6, 4),
            middle: gridSizeMaker(9, 6),
            large: gridSizeMaker(12, 8)
        }
    }),
    'DynamicIsland': cardComponentMaker(defineAsyncComponent(() => import('@/components/basicComponents/cell/info/DynamicIsland.vue')), {
        info: {
            label: '信息（一般不支持手填）',
            type: inputType.text
        },
        size: {
            label: '确定灵动岛的所在位置和尺寸',
            type: inputType.text
        },
    }, {}, {
        label: 'DynamicIsland',
        labelNameCN: '灵动岛岛',
        key: 'DynamicIsland',
        description: '用来展示信息',
        gridInfo: {
            small: gridSizeMaker(1, 1),
        }
    }),
    'infoFile': cardComponentMaker(defineAsyncComponent(() => import('@/components/basicComponents/cell/info/infoFile/infoFile.vue')), {}, {}, {
        label: 'infoFile',
        labelNameCN: '文件信息块',
        key: 'infoFile',
        description: '用来展示信息',
        gridInfo: {
            small: gridSizeMaker(1, 1),
        }
    }),
    
}