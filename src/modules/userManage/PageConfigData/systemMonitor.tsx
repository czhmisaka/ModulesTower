/*
 * @Author: LJH
 * @Date: 2023-05-12 14:34:02
 * @LastEditors: CZH
 * @LastEditTime: 2023-08-28 14:55:44
 */
import { ref, toRefs, reactive, defineComponent } from "vue";
import {
    gridCellMaker,
    gridSizeMaker,
    cardComponentType,
    cardOnChangeType,
    gridCellTemplate,
} from "@/components/basicComponents/grid/module/dataTemplate";
import { post, get } from "@/utils/api/requests";
import {
    showType,
    formInputType,
    stringAnyObj,
    btnActionTemplate,
    drawerProps,
} from "@/modules/userManage/types";
import {
    SearchCellStorage,
    tableCellTemplateMaker,
    showCell,
    searchCell,
    actionCell,
    staticSelectCell
} from "@/modules/userManage/component/searchTable/searchTable";
import { btnMaker, repBackMessageShow, roleBtnMaker } from "@/modules/userManage/component/searchTable/drawerForm";
import { openDrawerFormEasy } from '../component/searchTable/drawerForm';
import { dobuleCheckBtnMaker } from '../component/searchTable/drawerForm';
import { ElDrawer, ElDivider, ElSwitch } from "element-plus";

const 系统监听页面配置数据列 = new SearchCellStorage([
    tableCellTemplateMaker('任务名称', 'jobName'),
    tableCellTemplateMaker('任务分组', 'jobGroup'),
    tableCellTemplateMaker('任务描述', 'description'),
    tableCellTemplateMaker("处理状态", "state", {
        ...showCell(showType.funcComponent, {
            showFunc: (row, key) => {
                return defineComponent({
                    setup(props, context) {
                        const handleBtn = async () => {
                            console.log('asd')
                            context.emit('btnClick', btnMaker('提交', btnActionTemplate.Function, {
                                function: async (that, data) => {
                                    const editData = {
                                        jobGroup: row.jobGroup,
                                        jobName: row.jobName
                                    }
                                    let api = row.state == "NORMAL" ? '/web/monitor/quartz/pause' : '/web/monitor/quartz/resume'
                                    let res = await post(api, editData);
                                    repBackMessageShow(that, res)
                                }
                            }))
                        }

                        return () => <div style={{
                            float: 'left',
                            marginTop: '-2px',
                            marginRight: '3px'
                        }}>
                            <ElSwitch modelValue={row.state == "NORMAL" ? true : false} onChange={handleBtn}></ElSwitch>
                        </div>
                    },
                });
            },
        }),
    }),
    tableCellTemplateMaker('执行表达式', 'cronExpression'),
    tableCellTemplateMaker('调用方法', 'jobClass')
]);
const 提交系统信息修改或者新增的按钮 = btnMaker('提交', btnActionTemplate.Function, {
    elType: 'primary',
    function: async (that, data) => {
        console.log(data)
        let api = '/web/monitor/quartz/update'
        // if (data.jobGroup) api = api.replace('insert', 'update')
        const editData = {
            jobGroup: data.jobGroup,
            jobName: data.jobName,
            triggerName: data.triggerName,
            cronExpression: data.cronExpression
        }
        let res = await post(api, editData);
        repBackMessageShow(that, res)
    }
})
const queryItemTemplate = [
    系统监听页面配置数据列.getByKey(
        "jobName",
        searchCell(formInputType.input, {
            propertiesOption: {
                "ui:options": {
                    disabled: true,
                },
            },
        })
    ),
    系统监听页面配置数据列.getByKey(
        "jobGroup",
        searchCell(formInputType.input, {
            propertiesOption: {
                "ui:options": {
                    disabled: true,
                },
            },
        })
    ),
    系统监听页面配置数据列.getByKey(
        "description",
        searchCell(formInputType.input, {
            propertiesOption: {
                "ui:options": {
                    disabled: true,
                },
            },
        })
    ),
    系统监听页面配置数据列.getByKey(
        "description",
        searchCell(formInputType.input, {
            propertiesOption: {
                "ui:options": {
                    disabled: true,
                },
            },
        })
    ),
    系统监听页面配置数据列.getByKey("cronExpression"),
    系统监听页面配置数据列.getByKey(
        "jobClass",
        searchCell(formInputType.input, {
            propertiesOption: {
                "ui:options": {
                    disabled: true,
                },
            },
        })
    ),

];
const 编辑监听信息 = btnMaker('编辑', btnActionTemplate.Function, {
    elType: 'primary',
    function: (that, data) => {

        let drawerProps = {
            title: '编辑任务',
            queryItemTemplate,
            btnList: [提交系统信息修改或者新增的按钮],
            // schema: {
            //     required: ['name', 'key']
            // },
            data
        } as drawerProps;
        openDrawerFormEasy(that, drawerProps)
    }
}, ['/web/monitor/quartz/update'], '编辑字典按钮')
const 立即执行 = btnMaker('立即执行', btnActionTemplate.Function, {
    elType: 'danger',
    function: async (that, data) => {
        try {
            if (await dobuleCheckBtnMaker('立即执行任务' + data.jobName, '') == true) {
                let res = await post('/web/monitor/quartz/runOnce', { jobGroup: data.jobGroup, jobName: data.jobName })
                repBackMessageShow(that, res)
            }
        } catch {
            return true;
        }
    }
}, ['/web/monitor/quartz/runOnce'], '立即执行按钮')
const 删除任务 = btnMaker('删除', btnActionTemplate.Function, {
    elType: 'danger',
    function: async (that, data) => {
        try {
            if (await dobuleCheckBtnMaker('删除任务', '删除任务' + data.jobName).catch(x => false)) {
                let res = await post('/web/monitor/quartz/delete', { jobGroup: data.jobGroup, jobName: data.jobName })
                repBackMessageShow(that, res)
            }
        } catch {
            return true;
        }
    }
}, ['/web/monitor/quartz/delete'], '删除任务')
系统监听页面配置数据列.push(
    tableCellTemplateMaker(
        "操作",
        "actionaction",
        actionCell([立即执行, 编辑监听信息, 删除任务], {
            fixed: "right",
        })
    )
);
export const ShowTemplate = 系统监听页面配置数据列.getAll()

export const systemMonitor = async () => {
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
                    showItemTemplate: ShowTemplate,
                    searchFunc: async (query: stringAnyObj) => {
                        if (!query) query = {};
                        let res = await get("/web/monitor/quartz/list", { ...query });
                        if (!res.data) {
                            res.data = [];
                        }
                        return res.data
                    },
                    defaultQuery: {
                        showLink: null,
                    },
                    autoSearch: true,
                },
                isSettingTool: false,
            }
        )
            .setPosition(0, 0)
            .setSize(12, 8),
    ] as gridCellTemplate[]
}

export const systemMonitorBtnList = [
    roleBtnMaker(["/web/monitor/quartz/list"], '查询系统监听配置')
]