/*
 * @Date: 2023-02-08 16:28:14
 * @LastEditors: CZH
 * @LastEditTime: 2023-02-10 13:47:32
 * @FilePath: /configforpagedemo/src/modules/userManage/PageConfigData/dictManage.tsx
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
import { dictDataManage } from './dictDataManage';
import { dictDataManageBtnList } from './dictDataManage';


// 字典页面配置数据
const 字典页面配置数据列 = new SearchCellStorage([
    tableCellTemplateMaker('字典名', 'name'),
    tableCellTemplateMaker('标识符', 'key'),
    tableCellTemplateMaker('备注', 'remark'),
    tableCellTemplateMaker('字典数据', 'data', searchCell(formInputType.searchTable))
]);

//字典数据页面配置数据列
const 字典数据页面配置数据列 = new SearchCellStorage([
    tableCellTemplateMaker('', '')
])

const 提交字典修改或者新增的按钮 = btnMaker('提交', btnActionTemplate.Function, {
    elType: 'primary',
    function: async (that, data) => {
        let api = '/web/usc/dict/insert'
        if (data.id) api = api.replace('insert', 'update')
        let res = await post(api, data);
        repBackMessageShow(that, res)
    }
})

const 新增字典按钮 = btnMaker('新增字典按钮', btnActionTemplate.OpenDrawer, {
    elType: 'primary',
    drawerProps: {
        title: '新增字典按钮',
        queryItemTemplate: 字典页面配置数据列.getByKeyArr(['name', 'key', 'remark']),
        schema: {
            required: ['name', 'key']
        },
        btnList: [提交字典修改或者新增的按钮]
    }
}, ['/web/usc/dict/insert'], '新增字典按钮')

const 编辑字典按钮 = btnMaker('编辑', btnActionTemplate.Function, {
    elType: 'primary',
    function: (that, data) => {
        let drawerProps = {
            title: '新增字典按钮',
            queryItemTemplate: 字典页面配置数据列.getByKeyArr(['name', 'key', 'remark']),
            btnList: [提交字典修改或者新增的按钮],
            schema: {
                required: ['name', 'key']
            },
            data
        }
        openDrawerFormEasy(that, drawerProps)
    }
}, ['/web/usc/dict/insert'], '编辑字典按钮')

const 删除字典按钮 = btnMaker('删除', btnActionTemplate.Function, {
    elType: 'danger',
    function: async (that, data) => {
        try {
            if (await dobuleCheckBtnMaker('删除字典' + data.name, '') == true) {
                let res = await post('/web/usc/dict/delete', { id: data.id })
                repBackMessageShow(that, res)
            }
        } catch {
            return true;
        }
    }
}, ['/web/usc/dict/delete'], '删除字典按钮')

const 查看字典数据 = btnMaker('数据', btnActionTemplate.Function, {
    elType: 'primary',
    function: async (that, data) => {
        let drawerProps = {
            title: "字典数据",
            size: 80,
            gridDesktop: true,
            gridDesktopConfig: {
                preBaseData: { dict: JSON.parse(JSON.stringify(data)) },
                desktopData: dictDataManage,
                gridColNum: 12,
                cusStyle: {
                    wholeScreen: true,
                    maxRows: 8,
                    margin: 3
                }
            }
        }
        console.log('start', drawerProps)
        that.$modules.getModuleApi()["userManage_openDrawerForm"](that, drawerProps);
    }
}, [], '查看字典数据列表')


// 添加操作栏目
字典页面配置数据列.push(
    tableCellTemplateMaker(
        "操作",
        "actionaction",
        actionCell([编辑字典按钮, 删除字典按钮, 查看字典数据], {
            fixed: "right",
        })
    )
);



// 指定搜索项
export const SearchTemplate = 字典页面配置数据列.getByKeyArr(['name', 'key']);
// 指定列表展示项
export const ShowTemplate = 字典页面配置数据列.getAll()


// 列表可用按钮
const btnList = [新增字典按钮];

// 字典管理页面可用按钮配置表
export const dictManageBtnList = [新增字典按钮, 编辑字典按钮, 删除字典按钮, 查看字典数据, ...dictDataManageBtnList];


/**
 * @name: dictManage
 * @description: 字典数据
 * @authors: CZH
 * @Date: 2023-02-09 15:25:41
 */
export const dictManage = async () => {
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
                    searchItemTemplate: SearchTemplate,
                    showItemTemplate: ShowTemplate,
                    searchFunc: async (query: stringAnyObj) => {
                        if (!query) query = {};
                        let res = await post("/web/usc/dict/page", { ...query });
                        if (!res.data) {
                            res.data = [];
                        }
                        return res.data
                    },
                    defaultQuery: {
                        showLink: null,
                    },
                    btnList,
                    autoSearch: false,
                },
                isSettingTool: false,
            }
        )
            .setPosition(0, 0)
            .setSize(12, 8),
    ] as gridCellTemplate[];
};


