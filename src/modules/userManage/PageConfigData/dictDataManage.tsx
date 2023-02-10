/*
 * @Date: 2023-02-09 15:30:11
 * @LastEditors: CZH
 * @LastEditTime: 2023-02-10 13:47:16
 * @FilePath: /configforpagedemo/src/modules/userManage/PageConfigData/dictDataManage.tsx
 */
import {
    gridCellMaker,
    gridSizeMaker,
    cardComponentType,
    cardOnChangeType,
    gridCellTemplate,
} from "@/components/basicComponents/grid/module/dataTemplate";
import { post, get } from "@/utils/api/requests";
import * as Icons from "@element-plus/icons-vue";
import { ElIcon } from "element-plus";
import { btnMaker, repBackMessageShow } from "@/modules/userManage/component/searchTable/drawerForm";
import {
    SearchCellStorage,
    tableCellTemplateMaker,
    showCell,
    searchCell,
    actionCell,
} from "@/modules/userManage/component/searchTable/searchTable";
import {
    showType,
    formInputType,
    stringAnyObj,
    btnActionTemplate,
    drawerProps,
} from "@/modules/userManage/types";
import { ElMessage, ElMessageBox } from "element-plus";
import { refreshDesktop } from "@/components/basicComponents/grid/module/cardApi";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { useModuleHook } from "@/store/modules/module";
import { btnCellTemplate } from "../types";
import { openDrawerFormEasy } from '../component/searchTable/drawerForm';
import { dobuleCheckBtnMaker } from '../component/searchTable/drawerForm';



const 字典数据页面配置数据列 = new SearchCellStorage([
    tableCellTemplateMaker("name", "name",),
    tableCellTemplateMaker("value", "value",),
    tableCellTemplateMaker("key", "key",),
    tableCellTemplateMaker("remark", "remark",),
    tableCellTemplateMaker("orderNumber", "orderNumber", searchCell(formInputType.number)),
])


const 提交字典数据修改或者新增的按钮 = btnMaker('提交', btnActionTemplate.Function, {
    function: async (that, data) => {
        let api = '/web/usc/dict/data/insert'
        if (data.id) api = api.replace('insert', 'update')
        let res = await post(api, data);
        repBackMessageShow(that, res)
    }
})

const 新增字典数据按钮 = btnMaker('新增', btnActionTemplate.Function, {
    elType: 'primary',
    function: (that, data) => {
        let drawerProps = {
            title: '新增字典数据',
            queryItemTemplate: 字典数据页面配置数据列.getByKeyArr(['name', 'value', 'remark', 'orderNumber']),
            btnList: [提交字典数据修改或者新增的按钮],
            schema: {
                required: ['name', 'key']
            },
            data: {
                key: that.baseData.dict.key
            }
        }
        openDrawerFormEasy(that, drawerProps)
    }
}, ['/web/usc/dict/data/insert'], '新增字典数据按钮')

const 编辑字典数据按钮 = btnMaker('编辑', btnActionTemplate.Function, {
    elType: 'primary',
    function: (that, data) => {
        let drawerProps = {
            title: '编辑字典数据',
            queryItemTemplate: 字典数据页面配置数据列.getByKeyArr(['name', 'value', 'remark', 'orderNumber']),
            btnList: [提交字典数据修改或者新增的按钮],
            schema: {
                required: ['name', 'key']
            },
            data
        }
        openDrawerFormEasy(that, drawerProps)
    }
}, ['/web/usc/dict/data/insert'], '编辑字典数据按钮')


const 删除字典数据按钮 = btnMaker('删除', btnActionTemplate.Function, {
    elType: 'danger',
    function: async (that, data) => {
        try {
            if (await dobuleCheckBtnMaker('删除字典数据' + data.name, '') == true) {
                let res = await post('/web/usc/dict/data/delete', { id: data.id })
                repBackMessageShow(that, res)
            }
        } catch {
            return true;
        }
    }
}, ['/web/usc/dict/data/delete'], '删除字典数据按钮')


const 批量删除字段数据按钮 = btnMaker('批量删除', btnActionTemplate.Function, {
    elType: 'danger',
    icon: 'Delete',
    function: async (that, data) => {
        try {
            if (await dobuleCheckBtnMaker('删除字典数据【' + that.selectedList.map(x => x.name).join('】【') + '】', '') == true) {
                let res = await post('/web/usc/dict/data/deleteBatch', { ids: that.selectedList.map(x => x.id) })
                repBackMessageShow(that, res)
            }
        } catch {
            return true;
        }
    }
}, ['/web/usc/dict/data/deleteBatch'], '批量删除字段数据按钮')


// 添加操作栏目
字典数据页面配置数据列.push(
    tableCellTemplateMaker(
        "操作",
        "actionaction",
        actionCell([编辑字典数据按钮, 删除字典数据按钮], {
            fixed: "right",
        })
    )
);

const btnList = [新增字典数据按钮, 批量删除字段数据按钮]
export const dictDataManageBtnList = [编辑字典数据按钮, 新增字典数据按钮, 删除字典数据按钮, 批量删除字段数据按钮]
const ShowTemplate = 字典数据页面配置数据列.getAll()
const SearchTemplate = []

/**
 * @name: dictDataManage
 * @description: 字典数据管理列表
 * @authors: CZH
 * @Date: 2023-02-09 15:27:44
 */
export const dictDataManage = async () => {
    return [
        gridCellMaker(
            "searchTable",
            "字典数据管理列表",
            {},
            {
                name: "userManage_searchTable",
                type: cardComponentType.componentList,
            },
            {
                props: {
                    searchItemTemplate: SearchTemplate,
                    showItemTemplate: ShowTemplate,
                    searchFunc: async (query: stringAnyObj, that) => {
                        if (!query) query = {};
                        let res = await post("/web/usc/dict/data/list", { key: that.baseData.dict.key });
                        if (!res.data) {
                            res.data = [];
                        }
                        return res.data
                    },
                    defaultQuery: {
                        showLink: null,
                    },
                    autoSearch: true,
                    btnList
                },
                isSettingTool: false,
            }
        )
            .setPosition(0, 0)
            .setSize(12, 8),
    ] as gridCellTemplate[];
}