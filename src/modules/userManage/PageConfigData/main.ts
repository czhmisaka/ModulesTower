/*
 * @Date: 2022-04-28 22:29:05
 * @LastEditors: CZH
 * @LastEditTime: 2022-11-11 10:31:14
 * @FilePath: /configforpagedemo/src/modules/userManage/PageConfigData/main.ts
 */

import { gridCellMaker, gridSizeMaker, cardComponentType, cardOnChangeType, gridCellTemplate } from "@/components/basicComponents/grid/module/dataTemplate"
import { changeVisible, changeCardSize, changeCardPosition, changeCardProperties } from "@/components/basicComponents/grid/module/cardApi/index";
import { post, get } from "@/utils/api/requests";



/**
 * @name: buildDataToTree
 * @description: 从 listdata 生成 treeData
 * @authors: CZH
 * @Date: 2022-11-11 10:28:41
 * @param {*} data
 * @param {*} cell
 * @param {*} id
 * @param {*} pid
 */
function buildDataToTree(data, cell, id = 'id', pid = 'parentId') {
    const result = [];
    data.map(x => x[pid] == cell[id] && result.push(x))
    result.map(x => buildDataToTree(data, x))
    cell['children'] = result
    return cell;
}

export const mainDesktop = [
    gridCellMaker('MenuList', '菜单列表', {}, {
        name: 'userManage_menuList',
        type: cardComponentType.componentList
    }, {
        props: {
            menuDataFunc: async (context) => {
                let res = await post('/web/usc/unit/list', {})
                let data = res.data;
                let unitList = data.map(x => {
                    if (data.map(c => c.id).indexOf(x.parentId) == -1)
                        return buildDataToTree(data, x)
                    else return null
                }).filter(Boolean)
                return unitList
            },
            outputKey: 'outputKey',
            defaultProps: {
                label: 'name',
                children: 'children'
            },
        },
        isSettingTool: false
    }).setPosition(0, 0).setSize(3, 8),
    gridCellMaker('searchTable', '搜索结果列表', {}, {
        name: 'userManage_searchTable',
        type: cardComponentType.componentList
    }, {
        isSettingTool: false
    }).setPosition(3, 0).setSize(9, 8),
    // gridCellMaker('openComponents', '打开组件菜单', {}, {
    //     type: cardComponentType.componentList,
    //     name: 'icon'
    // }, {
    //     isSettingTool: true,
    //     props: {
    //         name: 'Grid',
    //         onClickFunc: (content: any) => {
    //             const { context } = content;
    //             context.emit('onChange', {}, {
    //                 type: [cardOnChangeType.openComponentsList]
    //             })
    //         }
    //     },
    // }).setPosition(2, 8).setSize(1, 1),
    gridCellMaker('editable', '编辑', {}, {
        name: 'setting_editable',
        type: cardComponentType.componentList
    }, {
        isSettingTool: true
    }).setPosition(3, 4).setSize(1, 1),
] as gridCellTemplate[]