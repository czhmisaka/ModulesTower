/*
 * @Date: 2022-04-28 22:29:05
 * @LastEditors: CZH
 * @LastEditTime: 2023-07-07 09:31:44
 * @FilePath: /lcdp_fe_setup/src/modules/userManage/PageConfigData/pageConfigManage.ts
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
} from "@/modules/userManage/component/searchTable/searchTable";
import { stringAnyObj } from "@/modules/userManage/types";

export const pageConfigManage = async () => {
  // 页面配置数据
  const pageConfigDataTableCellStorage = new SearchCellStorage([
    tableCellTemplateMaker("createUserId", "createUserId"),
    tableCellTemplateMaker("创建时间", "createTime"),
    tableCellTemplateMaker("最近更新用户ID", "updateUserId"),
    tableCellTemplateMaker("更新时间", "updateTime"),
    tableCellTemplateMaker("排序", "orderNumber"),
    tableCellTemplateMaker("置顶", "top"),
    tableCellTemplateMaker("配置", "config"),
    tableCellTemplateMaker("pageConfigId", "pageConfigId"),
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
            return res.data;
          },
          searchKeyWithBaseData: ["outputKey"],
          btnList,
        },
        autoSearch: false,
        isSettingTool: false,
      }
    )
      .setPosition(0, 0)
      .setSize(12, 8),
  ] as gridCellTemplate[];
};
