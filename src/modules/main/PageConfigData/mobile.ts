






import { gridCellMaker, gridSizeMaker, cardComponentType, cardOnChangeType, gridCellTemplate } from "@/components/basicComponents/grid/module/dataTemplate"
import { changeVisible, changeCardSize, changeCardPosition, changeCardProperties } from "@/components/basicComponents/grid/module/cardApi/index";
import { setPosition, setSize } from '../../../components/basicComponents/grid/module/util';

import { infoTemplate, infoType } from '@/components/basicComponents/cell/info/DynamicIsland'


let fucker = false;
let fuckerMoon = false;
export const mobileDesktop = [
    gridCellMaker('editable', '编辑', {}, {
        name: 'setting_editable',
        type: cardComponentType.componentList
    }, {
        isSettingTool: true
    }).setPosition(2, 5).setSize(1, 1),
    gridCellMaker('userLogin', '用户登录', {}, {
        type: cardComponentType.componentList,
        name: 'userLogin'
    }, {
        isSettingTool: true,
        showInGridDesktop: false,
    }).setPosition(0, 5).setSize(3, 1),
    gridCellMaker('showElcard1', '显示elcard1', {}, {
        type: cardComponentType.componentList,
        name: 'icon'
    }, {
        props: {
            name: 'View',
            onClickFunc: (content: any) => {
                const { context } = content;
                changeVisible(context, {
                    elcard0: true,
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
            name: 'ArrowDown',
            onClickFunc: (content: any) => {
                const { context } = content;
                let name = !fucker ? 'ArrowDown' : 'ArrowUp'
                let posiitionMap = fucker ? {
                    elcard0: {
                        x: 0,
                        y: 5
                    },
                } : {
                    elcard0: {
                        x: 0,
                        y: 6
                    },
                }
                let sizeMap = fucker ? {
                    elcard0: {
                        width: 2,
                        height: 3
                    },
                } : {
                    elcard0: {
                        width: 3,
                        height: 2
                    },
                }
                changeCardProperties(context, {
                    showElcard2: {
                        name
                    }
                })
                changeVisible(context, {
                    editable: fucker,
                    userLogin: !fucker
                })
                changeCardPosition(context, posiitionMap)
                changeCardSize(context, sizeMap)
                fucker = !fucker
            }
        },
    }).setPosition(3, 5).setSize(1, 1),
    gridCellMaker('hideElcard1', '隐藏elcard1', {}, {
        type: cardComponentType.componentList,
        name: 'icon'
    }, {
        props: {
            name: 'Close',
            onClickFunc: (content: any) => {
                const { context } = content;
                changeVisible(context, {
                    elcard0: false,
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
    }).setPosition(0, 0).setSize(2, 3),
    gridCellMaker('elcard0', '卡片', {}, {
        name: 'elcard',
        type: cardComponentType.componentList
    }, {
        props: {
            isBlack: true,
            title: '壁纸',
            content: '--来自鬼刀大佬',
            img: 'https://pic4.zhimg.com/v2-306dbf3946e096bc2c8b03aa0250ad93_r.jpg',
        },
    }).setPosition(0, 5).setSize(2, 3),
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
    gridCellMaker('DynamicIsland', '灵动岛岛', {}, {
        name: 'DynamicIsland',
        type: cardComponentType.componentList
    }, {
        props: {
            info: [],
            size: {
                x: 2,
                y: 0.25,
                width: 0,
                height: 0.5,
                maxWidth: 4,
                maxHeight: 2
            }
        },
    }),
    gridCellMaker('activeInfo', '触发info', {}, {
        type: cardComponentType.componentList,
        name: 'icon'
    }, {
        props: {
            name: 'Sunrise',
            onClickFunc: (content: any) => {
                const { context } = content;
                let info = {
                    icon: fuckerMoon ? 'Moon' : "Sunrise",
                    type: infoType.icon,
                    options: {
                        color: fuckerMoon ? 'skyblue' : 'orange'
                    },
                    time: 3,
                } as infoTemplate
                changeCardProperties(context, {
                    activeInfo: {
                        name: fuckerMoon ? 'Moon' : "Sunrise"
                    },
                    DynamicIsland: {
                        info: [info]
                    }
                })
                fuckerMoon = !fuckerMoon
            }
        },
    }).setPosition(3, 6).setSize(1, 1),
    gridCellMaker('sendMessage', '发送信息', {}, {
        type: cardComponentType.componentList,
        name: 'icon'
    }, {
        props: {
            name: 'Football',
            onClickFunc: (content: any) => {
                const { context } = content;
                let info = {
                    message: '一条简单的信息',
                    type: infoType.message,
                    time: 10,
                } as infoTemplate
                changeCardProperties(context, {
                    DynamicIsland: {
                        info: [info]
                    }
                })
            }
        },
    }).setPosition(3, 7).setSize(1, 1),
] as gridCellTemplate[]