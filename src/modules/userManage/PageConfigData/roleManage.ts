/*
 * @Date: 2022-04-28 22:29:05
 * @LastEditors: CZH
 * @LastEditTime: 2022-12-09 11:19:27
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
  refreshDesktop,
} from "@/components/basicComponents/grid/module/cardApi/index";
import { post, get } from "@/utils/api/requests";
import {
  SearchCellStorage,
  tableCellTemplateMaker,
  searchCell,
  DataCell,
  showCell,
  staticSelectCell,
  actionCell,
} from "@/modules/userManage/component/searchTable/searchTable";
import {
  btnActionTemplate,
  btnCellTemplate,
  formInputType,
  showType,
  stringAnyObj,
} from "@/modules/userManage/types";
import { btnMaker } from "../component/searchTable/drawerForm";
import { collapseItemProps, ElMessage, ElMessageBox } from "element-plus";

export const roleManage = async () => {
  // 数据访问类型预定义
  const dataScopeType = {
    0: "全部数据",
    1: "本部门",
    3: "自定义部门",
  };

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
      staticSelectCell(dataScopeType, {
        onChangeFunc: (that, data) => {
          const { dataScopeType } = data;
          const str = [
            "name",
            "description",
            "orderNumber",
            "systemMenuIds",
            "dataScopeType",
          ];
          if (dataScopeType == 3)
            return roleTableSearchStorage.getByKeyArr([...str, "dataScopes"]);
          else return roleTableSearchStorage.getByKeyArr(str);
        },
      })
    ),
    tableCellTemplateMaker(
      "数据访问范围",
      "dataScopes",
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
    tableCellTemplateMaker(
      "菜单权限范围",
      "systemMenuIds",
      searchCell(formInputType.treeSelect, {
        funcInputOptionsLoader: async (that) => {
          let res = await post("/web/usc/menu/list", {});
          function mapp(res) {
            res["value"] = res.id;
            if (res.children && res.children.length > 0)
              res.children.map((x) => {
                return mapp(x);
              });
            return res;
          }
          let resData = res.data.map((x) => {
            return mapp(x);
          });
          return {
            data: resData,
          };
        },
      })
    ),
  ]);

  // 提交按钮 / 新增&编辑
  const submitBtn = btnMaker("提交", btnActionTemplate.Function, {
    icon: "Plus",
    elType: "primary",
    function: async (that, data) => {
      let res = await post(
        "/web/usc/role/" + (data.id ? "update" : "insert"),
        data
      );
      if (res["message"] == "成功") {
        that.$message.success(res["message"]);
        setTimeout(() => {
          that.close();
        }, 500);
      } else {
        that.$message.danger(res["message"]);
      }
    },
  });

  // 删除按钮
  const deleteBtn = btnMaker("删除", btnActionTemplate.Function, {
    icon: "Delete",
    elType: "danger",
    function: async (that, data) => {
      ElMessageBox({
        title: "确认删除【" + data.name + "】吗？",
        type: "warning",
        callback: async (action) => {
          if (action == "confirm") {
            let res = await post("/web/usc/role/delete", { id: data.id });
            if (res.message && res.message == "成功") ElMessage.success("成功");
            if (that.close) that.close();
            else refreshDesktop(that);
          }
        },
      });
    },
  });

  // 打开弹窗 / 支持新增&编辑
  const editModelBtn = btnMaker("编辑", btnActionTemplate.Function, {
    icon: "Setting",
    elType: "primary",
    function: async (that, data) => {
      const isNew = Object.keys(data).length < 2;
      let drawerProps = {
        title: (isNew ? "新增" : "编辑") + "角色",
        schema: {
          required: ["name", "orderNumber", "systemMenuIds", "dataScopeType"],
        },
        queryItemTemplate: roleTableSearchStorage.getByKeyArr([
          "name",
          "description",
          "orderNumber",
          "systemMenuIds",
          "dataScopeType",
        ]),
        data: {
          ...data,
          orderNumber: 100,
          dataScopeType:
            data.dataScopeType == 0 || data.dataScopeType
              ? data.dataScopeType + ""
              : "",
        },
        btnList: [submitBtn],
      };
      that.$modules
        .getModuleApi()
        ["userManage_openDrawerForm"](that, drawerProps);
    },
  });

  // 打开新增弹窗
  const addModelBtn = {
    ...editModelBtn,
    label: "新增",
    icon: "Plus",
    function: (that, data) => {
      return editModelBtn.function(
        that,
        data && data.id ? { parentId: data.id } : {}
      );
    },
  };

  // 绑定用户到某个角色
  const authUserToRole = btnMaker("绑定用户", btnActionTemplate.Function, {
    icon: "Connection",
    function: async (that, data) => {
      that.$router.push({
        path: "/userManage/ROLEBINDUSERMANAGE",
        query: {
          roleId: data.id,
        },
      });
    },
  });

  // 搜索表单同级别按钮
  const btnList = [addModelBtn] as btnCellTemplate[];

  // 表单单行数据操作按钮
  roleTableSearchStorage.push(
    tableCellTemplateMaker(
      "操作",
      "actionBtnList",
      actionCell([addModelBtn, deleteBtn, authUserToRole, editModelBtn], {
        fixed: "right",
      })
    )
  );

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
          searchItemTemplate: roleTableSearchStorage.getByKeyArr(["name"]),
          showItemTemplate: roleTableSearchStorage.getAll([
            "id",
            "createUserId",
            "updateUserId",
          ]),
          searchFunc: async (query: stringAnyObj) => {
            if (!query) query = {};
            let res = await post("/web/usc/role/list", { ...query });
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
