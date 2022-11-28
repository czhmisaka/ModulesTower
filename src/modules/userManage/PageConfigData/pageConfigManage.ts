/*
 * @Date: 2022-04-28 22:29:05
 * @LastEditors: CZH
 * @LastEditTime: 2022-11-28 14:35:58
 * @FilePath: /configforpagedemo/src/modules/userManage/PageConfigData/pageConfigManage.ts
 */

import {
  gridCellMaker,
  gridSizeMaker,
  cardComponentType,
  cardOnChangeType,
  gridCellTemplate,
} from "@/components/basicComponents/grid/module/dataTemplate";
import {
  changeVisible,
  changeCardSize,
  changeCardPosition,
  changeCardProperties,
} from "@/components/basicComponents/grid/module/cardApi/index";
import { post, get } from "@/utils/api/requests";
import {
  SearchCellStorage,
  tableCellTemplateMaker,
  DataCell,
  tableCellTemplate,
  searchCell,
  formInputType,
  stringAnyObj,
} from "../component/searchTable/searchTable";
import {
  btnMaker,
  btnActionTemplate,
} from "../component/searchTable/drawerForm";

export const pageConfigManage = async () => {
  // 页面配置数据
  const pageConfigDataTableCellStorage = new SearchCellStorage([
    // tableCellTemplateMaker(''),
  ]);

  const SearchTemplate = [];

  const btnList = [];
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
          showItemTemplate: pageConfigDataTableCellStorage.getAll(),
          searchFunc: async (query: stringAnyObj) => {
            if (!query) query = {};
            let res = await post("/web/usc/page/config/page", { ...query });
            return res && res.data ? res.data.list : [];
          },
          searchKeyWithBaseData: ["outputKey"],
          btnList,
        },
        isSettingTool: false,
      }
    )
      .setPosition(0, 0)
      .setSize(12, 8),
  ] as gridCellTemplate[];
};
