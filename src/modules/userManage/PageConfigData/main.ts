/*
 * @Date: 2022-04-28 22:29:05
 * @LastEditors: CZH
 * @LastEditTime: 2022-11-09 20:49:45
 * @FilePath: /configforpagedemo/src/modules/userManage/PageConfigData/main.ts
 */

import { gridCellMaker, gridSizeMaker, cardComponentType, cardOnChangeType, gridCellTemplate } from "@/components/basicComponents/grid/module/dataTemplate"
import { changeVisible, changeCardSize, changeCardPosition, changeCardProperties } from "@/components/basicComponents/grid/module/cardApi/index";
export const mainDesktop = [
    gridCellMaker('MenuList', '菜单列表', {}, {
        name: 'userManage_menuList',
        type: cardComponentType.componentList
    }, {
        isSettingTool: false
    }).setPosition(0, 0).setSize(3, 8),
    gridCellMaker('searchTable', '菜单列表', {}, {
        name: 'userManage_searchTable',
        type: cardComponentType.componentList
    }, {
        isSettingTool: false
    }).setPosition(3, 0).setSize(9, 8),
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
    }).setPosition(2, 8).setSize(1, 1),
    gridCellMaker('editable', '编辑', {}, {
        name: 'setting_editable',
        type: cardComponentType.componentList
    }, {
        isSettingTool: true
    }).setPosition(3, 4).setSize(1, 1),
] as gridCellTemplate[]