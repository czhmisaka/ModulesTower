/*
 * @Date: 2022-04-28 22:29:05
 * @LastEditors: CZH
 * @LastEditTime: 2022-11-29 11:26:12
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
    tableCellTemplateMaker("name", "name"),
    tableCellTemplateMaker("gender", "gender"),
    tableCellTemplateMaker("icon", "icon"),
    tableCellTemplateMaker("description", "description"),
    tableCellTemplateMaker("adminFlag", "adminFlag"),
    tableCellTemplateMaker("mail", "mail"),
    tableCellTemplateMaker("mobile", "mobile"),
    tableCellTemplateMaker(
      "birthday",
      "birthday",
      DataCell({
        width: "200px",
      })
    ),
    tableCellTemplateMaker("idCard", "idCard"),
    tableCellTemplateMaker("zzdCode", "zzdCode"),
    tableCellTemplateMaker("id", "id"),
    tableCellTemplateMaker("createUserId", "createUserId"),
    tableCellTemplateMaker(
      "createTime",
      "createTime",
      DataCell({
        width: "200px",
      })
    ),
    tableCellTemplateMaker("updateUserId", "updateUserId"),
    tableCellTemplateMaker(
      "updateTime",
      "updateTime",
      DataCell({
        width: "200px",
      })
    ),
    tableCellTemplateMaker("orderNumber", "orderNumber"),
  ]);

  const searchTable = new SearchCellStorage([
    tableCellTemplateMaker("用户名", "name"),
    tableCellTemplateMaker("手机号", "mobile"),
    tableCellTemplateMaker("组织", "unitId"),
    tableCellTemplateMaker("角色", "roleId"),
  ]);

  const userTableSearchTemplate = [];

  const btnList = [
    btnMaker("新增", btnActionTemplate.OpenDrawer, {
      drawerProps: {
        title: "新增用户",
        queryItemTemplate: userTableCellStorage.getAll(),
        btnList: [
          btnMaker("提交", btnActionTemplate.Function, {
            icon: "Position",
            function: async (that) => {
              console.log(that, "qwe");
            },
          }),
          btnMaker("新增", btnActionTemplate.OpenDrawer, {
            drawerProps: {
              title: "新增用户",
              queryItemTemplate: userTableSearchTemplate,
              btnList: [
                btnMaker("提交", btnActionTemplate.Function, {
                  icon: "Position",
                  function: (that) => {
                    return console.log(that, "qwe");
                  },
                }),
                btnMaker("取消", btnActionTemplate.Function, {
                  icon: "Delete",
                  elType: "danger",
                  function: (that) => {
                    console.log(that, "qwe");
                  },
                }),
              ],
            },
            icon: "Plus",
            elType: "primary",
          }),
        ],
      },
      premission:['admin'],
      icon: "Plus",
      elType: "primary",
    }),
    btnMaker("删除", btnActionTemplate.OpenDrawer, {
      drawerProps: {
        title: "删除用户",
        queryItemTemplate: userTableSearchTemplate,
        btnList: [
          btnMaker("提交", btnActionTemplate.Function, {
            icon: "Position",
            function: (that) => {
              console.log(that, "qwe");
            },
          })
        ],
      },
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
          outputKey: "outputKey",
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
          searchItemTemplate: userTableSearchTemplate,
          showItemTemplate: userTableCellStorage.getAll(),
          searchFunc: async (query: stringAnyObj) => {
            let res = await post("/web/usc/user/list", { ...query });
            return res.data;
          },
          searchKeyWithBaseData: ["outputKey"],
          btnList,
        },
        isSettingTool: false,
      }
    )
      .setPosition(3, 0)
      .setSize(9, 8),
    // gridCellMaker(
    //   "editable",
    //   "编辑",
    //   {},
    //   {
    //     name: "setting_editable",
    //     type: cardComponentType.componentList,
    //   },
    //   {
    //     isSettingTool: true,
    //   }
    // )
    //   .setPosition(0, 7)
    //   .setSize(1, 1),
  ] as gridCellTemplate[];
};
