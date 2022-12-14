/*
 * @Date: 2022-04-28 22:29:05
 * @LastEditors: CZH
 * @LastEditTime: 2022-12-14 14:45:45
 * @FilePath: /configforpagedemo/src/modules/userManage/PageConfigData/main.tsx
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
  setData,
} from "@/components/basicComponents/grid/module/cardApi/index";
import { post, get } from "@/utils/api/requests";
import {
  btnMaker,
  closeBtn,
} from "@/modules/userManage/component/searchTable/drawerForm";
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
import { ElMessage, ElMessageBox } from "element-plus";

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
  tableCellTemplateMaker(
    "部门",
    "unitId",
    searchCell(formInputType.searchList, {
      funcInputOptionsLoader: async (that) => {
        let attr = {
          multiple: false,
        };
        attr["remoteMethod"] = async (query) => {
          let res = await post("/web/usc/unit/list", {
            name: query,
          });
          return res.data.map((x) => {
            return {
              value: x.id + "",
              label: x.name,
            };
          });
        };
        return attr;
      },
    })
  ),
]);

/**
 * @name: roleBindBtn
 * @description: 角色绑定权限按钮
 * @authors: CZH
 * @Date: 2022-12-13 11:13:51
 */
const roleBindBtn = btnMaker("用户角色管理", btnActionTemplate.Function, {
  icon: "Connection",
  elType: "primary",
  function: async (that, data) => {
    let drawerProps = {
      title: "用户角色管理",
      schema: { required: ["roleId"] },
      queryItemTemplate: [
        tableCellTemplateMaker(
          "搜索权限",
          "searchRole",
          searchCell(formInputType.searchList)
        ),
        tableCellTemplateMaker(
          "用户权限",
          "roleId",
          searchCell(formInputType.searchList, {
            funcInputOptionsLoader: async (that) => {
              let attr = {};
              return attr;
            },
          })
        ),
      ],
      data: {},
      btnList: [closeBtn],
    };
    that.$modules
      .getModuleApi()
    ["userManage_openDrawerForm"](that, drawerProps);
  },
});

/**
 * @name: unitBindBtn
 * @description: 用户部门管理按钮
 * @authors: CZH
 * @Date: 2022-12-14 11:05:55
 */
const unitBindBtn = btnMaker("用户部门管理", btnActionTemplate.Function, {
  icon: "OfficeBuilding",
  elType: "primary",
  function: async (that, user) => {
    let res = await post('/web/usc/user/select', { id: user.id })
    let drawerProps = {
      title: "用户部门管理",
      queryItemTemplate: [
        tableCellTemplateMaker(
          "用户部门",
          "units",
          searchCell(formInputType.indexListForSwitch, {
            funcInputOptionsLoader: async (that) => {
              let attr = {
                customRender: (data, that) => {
                  console.log(that, data, 'asd')
                  return <el-card bodyStyle={{
                    width: '100%',
                    padding: '6px',
                    display: 'flex',
                    justifyContent: 'space-between'
                  }}>
                    <el-tag>{data.name}</el-tag>
                    <el-button size='small' type='danger'>退出部门</el-button>
                  </el-card>
                }
              };
              return attr;
            },
          })
        ),
        searchTable.getByKey("unitId", {
          label: '新增部门'
        }),
      ],
      data: { ...res.data },
      btnList: [closeBtn],
    };
    that.$modules
      .getModuleApi()
    ["userManage_openDrawerForm"](that, drawerProps);
  },
});

/**
 * @name: mainDesktop
 * @description: 基于部门的用户管理
 * @authors: CZH
 * @Date: 2022-12-14 11:14:32
 */
export const mainDesktop = async () => {
  // 批量删除按钮
  const selectedDeleteBtn = btnMaker("删除", btnActionTemplate.Function, {
    isShow: (data) => !data.searchChildrenFlag,
    function: async (that, data) => {
      if (!that.selectedList || that.selectedList.length == 0)
        return ElMessage.warning("未选中需要删除的用户");
      let userList = that.selectedList;
      let { unit } = that.baseData;
      ElMessageBox({
        title: "删除部门成员",
        type: "warning",
        confirmButtonText: "确认删除",
        message: `即将删除部门【${unit.name}】下的成员：${userList
          .map((x) => x.name)
          .join(" ")}`,
        callback: async (action) => {
          if (action == "confirm") {
            let res = await post("/web/usc/unit/deleteUser", {
              id: unit.id,
              uids: userList.map((x) => x.id),
            });
            if (res.message && res.message == "成功") ElMessage.success("成功");
            if (that.close) that.close();
            else refreshDesktop(that);
          }
        },
      });
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
  const addNewModel = btnMaker("创建新用户", btnActionTemplate.Function, {
    function: async (that, data) => {
      let drawerProps = {
        title: "创建新用户",
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

  const tableAction = tableCellTemplateMaker(
    "操作",
    "actionBtnList",
    actionCell([unitBindBtn], {
      fixed: "right",
    })
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
          searchItemTemplate: searchTable.getAll(["unitId"]),
          showItemTemplate: [...userTableCellStorage.getAll(), tableAction],
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

/**
 * @name: userManage
 * @description: 用户管理界面
 * @authors: CZH
 * @Date: 2022-12-14 08:30:00
 */
export const userManage = async () => {
  const tableAction = tableCellTemplateMaker(
    "操作",
    "actionBtnList",
    actionCell([unitBindBtn, roleBindBtn], {
      fixed: "right",
    })
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
          searchItemTemplate: searchTable.getByKeyArr(["unitId"]),
          showItemTemplate: [
            ...userTableCellStorage.getAll(["unitId"]),
            tableAction,
          ],
          searchFunc: async (query: stringAnyObj, that: stringAnyObj) => {
            console.log(query, "asd");
            let res = await post("/web/usc/user/page/org", {
              ...query,
            });
            if (!res.data["list"]) res.data["list"] = [];
            if (!res.data["data"]) res.data["data"] = res.data["list"];
            return res.data;
          },
          autoSearch: true,
          searchKeyWithBaseData: ["unit"],
          btnList: [],
        },
        isSettingTool: false,
      }
    )
      .setPosition(0, 0)
      .setSize(12, 8),
  ] as gridCellTemplate[];
};
