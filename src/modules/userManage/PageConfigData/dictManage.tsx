/*
 * @Date: 2023-02-08 16:28:14
 * @LastEditors: CZH
 * @LastEditTime: 2023-02-08 18:14:45
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
import { btnMaker } from "@/modules/userManage/component/searchTable/drawerForm";
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


// 字典页面配置数据
const 字典页面配置数据列 = new SearchCellStorage([
    tableCellTemplateMaker('字典名', 'name'),
    tableCellTemplateMaker('标识符', 'key'),
    tableCellTemplateMaker('备注', 'remark'),
    tableCellTemplateMaker('字典数据', 'data', searchCell(formInputType.searchTable))
]);

//字典数据页面配置数据列
const 字典数据页面配置数据列 = new SearchCellStorage([

])



// 添加操作栏目
字典页面配置数据列.push(
    tableCellTemplateMaker(
        "操作",
        "actionaction",
        actionCell([], {
            fixed: "right",
        })
    )
);



// 指定搜索项
const SearchTemplate = 字典页面配置数据列.getByKeyArr(['name', 'key']);
// 指定列表展示项
const ShowTemplate = 字典页面配置数据列.getAll()


// 列表可用按钮
const btnList = [];

// 字典管理页面可用按钮配置表
export const dictManageBtnList = [];


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
