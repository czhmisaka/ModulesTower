import { mainDesktop } from "@/modules/ApplicationManage/PageConfigData/main"
import { refKeyMap_模板单元智慧写作专用, useRefKeyMap_模板单元智慧写作专用 } from "@/modules/knowledge/PageConfigData/template/templateDetail"
import { 模板列表搜索页面 } from "@/modules/knowledge/PageConfigData/template/templateManage"
import { SearchCellStorage, tableCellTemplateMaker, searchCell, remoteDictSelectSearchCell, staticSelectCell, gridDesktopCell } from "@/modules/userManage/component/searchTable/searchTable"
import { formInputType, tableCellTemplate, gridDesktopPropsTemplate } from "@/modules/userManage/types"
import { getAction } from "@/router/util"

export const base = () => {
    return {
        gridColNum: 12,
        cusStyle: {
            wholeScreen: true,
            maxRows: 8,
            margin: 6,
        },
        componentLists: getAction().getAllComponents(),
    }
}

let baseTemplate = new SearchCellStorage([
    tableCellTemplateMaker('标题', 'label'),
    tableCellTemplateMaker('绑定对象', 'key', searchCell(formInputType.searchList, {
        funcInputOptionsLoader: async (that) => {
            return {
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
    tableCellTemplateMaker('', 'input', searchCell(formInputType.tableCellTemplate, {
        funcInputOptionsLoader: async (that) => {
            return [
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
        }
    })),
])

export const makeComponents = (target: tableCellTemplate, options: tableCellTemplate) => {
    return {
        ...target,
        input: {
            ...options.input,
            ...target.input,
            description: options.input.description
        },
        label: options.label,
        key: options.key
    } as tableCellTemplate
}

let 桌面组件 =
{
    name: '桌面组件',
    icon: 'Monitor',
    componentslist: [
        {
            name: '桌面',
            componentPropsTemplate: [
                ...baseTemplate.getAll()
            ],
            tableCellMaker: tableCellTemplateMaker('', 'wer', gridDesktopCell(async () => {
                return {
                    gridColNum: 12,
                    cusStyle: {
                        wholeScreen: true,
                        maxRows: 8,
                        margin: 6,
                    },
                    desktopData: mainDesktop
                } as gridDesktopPropsTemplate;
            }, {
                style: {
                    height: '40vh',
                    maxHeight: '40vh',
                    marginLeft: '-120px',
                    width: 'calc(100% + 120px)'
                }
            }))
        }, {
            name: '模板列表搜索页面',
            componentPropsTemplate: [
                ...baseTemplate.getAll()
            ],
            tableCellMaker: tableCellTemplateMaker('', 'department', gridDesktopCell(async () => {
                return {
                    ...base(),
                    desktopData: 模板列表搜索页面
                } as gridDesktopPropsTemplate;
            }, {
                style: {
                    height: '40vh',
                    maxHeight: '40vh',
                    // marginLeft: '-120px',
                    // width: 'calc(100% + 120px)'
                }
            }))
        }
    ]
}


export const gridDesktopComponents = 桌面组件