/*
 * @Date: 2022-04-28 22:29:05
 * @LastEditors: CZH
 * @LastEditTime: 2022-12-06 09:15:39
 * @FilePath: /configforpagedemo/src/modules/userManage/PageConfigData/main.ts
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
import { btnMaker } from "@/modules/userManage/component/searchTable/drawerForm";
import {
  SearchCellStorage,
  tableCellTemplateMaker,
  DataCell,
  searchCell,
} from "@/modules/userManage/component/searchTable/searchTable";
import {
  btnActionTemplate,
  stringAnyObj,
  formInputType,
} from "@/modules/userManage/types";

export const mainDesktop = async () => {
  /**
   * @name: buildDataToTree
   * @description: 从 listdata 生成 treeData
   * @authors: CZH
   * @Date: 2022-11-11 10:28:41
   * @param {*} data
   * @param {*} cell
   * @param {*} id
   * @param {*} pid
   */
  function buildDataToTree(data, cell, id = "id", pid = "parentId") {
    const result = [];
    data.map((x) => x[pid] == cell[id] && cell[id] != x[id] && result.push(x));
    result.map((x) => buildDataToTree(data, x));
    cell["children"] = result;
    return cell;
  }

  const userTableCellStorage = new SearchCellStorage([
    tableCellTemplateMaker("名字", "name"),
    tableCellTemplateMaker("性别", "gender"),
    tableCellTemplateMaker("icon", "icon"),
    tableCellTemplateMaker("简介", "description"),
    tableCellTemplateMaker("管理员", "adminFlag"),
    tableCellTemplateMaker("邮箱", "mail"),
    tableCellTemplateMaker("手机号", "mobile"),
    tableCellTemplateMaker(
      "生日",
      "birthday",
      DataCell({
        width: "200px",
      })
    ),
    tableCellTemplateMaker("身份证信息", "idCard"),
    tableCellTemplateMaker("浙政钉code", "zzdCode"),
    tableCellTemplateMaker("id", "id"),
    tableCellTemplateMaker("创建者id", "createUserId"),
    tableCellTemplateMaker(
      "创建时间",
      "createTime",
      DataCell({
        width: "200px",
      })
    ),
    tableCellTemplateMaker("修改者id", "updateUserId"),
    tableCellTemplateMaker(
      "最近修改时间",
      "updateTime",
      DataCell({
        width: "200px",
      })
    ),
    tableCellTemplateMaker("部门", "unitIds", {
      ...searchCell(formInputType.selects, {}),
    }),
    tableCellTemplateMaker("排序", "orderNumber"),
  ]);

  const searchTable = new SearchCellStorage([
    ...userTableCellStorage.getByKeyArr(["name", "mobile", "roleId"]),
    tableCellTemplateMaker(
      "搜索子部门",
      "searchChildrenFlag",
      searchCell(formInputType.radio)
    ),
  ]);

  const btnList = [
    btnMaker("新增", btnActionTemplate.OpenDrawer, {
      drawerProps: {
        title: "新增用户",
        queryItemTemplate: userTableCellStorage.getByLabelArr([
          "name",
          "gender",
          "icon",
          "description",
          "mail",
          "mobile",
          "birthday",
          "idCard",
          "unitIds",
        ]),
        btnList: [
          btnMaker("提交", btnActionTemplate.Function, {
            icon: "Position",
            function: async (that, data) => {
              let res = await post("/web/usc/user/insert", data);
              console.log("res", res);
            },
          }),
        ],
      },
      premission: ["admin"],
      icon: "Plus",
      elType: "primary",
    }),
    btnMaker("删除", btnActionTemplate.Function, {
      function: async (that, data) => {},
      icon: "Delete",
      elType: "danger",
    }),
  ];
  return [
    gridCellMaker(
      "MenuList",
      "菜单列表",
      {},
      {
        name: "userManage_menuList",
        type: cardComponentType.componentList,
      },
      {
        props: {
          treeDataFunc: async (context) => {
            let res = await post("/web/usc/unit/list", {});
            let data = res.data;
            const inKeyList = data.map((c) => c.id);
            let unitList = data
              .map((x) => {
                if (inKeyList.indexOf(x.parentId) == -1)
                  return buildDataToTree(data, x);
                else return null;
              })
              .filter(Boolean);
            return unitList;
          },
          outputKey: "unit",
          defaultProps: {
            label: "name",
            children: "children",
          },
        },
        isSettingTool: false,
      }
    )
      .setPosition(0, 0)
      .setSize(3, 8),
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
          searchItemTemplate: searchTable.getAll(),
          showItemTemplate: userTableCellStorage.getAll(),
          searchFunc: async (query: stringAnyObj, that: stringAnyObj) => {
            let res = await post("/web/usc/user/page/unit", {
              ...query,
              unitId: that.baseData?.unit?.id,
            });
            if (!res.data["list"]) res.data["list"] = [];
            if (!res.data["data"]) res.data["data"] = res.data["list"];
            return res.data;
          },
          searchKeyWithBaseData: ["unit"],
          btnList,
        },
        isSettingTool: false,
      }
    )
      .setPosition(3, 0)
      .setSize(9, 8),
  ] as gridCellTemplate[];
};
