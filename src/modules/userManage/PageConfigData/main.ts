/*
 * @Date: 2022-04-28 22:29:05
 * @LastEditors: CZH
 * @LastEditTime: 2022-12-13 09:33:37
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
  staticSelectCell,
  actionCell,
} from "@/modules/userManage/component/searchTable/searchTable";
import {
  btnActionTemplate,
  stringAnyObj,
  formInputType,
} from "@/modules/userManage/types";
import { ElMessage } from "element-plus";
export const mainDesktop = async () => {
  // 性别
  const gender = {
    1: "男",
    2: "女",
  };

  const userTableCellStorage = new SearchCellStorage([
    tableCellTemplateMaker("名字", "name"),
    tableCellTemplateMaker("性别", "gender", staticSelectCell(gender)),
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
    tableCellTemplateMaker(
      "部门",
      "unitIds",
      searchCell(formInputType.treeSelectRemote, {
        funcInputOptionsLoader: async (that) => {
          let attr = {
            props: {
              label: "name",
              isLeaf: "isLeaf",
            },
            nodeKey: "id",
          };
          attr["load"] = async (node, resolve) => {
            let res = await post("/web/usc/unit/list", {
              parentId: node.data.id,
            });
            return resolve(
              res.data.map((x) => {
                return {
                  ...x,
                  isLeaf: !x.hasLeaf,
                  value: x.id,
                };
              })
            );
          };
          return attr;
        },
      })
    ),
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

  // 批量删除按钮
  const selectedDeleteBtn = btnMaker("删除", btnActionTemplate.Function, {
    function: async (that, data) => {
      if (!that.selectedList || that.selectedList.length == 0)
        return ElMessage.warning("未选中需要删除的用户");
    },
    icon: "Delete",
    elType: "danger",
  });

  /**
   * @name: 打开新增弹窗
   * @description: waitForWriting
   * @authors: CZH
   * @Date: 2022-12-09 17:50:58
   */
  const addNewModel = btnMaker("新增", btnActionTemplate.Function, {
    function: async (that, data) => {
      let drawerProps = {
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
              let res = await post(
                "/web/usc/user/" + (data.id ? "update" : "insert"),
                data
              );
              ElMessage[res.message == "成功" ? "success" : "error"](
                res.message
              );
              if (res.message == "成功" && that.close) that.close();
            },
          }),
        ],
      };
      that.$modules
        .getModuleApi()
        ["userManage_openDrawerForm"](that, drawerProps);
    },
    premission: ["admin"],
    icon: "Plus",
    elType: "primary",
  });

  const btnList = [addNewModel, selectedDeleteBtn];

  userTableCellStorage.push(
    tableCellTemplateMaker(
      "操作",
      "actionBtnList",
      actionCell([], {
        fixed: "right",
      })
    )
  );

  return [
    gridCellMaker(
      "MenuList",
      "菜单列表分层获取",
      {},
      {
        name: "userManage_menuListRemote",
        type: cardComponentType.componentList,
      },
      {
        props: {
          treeDataFuncByLevel: async (node, resolve) => {
            let res = await post("/web/usc/unit/list", {
              parentId: node.data.id,
            });
            let data = res.data.map((x) => {
              return {
                ...x,
                isLeaf: !x.hasLeaf,
                value: x.id,
              };
            });
            resolve(data);
          },
          outputKey: "unit",
          defaultProps: {
            label: "name",
            children: "children",
            isLeaf: "isLeaf",
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
          autoSearch: true,
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
