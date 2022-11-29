/*
 * @Date: 2022-04-28 22:29:05
 * @LastEditors: CZH
 * @LastEditTime: 2022-11-29 17:04:34
 * @FilePath: /configforpagedemo/src/modules/userManage/PageConfigData/menuManage.ts
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
} from "@/modules/userManage/component/searchTable/searchTable";
import {
  btnMaker,
  btnActionTemplate,
} from "@/modules/userManage/component/searchTable/drawerForm";

export const menuManage = async () => {
  // 页面配置数据
  const pageConfigDataTableCellStorage = new SearchCellStorage([
    tableCellTemplateMaker("id", "id"),
    tableCellTemplateMaker("父级ID", "parentId"),
    tableCellTemplateMaker("名称", "name"),
    tableCellTemplateMaker("图标", "icon"),
    tableCellTemplateMaker("类型", "type"),
    tableCellTemplateMaker("URL", "url"),
    tableCellTemplateMaker("是否作为菜单展示", "showLink"),
    tableCellTemplateMaker("页面配置ID", "pageConfigId"),
    tableCellTemplateMaker("配置参数", "meta"),
    tableCellTemplateMaker("子节点", "children"),
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
            console.log(query);
            let res = await post("/web/usc/menu/list", { ...query });
            return res.data;
          },
          searchKeyWithBaseData: ["outputKey"],
          btnList,
        },
        autoSearch: true,
        isSettingTool: false,
      }
    )
      .setPosition(0, 0)
      .setSize(12, 8),
  ] as gridCellTemplate[];
};
