/*
 * @Date: 2022-04-28 22:29:05
 * @LastEditors: CZH
 * @LastEditTime: 2022-11-30 10:27:39
 * @FilePath: /configforpagedemo/src/modules/userManage/PageConfigData/menuManage.ts
 */

import {
  gridCellMaker,
  gridSizeMaker,
  cardComponentType,
  cardOnChangeType,
  gridCellTemplate,
} from "@/components/basicComponents/grid/module/dataTemplate";
import { post, get } from "@/utils/api/requests";
import {
  SearchCellStorage,
  tableCellTemplateMaker,
  DataCell,
  tableCellTemplate,
  searchCell,
  formInputType,
  stringAnyObj,
  showCell,
  showType,
} from "@/modules/userManage/component/searchTable/searchTable";
import {
  btnMaker,
  btnActionTemplate,
} from "@/modules/userManage/component/searchTable/drawerForm";

export const menuManage = async () => {
  // 页面配置数据
  const pageConfigDataTableCellStorage = new SearchCellStorage([
    tableCellTemplateMaker("id", "id", showCell(showType.dataKey)),
    tableCellTemplateMaker("父级ID", "parentId"),
    tableCellTemplateMaker("名称", "name"),
    tableCellTemplateMaker("图标", "icon"),
    tableCellTemplateMaker("类型", "type"),
    tableCellTemplateMaker("URL", "url"),
    tableCellTemplateMaker("是否作为菜单展示", "showLink"),
    tableCellTemplateMaker("页面配置ID", "pageConfigId"),
    tableCellTemplateMaker("配置参数", "meta"),
    tableCellTemplateMaker(
      "子节点",
      "children",
      showCell(showType.func, {
        showFunc: (data: stringAnyObj, key: string) =>
          data && data[key] && data[key].length > 0
            ? data[key]
                .map((x) => {
                  return "【" + x.name + "】";
                })
                .join(" ")
            : "",
      })
    ),
  ]);

  const SearchTemplate = [
    tableCellTemplateMaker("名称", "name", searchCell(formInputType.input)),
    tableCellTemplateMaker(
      "作为菜单显示",
      "showLink",
      searchCell(formInputType.radio)
    ),
  ];

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
            let res = await post("/web/usc/menu/list", { ...query });
            if (!res.data) {
              res.data = [];
            }
            return res.data.map((x) => {
              return {
                ...x,
              };
            });
          },
          searchKeyWithBaseData: ["outputKey"],
          defaultQuery: {
            showLink: true,
          },
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
