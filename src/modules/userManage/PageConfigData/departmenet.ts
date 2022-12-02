/*
 * @Date: 2022-04-28 22:29:05
 * @LastEditors: CZH
 * @LastEditTime: 2022-12-02 12:56:56
 * @FilePath: /configforpagedemo/src/modules/userManage/PageConfigData/departmenet.ts
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
import { SearchCellStorage, tableCellTemplateMaker, DataCell } from "@/modules/userManage/component/searchTable/searchTable";
import { stringAnyObj } from "@/modules/userManage/types";

export const department = async () => {
  // 部门数据
  const APITableCellStorage = new SearchCellStorage([
    tableCellTemplateMaker("ID", "id"),
    tableCellTemplateMaker("创建者ID", "createUserId"),
    tableCellTemplateMaker(
      "创建时间",
      "createTime",
      DataCell({
        width: "200px",
      })
    ),
    tableCellTemplateMaker("更新者", "updateUserId"),
    tableCellTemplateMaker(
      "更新时间",
      "updateTime",
      DataCell({
        width: "200px",
      })
    ),
    tableCellTemplateMaker("排序", "orderNumber"),
    tableCellTemplateMaker("是否置顶", "top"),
    tableCellTemplateMaker("删除", "deleted"),
    tableCellTemplateMaker("部门名称", "name"),
    tableCellTemplateMaker("简介", "description"),
    tableCellTemplateMaker("上级部门ID", "parentId"),
    tableCellTemplateMaker("所有上级部门ID", "parentIds"),
    tableCellTemplateMaker("上级部门", "parentNames"),
    tableCellTemplateMaker("所属行政区划ID", "regionId"),
    tableCellTemplateMaker("浙政钉Code", "zzdCode"),
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
          searchItemTemplate: userTableSearchTemplate,
          showItemTemplate: APITableCellStorage.getAll(),
          searchFunc: async (query: stringAnyObj) => {
            if (!query) query = {};
            let res = await post("/web/usc/unit/list", { ...query });
            return res && res.data ? res.data : [];
          },
          searchKeyWithBaseData: ["outputKey"],
          btnList,
          autoSearch:true,
        },
        isSettingTool: false,
      }
    )
      .setPosition(0, 0)
      .setSize(12, 8),
  ] as gridCellTemplate[];
};
