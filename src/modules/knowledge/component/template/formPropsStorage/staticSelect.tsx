/*
 * @Date: 2023-08-21 18:40:14
 * @LastEditors: CZH
 * @LastEditTime: 2023-09-05 19:08:17
 * @FilePath: /lcdp_fe_setup/src/modules/knowledge/component/template/formPropsStorage/staticSelect.tsx
 */

import { tableCellTemplateMaker, gridDesktopCell, searchCell, actionCell } from "@/modules/userManage/component/searchTable/searchTable"
import { btnActionTemplate, formInputType, gridDesktopPropsTemplate, stringAnyObj } from "@/modules/userManage/types"
import { base } from "../useAbleComponents"
import { cardComponentType, gridCellMaker, gridCellTemplate } from "@/components/basicComponents/grid/module/dataTemplate"
import { btnMaker, openDrawerFormEasy } from "@/modules/userManage/component/searchTable/drawerForm"
import { drawerProps } from '@/modules/userManage/types';
import { upToTopDataChange } from "@/components/basicComponents/grid/module/cardApi"



const 添加选项按钮 = btnMaker('添加选项', btnActionTemplate.Function, {
    icon: 'Plus',
    elType: 'primary',
    function: async (that, d) => {
        let drawerProps = {
            title: '添加选项',
            queryItemTemplate: [
                tableCellTemplateMaker('选项', 'label'),
            ],
            btnList: [
                btnMaker('提交', btnActionTemplate.Function, {
                    function: async (th, data) => {
                        let dataUp = {}
                        dataUp[data.label] = data.label
                        upToTopDataChange(that, dataUp)
                        setTimeout(() => {
                            that.search()
                        }, 400)
                        th.close()
                    }
                })
            ],
        } as drawerProps;
        openDrawerFormEasy(that, drawerProps)
    }
})

const 删除选项按钮 = btnMaker('删除', btnActionTemplate.Function, {
    function: async (that, d) => {
        let dataUp = {}
        dataUp[d.label] = undefined
        upToTopDataChange(that, dataUp)
        setTimeout(() => {
            that.$emit("search");
        }, 50)
        console.log(that, 'modelValue')
    }
})

const desktopData = async () => {
    return [
        gridCellMaker(
            "searchTable",
            "搜索结果列表",
            {},
            {
                name: "userManage_searchTable",
                type: cardComponentType.componentList,
            },
            {
                props: {
                    showItemTemplate: [
                        tableCellTemplateMaker('选项', 'label'),
                        tableCellTemplateMaker('操作', 'asd', actionCell([删除选项按钮], {
                            fixed: "right",
                            noDetail: true,
                        }))
                    ],
                    searchFunc: async (query: stringAnyObj, that: stringAnyObj) => {
                        return Object.keys(that.baseData.modelValue).map(x => {
                            if (that.baseData.modelValue[x])
                                return {
                                    key: x,
                                    label: x,
                                }
                            else return false
                        }).filter(Boolean)
                    },
                    defaultQuery: {
                        showLink: null,
                    },
                    btnList: [添加选项按钮],
                    autoSearch: true,
                },
                isSettingTool: false,
            }
        )
            .setPosition(0, 0)
            .setSize(12, 8),
    ] as gridCellTemplate[]
}




export const 下拉选择器数据输入 = tableCellTemplateMaker('', 'input', searchCell(formInputType.tableCellTemplate, {
    funcInputOptionsLoader: async (that) => {
        return [
            tableCellTemplateMaker('描述', 'description'),
            tableCellTemplateMaker('选项', 'inputOptions', gridDesktopCell(async (that) => {
                return {
                    ...base(),
                    desktopData
                } as gridDesktopPropsTemplate
            }, {
                style: {
                    width: '100%',
                    height: '40vh',
                    maxHeight: '40vh',
                }
            }))]
    }
}))