/*
 * @Date: 2023-02-09 15:30:11
 * @LastEditors: CZH
 * @LastEditTime: 2023-02-09 15:30:26
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



import { ShowTemplate, SearchTemplate } from "./dictManage";


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
                    autoSearch: false,
                },
                isSettingTool: false,
            }
        )
            .setPosition(0, 0)
            .setSize(12, 8),
    ] as gridCellTemplate[];
}