/*
 * @Author: czhmisaka
 * @Date: 2023-03-02 22:51:43
 * @FilePath: \ConfigForDesktopPage\src\modules\dictServerSiteModule\PageConfigData\main.ts
 */

import {
    btnMaker,
    repBackMessageShow,
} from "@/modules/userManage/component/searchTable/drawerForm";
import {
    btnActionTemplate,
    drawerProps,
    formInputType,
    stringAnyObj,
} from "@/modules/userManage/types";
import {
    actionCell,
    tableCellTemplateMaker,
} from "@/modules/userManage/component/searchTable/searchTable";
import { searchCell } from "@/modules/userManage/component/searchTable/searchTable";
import { piwigoMethod, post } from "@/utils/api/requests";
import { openDrawerFormEasy } from "@/modules/userManage/component/searchTable/drawerForm";
import { SearchCellStorage } from "@/modules/userManage/component/searchTable/searchTable";
import { dobuleCheckBtnMaker } from "@/modules/userManage/component/searchTable/drawerForm";
import { useUserStoreHook } from "@/store/modules/user";

import {
    cardComponentType,
    gridCellMaker,
    gridCellTemplate,
} from "@/components/basicComponents/grid/module/dataTemplate";

import { RemoteStorage } from "../api/remoteStorage";
export const mainDictDesktop = async () => {
    const dictStorage = new SearchCellStorage([
        tableCellTemplateMaker('id', 'id'),
        tableCellTemplateMaker('Key', 'key'),
        tableCellTemplateMaker('value', 'value'),
        tableCellTemplateMaker('label', 'label'),
    ])
    const remoteStorage = RemoteStorage.getInstance()
    await remoteStorage.login()
    // const 
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
                    showItemTemplate: dictStorage.getAll(),
                    searchFunc: async (query: stringAnyObj, that: stringAnyObj) => {
                        let res = await remoteStorage.getAllKey()
                        return res.data.map((x,i)=>{
                            return {
                                ...x,
                                label:'label'+x.key,
                                id:i,
                            }
                        });
                    },
                    searchKeyWithBaseData: ["category"],
                    btnList: [],
                    autoSearch: false,
                },
                isSettingTool: false,
            }
        )
            .setPosition(0, 0)
            .setSize(12, 8),
    ] as gridCellTemplate[];
};
