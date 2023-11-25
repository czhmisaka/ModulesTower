import { mainDesktop } from "@/modules/ApplicationManage/PageConfigData/main"
import { refKeyMap_模板单元智慧写作专用, useRefKeyMap_模板单元智慧写作专用 } from "@/modules/knowledge/PageConfigData/template/templateDetail"
import { 模板列表搜索页面 } from "@/modules/knowledge/PageConfigData/template/templateManage"
import { 选择部门_多选 } from "@/modules/userManage/PageConfigData/main"
import { 图标 } from "@/modules/userManage/PageConfigData/menuManage"
import { SearchCellStorage, tableCellTemplateMaker, searchCell, remoteDictSelectSearchCell, staticSelectCell, gridDesktopCell, tableCellTemplateCell } from "@/modules/userManage/component/searchTable/searchTable"
import { formInputType, tableCellTemplate, gridDesktopPropsTemplate } from "@/modules/userManage/types"
import { getAction } from "@/router/util"
import { 下拉选择器数据输入 } from "../formPropsStorage/staticSelect"
import { base, useAbleComponentsCellModuleTemplate } from "../useAbleComponents"



let baseTemplate = new SearchCellStorage([
    tableCellTemplateMaker('标题', 'label'),
    tableCellTemplateMaker('绑定对象', 'key', searchCell(formInputType.searchList, {
        funcInputOptionsLoader: async (that) => {
            return {
                type: 'string',
                multiple: false,
                remoteMethod: async (data) => {
                    return Object.keys(refKeyMap_模板单元智慧写作专用).map(x => {
                        if (Object.keys(useRefKeyMap_模板单元智慧写作专用).map((c) => useRefKeyMap_模板单元智慧写作专用[c]).indexOf(x) == -1)
                            return { value: x, label: x }
                        else if (Object.keys(useRefKeyMap_模板单元智慧写作专用).map((c) => c == data.__name ? useRefKeyMap_模板单元智慧写作专用[c] : '').indexOf(x)) {
                            return { value: x, label: x }
                        } else {
                            null
                        }
                    }).filter(Boolean)
                }
            }
        },
        onChangeFunc: (that, data) => {
            useRefKeyMap_模板单元智慧写作专用[data.__name] = data.key
        }
    })),
    tableCellTemplateMaker('', 'input', tableCellTemplateCell([
        tableCellTemplateMaker('描述', 'description'),
        // tableCellTemplateMaker('', 'ui:options', searchCell(formInputType.tableCellTemplate, {
        //     funcInputOptionsLoader: async (that) => {
        //         return [
        //             tableCellTemplateMaker('宽度', 'width'),
        //             tableCellTemplateMaker('标签宽度', 'labelWidth'),
        //         ]
        //     }
        // })),
    ]
    )),
])



let 基础组件 =
    {
        name: '基础组件',
        icon: 'Tools',
        componentslist: [
            {
                name: '单行输入',
                tableCellMaker: tableCellTemplateMaker("文本输入", "key"),
                componentPropsTemplate: [
                    ...baseTemplate.getAll()
                ],
            },
            {
                name: '多行文本输入',
                tableCellMaker: tableCellTemplateMaker(
                    "多行文本输入",
                    "key",
                    searchCell(formInputType.textarea)
                ),
                componentPropsTemplate: [
                    ...baseTemplate.getAll()
                ],
            }, {
                name: '下拉职业选择',
                tableCellMaker: tableCellTemplateMaker(
                    "职业视角选择器",
                    "key",
                    remoteDictSelectSearchCell('lcdp_user_job')
                ),
                componentPropsTemplate: [
                    ...baseTemplate.getAll(),
                ],
                dealFunc(data, key, options) {
                    return options.enumNames[options.enum.indexOf(data[key])]
                },
            }, {
                name: '下拉选择器',
                tableCellMaker: tableCellTemplateMaker(
                    "下拉选择器",
                    "key",
                    staticSelectCell({ 选项1: "选项1", 选项2: "选项2", 选项3: "选项3" })
                ),
                componentPropsTemplate: [
                    ...baseTemplate.getAll(),
                    下拉选择器数据输入
                ],
                dealFunc(data, key, options) {
                    return options.enumNames[options.enum.indexOf(data[key])]
                },
            }, {
                name: '日期输入',
                tableCellMaker: tableCellTemplateMaker(
                    "日期选择器",
                    "key",
                    searchCell(formInputType.datePicker)
                ),
                componentPropsTemplate: [
                    ...baseTemplate.getAll(),
                    tableCellTemplateMaker('', 'input', tableCellTemplateCell([
                        tableCellTemplateMaker('描述', 'description'),
                        tableCellTemplateMaker('', 'inputOptions', tableCellTemplateCell([
                            tableCellTemplateMaker('隐藏显示', 'ui:hidden', searchCell(formInputType.switch))
                        ])),
                        tableCellTemplateMaker('', 'extraOptions', tableCellTemplateCell([
                            tableCellTemplateMaker('输出类型', 'showType', staticSelectCell({
                                '时间戳': '时间戳',
                                '日期': '日期',
                                '当天日期': '当天日期',
                                '当天时间': '当天时间'
                            }))
                        ]))
                    ])),

                ],
                dealFunc: (data, key, options) => {
                    let { extraOptions } = options.extraOptions;
                    switch (extraOptions['showType']) {
                        case '时间戳':
                            return data[key]
                        case '日期':
                            return new Date(data[key]).toLocaleDateString()
                        case '当天日期':
                            return new Date().toLocaleDateString()
                        case '当天时间':
                            return new Date().toLocaleTimeString()
                    }
                }
            }, {
                name: '数字',
                tableCellMaker: tableCellTemplateMaker(
                    "数字",
                    "key",
                    searchCell(formInputType.number)
                ),
                componentPropsTemplate: [
                    ...baseTemplate.getAll()
                ]
            }, {
                name: '图标',
                tableCellMaker: 图标,
                componentPropsTemplate: [
                    ...baseTemplate.getAll()
                ]
            }, {
                name: '部门',
                tableCellMaker: 选择部门_多选,
                componentPropsTemplate: [
                    // baseTemplate.getByKey('key')
                    ...baseTemplate.getAll()
                ]
            },
        ]
    } as useAbleComponentsCellModuleTemplate


export const baseComponents = 基础组件