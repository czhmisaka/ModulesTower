/*
 * @Date: 2023-02-08 16:28:14
 * @LastEditors: CZH
 * @LastEditTime: 2023-07-18 15:36:56
 * @FilePath: /lcdp_fe_setup/src/modules/userManage/PageConfigData/regionManage.tsx
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

export const regionManageBtnList = []

/**
 * @name: regionManage
 * @description: 行政区划管理页面 暂时不开发
 * @authors: CZH
 * @Date: 2023-07-18 15:34:59
 */
export const regionManage = async () => {
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
                    searchItemTemplate: [],
                    showItemTemplate: [],
                    searchFunc: async (query: stringAnyObj) => {
                        if (!query) query = {};
                        let res = await post("/web/sys/dict/page", { ...query });
                        if (!res.data) {
                            res.data = [];
                        }
                        return res.data
                    },
                    defaultQuery: {
                        showLink: null,
                    },
                    btnList: regionManageBtnList,
                    autoSearch: false,
                },
                isSettingTool: false,
            }
        )
            .setPosition(0, 0)
            .setSize(12, 8),
    ] as gridCellTemplate[];
};


