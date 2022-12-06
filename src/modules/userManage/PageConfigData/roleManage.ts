/*
 * @Date: 2022-04-28 22:29:05
 * @LastEditors: CZH
 * @LastEditTime: 2022-12-06 14:50:51
 * @FilePath: /configforpagedemo/src/modules/userManage/PageConfigData/roleManage.ts
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
  DataCell,
  showCell,
} from "@/modules/userManage/component/searchTable/searchTable";
import {
  btnActionTemplate,
  btnCellTemplate,
  formInputType,
  showType,
  stringAnyObj,
} from "@/modules/userManage/types";
import { btnMaker } from "../component/searchTable/drawerForm";

export const roleManage = async () => {
  // 数据访问类型预定义
  const dataScopeType = {
    0: "全部数据",
    1: "本部门",
    3: "自定义部门",
  };

  // 提交按钮 / 新增&编辑
  const submitBtn = btnMaker("提交", btnActionTemplate.Function, {});

  // 删除按钮
  const deleteBtn = btnMaker("删除", btnActionTemplate.Function, {});

  // 打开弹窗 / 支持新增&编辑
  const addModelBtn = btnMaker("新增", btnActionTemplate.OpenDrawer, {});

  // table 标签库
  const roleTableSearchStorage = new SearchCellStorage([
    tableCellTemplateMaker("id", "id"),
    tableCellTemplateMaker("创建者ID", "createUserId"),
    tableCellTemplateMaker("创建时间", "createTime", DataCell()),
    tableCellTemplateMaker("更新者ID", "updateUserId"),
    tableCellTemplateMaker("更新时间", "updateTime", DataCell()),
    tableCellTemplateMaker("排序顺序", "orderNumber"),
    tableCellTemplateMaker("置顶", "top"),
    tableCellTemplateMaker("角色名称", "name"),
    tableCellTemplateMaker("详情", "description"),
    tableCellTemplateMaker("父级角色", "parentId"),
    tableCellTemplateMaker("创建部门", "unitId"),
    tableCellTemplateMaker("页面访问权限", "permission"),
    tableCellTemplateMaker(
      "数据访问类型",
      "dataScopeType",
      searchCell(formInputType.select, {
        inputOptions: dataScopeType,
      })
    ),
    tableCellTemplateMaker("数据访问范围", "dataScope"),
  ]);
  const btnList = [] as btnCellTemplate[];

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
          searchItemTemplate: roleTableSearchStorage.getByKeyArr([
            "dataScopeType",
          ]),
          showItemTemplate: roleTableSearchStorage.getAll(),
          searchFunc: async (query: stringAnyObj) => {
            if (!query) query = {};
            if (!query.name) return [];
            let res = await post("/web/usc/url/list", { ...query });
            return res && res.data ? res.data : [];
          },
          btnList,
          autoSearch: true,
        },
        isSettingTool: false,
      }
    )
      .setPosition(0, 0)
      .setSize(12, 8),
  ] as gridCellTemplate[];
};
