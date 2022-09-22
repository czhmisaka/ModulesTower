/*
 * @Date: 2022-04-28 22:29:05
 * @LastEditors: CZH
 * @LastEditTime: 2022-09-22 15:10:29
 * @FilePath: /configforpagedemo/src/views/PageConfigData/main.ts
 */

import { gridCellMaker, gridSizeMaker, cardComponentType, cardOnChangeType } from "@/components/basicComponents/grid/module/dataTemplate"
import { changeVisible, changeCardSize, changeCardPosition, changeCardProperties } from "@/components/basicComponents/grid/module/cardApi/index";
import { setSize } from '../../components/basicComponents/grid/module/util';

let fucker = true
export const mainDesktop = [
    gridCellMaker('editable', '编辑', {}, {
        name: 'setting_editable',
        type: cardComponentType.componentList
    }, {
        isSettingTool: true
    }).setPosition(1, 0).setSize(1, 1),
    gridCellMaker('openComponents', '打开组件菜单', {}, {
        type: cardComponentType.componentList,
        name: 'icon'
    }, {
        isSettingTool: true,
        props: {
            name: 'Grid',
            onClickFunc: (content: any) => {
                const { context } = content;
                context.emit('onChange', {}, {
                    type: [cardOnChangeType.openComponentsList]
                })
            }
        },
    }).setPosition(0, 0).setSize(1, 1),
    gridCellMaker('userLogin', '用户登录', {}, {
        type: cardComponentType.componentList,
        name: 'userLogin'
    }, {
        isSettingTool: true,
    }).setPosition(5, 0).setSize(7, 1),
    gridCellMaker('showElcard1', '显示elcard1', {}, {
        type: cardComponentType.componentList,
        name: 'icon'
    }, {
        props: {
            name: 'View',
            onClickFunc: (content: any) => {
                const { context } = content;
                changeVisible(context, {
                    elcard0:true,
                    elcard1: true,
                    elcard2: false,
                    iframe1: true,
                    iframe2: false
                })
            }
        },
    }).setPosition(2, 4).setSize(1, 1),
    gridCellMaker('showElcard2', 'card变换效果', {}, {
        type: cardComponentType.componentList,
        name: 'icon'
    }, {
        props: {
            name: 'ArrowRight',
            onClickFunc: (content: any) => {
                const { context } = content;
                let name = !fucker ? 'ArrowRight' : 'ArrowLeft'
                let posiitionMap = fucker ? {
                    elcard0: {
                        x: 4,
                        y: 0
                    },
                    showElcard2: {
                        x: 6,
                        y: 0
                    },
                    userLogin: {
                        x: 7,
                        y: 0
                    }
                } : {
                    elcard0: {
                        x: 4,
                        y: 1
                    },
                    showElcard2: {
                        x: 4,
                        y: 0
                    },
                    userLogin: {
                        x: 5,
                        y: 0
                    }
                }
                let sizeMap = fucker ? {
                    elcard0: {
                        width: 2,
                        height: 5
                    },
                    userLogin: {
                        width: 5,
                        height: 1
                    }
                } : {
                    elcard0: {
                        width: 2,
                        height: 4
                    },
                    userLogin: {
                        width: 7,
                        height: 1
                    }
                }
                changeCardProperties(context, {
                    showElcard2: {
                        name
                    }
                })
                changeCardPosition(context, posiitionMap)
                changeCardSize(context, sizeMap)
                fucker = !fucker
            }
        },
    }).setPosition(4, 0).setSize(1, 1),
    gridCellMaker('hideElcard1', '隐藏elcard1', {}, {
        type: cardComponentType.componentList,
        name: 'icon'
    }, {
        props: {
            name: 'Close',
            onClickFunc: (content: any) => {
                const { context } = content;
                changeVisible(context, {
                    elcard0:false,
                    elcard1: false,
                    elcard2: true,
                    iframe1: false,
                    iframe2: true
                })
            }
        },
    }).setPosition(3, 4).setSize(1, 1),
    gridCellMaker('elcard1', '卡片', {}, {
        name: 'elcard',
        type: cardComponentType.componentList
    }, {
        props: {
            isBlack: true,
            title: '壁纸',
            content: '--来自鬼刀大佬',
            img: 'https://pic1.zhimg.com/80/v2-b8e48ee4c2efb2813c42c3778743a2c4_1440w.jpg',
        },
    }).setPosition(0, 1).setSize(2, 2),
    gridCellMaker('elcard0', '卡片', {}, {
        name: 'elcard',
        type: cardComponentType.componentList
    }, {
        props: {
            isBlack: true,
            title: '壁纸',
            content: '--来自鬼刀大佬',
            img: 'https://pic1.zhimg.com/80/v2-b8e48ee4c2efb2813c42c3778743a2c4_1440w.jpg',
        },
    }).setPosition(4, 1).setSize(2, 4),
    gridCellMaker('elcard1', '卡片', {}, {
        name: 'elcard',
        type: cardComponentType.componentList
    }, {
        props: {
            isBlack: false,
            title: '壁纸',
            content: '--来自鬼刀大佬',
            img: 'https://images3.alphacoders.com/111/thumb-1920-1111255.jpg',
        }
    }).setPosition(2, 0).setSize(2, 2),
    gridCellMaker('elcard1', '卡片', {}, {
        name: 'elcard',
        type: cardComponentType.componentList
    }, {
        props: {
            isBlack: true,
            title: '壁纸',
            content: '--来自鬼刀大佬',
            img: 'https://images7.alphacoders.com/573/thumb-1920-573701.jpg',
        }
    }).setPosition(2, 2).setSize(2, 2),
    gridCellMaker('elcard1', '卡片', {}, {
        name: 'elcard',
        type: cardComponentType.componentList
    }, {
        props: {
            content: '口味偏酸,香气非常的浓郁,入口就能感受果香味',
            img: 'https://img.alicdn.com/imgextra/i4/2201222687706/O1CN01FVG7iv26nOklVnDQz_!!2201222687706.jpg_q50s50.jpg_.webp    ',
        }
    }).setPosition(0, 3).setSize(2, 2),

    gridCellMaker('elcard2', '卡片', {}, {
        name: 'elcard',
        type: cardComponentType.componentList
    }, {
        props: {
            isBlack: true,
            title: '壁纸',
            content: '--手机壁纸',
            img: 'https://pic1.zhimg.com/v2-5890f6a08281e775a12eaa6edbc1ccb4_r.jpg',
        },
        showInGridDesktop: false,
    }).setPosition(0, 1).setSize(2, 4),
    gridCellMaker('elcard2', '卡片', {}, {
        name: 'elcard',
        type: cardComponentType.componentList
    }, {
        props: {
            isBlack: false,
            title: '壁纸',
            content: '--手机壁纸',
            img: 'https://pic4.zhimg.com/v2-306dbf3946e096bc2c8b03aa0250ad93_r.jpg',
        },
        showInGridDesktop: false,
    }).setPosition(2, 0).setSize(2, 2),
    gridCellMaker('elcard2', '卡片', {}, {
        name: 'elcard',
        type: cardComponentType.componentList
    }, {
        props: {
            isBlack: true,
            title: '壁纸',
            content: '--来自手机壁纸',
            img: 'https://pic4.zhimg.com/v2-53c4046627a3e1e0d8f04d74d965d7eb_r.jpg',
        },
        showInGridDesktop: false,
    }).setPosition(2, 2).setSize(2, 2),

    gridCellMaker('iframe1', '前端导航', {}, {
        name: 'iframe',
        type: cardComponentType.componentList
    }, {
        props: {
            url: 'http://guild.czht.top',
            // url: "http://42.192.134.238:8080/bloom-effect/"
        },
    }).setPosition(6, 1).setSize(6, 4),

    gridCellMaker('iframe2', '前端导航', {}, {
        name: 'iframe',
        type: cardComponentType.componentList
    }, {
        props: {
            // url: 'http://guild.czht.top',
            url: "https://www.czht.top"
        },
        showInGridDesktop: false
    }).setPosition(4, 1).setSize(8, 4),
    gridCellMaker('cardApiControler','cardApiControler',{},{
        name:'cardApiControler',
        type:cardComponentType.componentList,
    },{}).setPosition(2,2).setSize(1,1)
]