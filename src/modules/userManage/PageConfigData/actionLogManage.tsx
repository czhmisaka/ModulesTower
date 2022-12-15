/*
 * @Date: 2022-04-28 22:29:05
 * @LastEditors: CZH
 * @LastEditTime: 2022-12-15 10:30:47
 * @FilePath: /configforpagedemo/src/modules/userManage/PageConfigData/actionLogManage.tsx
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
  searchCell,
  showCell,
} from "@/modules/userManage/component/searchTable/searchTable";
import { formInputType, showType, stringAnyObj } from "@/modules/userManage/types";

export const actionLogManage = async () => {
  // 部门数据
  const APITableCellStorage = new SearchCellStorage([
    tableCellTemplateMaker("操作者", "operatorName"),
    tableCellTemplateMaker("部门", "operatorUnitName"),
    tableCellTemplateMaker("操作类型", "type"),
    tableCellTemplateMaker("操作详情", "detail", showCell(showType.dataKey, {
      width: '300px'
    })
    ),
    tableCellTemplateMaker("IP", "ip"),
    tableCellTemplateMaker("操作地址", "operationAddress"),
  ]);

  const userTableSearchTemplate = [];

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
          defaultQuery: {},
          autoSearch: false,
          searchItemTemplate: userTableSearchTemplate,
          showItemTemplate: APITableCellStorage.getAll(),
          searchFunc: async (query: stringAnyObj) => {
            let res = await post("/web/usc/oplog/page", { ...query });
            return res && res.data ? res.data : [];
          },
          btnList,
        },
        isSettingTool: false,
      }
    )
      .setPosition(0, 0)
      .setSize(12, 8),
  ] as gridCellTemplate[];
};
