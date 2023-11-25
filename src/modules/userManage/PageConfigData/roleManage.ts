/*
 * @Date: 2022-04-28 22:29:05
 * @LastEditors: CZH
 * @LastEditTime: 2023-11-22 17:29:37
 * @FilePath: /lcdp_fe_setup/src/modules/userManage/PageConfigData/roleManage.ts
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
  DateCell,
  showCell,
  staticSelectCell,
  actionCell,
} from "@/modules/userManage/component/searchTable/searchTable";
import {
  btnActionTemplate,
  btnCellTemplate,
  showType,
  stringAnyObj,
  formInputType,
} from "@/modules/userManage/types";
import {
  btnMaker,
  dobuleCheckBtnMaker,
  roleBtnMaker,
} from "@/modules/userManage/component/searchTable/drawerForm";
import { collapseItemProps, ElMessage, ElMessageBox } from "element-plus";
import { useUserStoreHook } from "@/store/modules/user";

// 数据访问类型预定义
const dataScopeType = {
  0: "全部数据",
  1: "本部门",
  3: "自定义部门",
};
const userType = {
  "1": "系统角色",
  "2": "访客角色",
};

let menuDataRes = null;
let menuDataArray = null;
let preCheckMenuArray = [];
let roleDataRes = null;

export const roleManageDataMenuDataInitFunc = async () => {
  menuDataRes = await post("/web/usc/menu/list", {});
  const resData = menuDataRes.data;
  function checkData(nodeList, pid) {
    let back = [];
    nodeList.map((node) => {
      back.push(node);
      if (node.children && node.children.length > 0) {
        checkData(node.children, node.id).map((x) => {
          back.push(x);
        });
      }
    });
    return back;
  }
  menuDataArray = checkData(resData, -1);
};
export const roleManageDataInitFunc = async () => {
  await roleManageDataMenuDataInitFunc();
  roleDataRes = await post("/web/usc/role/list", {});
};

// table 标签库
const roleTableSearchStorage = new SearchCellStorage([
  tableCellTemplateMaker("id", "id"),
  tableCellTemplateMaker("创建者ID", "createUserId"),
  tableCellTemplateMaker("创建时间", "createTime", DateCell()),
  tableCellTemplateMaker("更新者ID", "updateUserId"),
  tableCellTemplateMaker("更新时间", "updateTime", DateCell()),
  tableCellTemplateMaker(
    "排序",
    "orderNumber",
    searchCell(formInputType.number)
  ),
  tableCellTemplateMaker("置顶", "top"),
  tableCellTemplateMaker(
    "角色名称",
    "name",
    searchCell(formInputType.input, {
      propertiesOption: {
        "err:required": "请输入字段名称",
      },
    })
  ),
  tableCellTemplateMaker("角色类型", "type", staticSelectCell(userType)),
  tableCellTemplateMaker("角色描述", "description"),
  tableCellTemplateMaker(
    "上级角色",
    "parentId",
    searchCell(formInputType.treeSelect, {
      onChangeFunc: async (that, data, key) => {
        if (data[key] == 0)
          return {
            ...data,
            [key]: "",
          };
      },
      funcInputOptionsLoader: async (that) => {
        let attr = {
          props: {
            label: "name",
            isLeaf: "isLeaf",
          },
          showCheckbox: false,
          multiple: false,
          type: "number",
          nodeKey: "id",
        };
        let res = roleDataRes;
        let data = res.data.map((x) => {
          return {
            ...x,
            isLeaf: !x.hasLeaf,
            value: x.id,
          };
        });
        return {
          ...attr,
          data,
        };
      },
    })
  ),
  tableCellTemplateMaker("上级角色", "parentName"),
  tableCellTemplateMaker("创建部门", "unitId"),
  tableCellTemplateMaker("页面访问权限", "permission"),
  tableCellTemplateMaker(
    "数据权限",
    "dataScopeType",
    staticSelectCell(dataScopeType, {
      propertiesOption: {
        "err:required": "请选择数据权限",
      },
      onChangeFunc: (that, data) => {
        if (data.dataScopeType === "") {
          data.dataScopeType = "0";
        }
        const { dataScopeType } = data;
        const str = [
          "parentId",
          "name",
          "type",
          "description",
          "orderNumber",
          "menuIds",
          "dataScopeType",
        ];
        if (dataScopeType == 3)
          return roleTableSearchStorage.getByKeyArr([...str, "dataScopes"]);
        else return roleTableSearchStorage.getByKeyArr(str);
      },
    })
  ),
  tableCellTemplateMaker(
    "数据范围",
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
                id: x.id + "",
                isLeaf: !x.hasLeaf,
                value: x.id + "",
              };
            })
          );
        };
        return attr;
      },
    })
  ),
  tableCellTemplateMaker(
    "菜单权限",
    "menuIds",
    searchCell(formInputType.treeSelect, {
      propertiesOption: {
        "err:required": "请选择菜单权限",
      },
      inputOptions: {
        onCheckChange: (node, isSelect, children) => {
          if (isSelect) preCheckMenuArray = node.children;
          else preCheckMenuArray = null;
        },
      },
      funcInputOptionsLoader: async (that) => {
        if (!menuDataRes) {
          await roleManageDataMenuDataInitFunc();
        }
        function mapp(res) {
          res["value"] = res.id + "";
          if (res.children && res.children.length > 0)
            res.children.map((x) => {
              return mapp(x);
            });
          return res;
        }
        let res = menuDataRes;
        let resData = res.data.map((x) => {
          return mapp(x);
        });
        return {
          data: resData,
        };
      },
      onChangeFunc: async (that, data, key) => {
        if (preCheckMenuArray && preCheckMenuArray.length > 0) {
          console.log(preCheckMenuArray, "test2");
          function getChild(nodeList) {
            let back = [];
            nodeList.map((x) => {
              back.push(x.id);
              if (x.children && x.children.length > 0)
                back = back.concat(getChild(x.children));
            });
            return back;
          }
          data[key] = [...data[key], ...getChild(preCheckMenuArray)];
          preCheckMenuArray = null;
          return data;
        }
      },
    })
  ),
]);

// 提交按钮 / 新增&编辑
const submitBtn = btnMaker("提交", btnActionTemplate.Function, {
  elType: "primary",
  function: async (that, data) => {
    if (data.name === null || data.name === undefined || data.name === "") {
      that.$message.info("名称不能为空");
      return;
    }
    // if (data.menuIds.length == 0) {
    //   that.$message.info("菜单权限不能为空");
    //   return;
    // }
    if (
      data.dataScopeType === null ||
      data.dataScopeType === undefined ||
      data.dataScopeType === ""
    ) {
      that.$message.info("数据访问权限不能为空");
      return;
    }
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
const deleteBtn = btnMaker(
  "删除",
  btnActionTemplate.Function,
  {
    icon: "Delete",
    elType: "danger",
    function: async (that, data) => {
      if (
        await dobuleCheckBtnMaker(
          "删除角色",
          "确认删除【" + data.name + "】吗？"
        ).catch((x) => false)
      ) {
        let res = await post("/web/usc/role/delete", { id: data.id });
        if (res.message && res.message == "成功") ElMessage.success("成功");
        if (that.close) that.close();
        else refreshDesktop(that);
      }
    },
  },
  ["/web/usc/role/delete"],
  "删除按钮"
);

// 打开弹窗 / 支持新增&编辑
const editModelBtn = btnMaker(
  "编辑",
  btnActionTemplate.Function,
  {
    function: async (that, data) => {
      if (data.dataScopes) {
        data.dataScopes = JSON.parse(
          JSON.stringify(
            data.dataScopes.map((x) => {
              return x + "";
            })
          )
        );
      }
      if (data.menuIds) {
        data.menuIds = data.menuIds.map((x) => x + "");
      }
      const isNew = Object.keys(data).length < 2;
      let drawerProps = {
        title: (isNew ? "新增" : "编辑") + "角色",
        schema: {
          required: ["name", "orderNumber", "type"],
        },
        queryItemTemplate: [
          roleTableSearchStorage.getByKey("parentId"),
          ...roleTableSearchStorage.getByKeyArr([
            "name",
            "type",
            "description",
            "orderNumber",
            "menuIds",
            "dataScopeType",
            "dataScopes",
          ]),
        ],
        data: {
          ...data,
          orderNumber: 100,
          type: (data.type || 1) + "",
          dataScopeType:
            data.dataScopeType == 0 || data.dataScopeType
              ? data.dataScopeType + ""
              : "1",
        },
        btnList: [submitBtn],
      };
      that.$modules
        .getModuleApi()
        ["userManage_openDrawerForm"](that, drawerProps);
    },
  },
  ["/web/usc/role/update", "/web/usc/role/insert"],
  "'编辑','新增'"
);

let user_options = {} as any;

setTimeout(async () => {
  user_options = await useUserStoreHook().getOptions();
}, 0);
// 打开新增弹窗
export const addModelBtn = {
  ...editModelBtn,
  label: "新增角色",
  icon: "Plus",
  elType: "primary",
  isShow: (data) => {
    return user_options?.roles?.indexOf("admin") > -1;
  },
  function: (that, data) => {
    if (data) {
      data.dataScopeType = [];
    }
    return editModelBtn.function(
      that,
      data && data.id ? { parentId: data.id } : {}
    );
  },
};

// 绑定用户到某个角色
const authUserToRole = btnMaker(
  "绑定用户",
  btnActionTemplate.Function,
  {
    icon: "Connection",
    function: async (that, data) => {
      that.$router.push({
        path: "/userManage/ROLEBINDUSERMANAGE",
        query: {
          roleId: data.id,
        },
      });
    },
  },
  ["/userManage/ROLEBINDUSERMANAGE"],
  "绑定用户到某个角色"
);

// 搜索表单同级别按钮
const btnList = [addModelBtn] as btnCellTemplate[];

// 表单单行数据操作按钮
roleTableSearchStorage.push(
  tableCellTemplateMaker(
    "操作",
    "actionBtnList",
    actionCell(
      [
        addModelBtn as unknown as btnCellTemplate,
        deleteBtn,
        authUserToRole,
        editModelBtn,
      ],
      {
        fixed: "right",
      }
    )
  )
);

export const roleDetailModel = {
  title: "角色详情",
  queryItemTemplate: [
    ...roleTableSearchStorage.getByKeyArr(["parentName"]),
    ...roleTableSearchStorage.getByLabelArr([
      "角色名称",
      "角色类型",
      "角色描述",
      "排序顺序",
      // "操作",
    ]),
  ],
  btnList: [{ ...addModelBtn, label: "新增子角色" }, deleteBtn, editModelBtn],
  noEdit: true,
};

export const roleManageBtnList = [
  deleteBtn,
  authUserToRole,
  addModelBtn,
  editModelBtn,
  roleBtnMaker(["/web/usc/role/list"], "搜索角色"),
];

export const roleManage = async () => {
  await roleManageDataInitFunc();
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
          showItemTemplate: roleTableSearchStorage.getByLabelArr([
            "角色名称",
            "角色描述",
            "排序顺序",
            "更新时间",
            "操作",
          ]),
          searchFunc: async (query: stringAnyObj) => {
            if (!query) query = {};
            let res = await post("/web/usc/role/list", { ...query });
            return res && res.data ? res.data : [];
          },
          btnList,
          autoSearch: false,
        },
        isSettingTool: false,
      }
    )
      .setPosition(0, 0)
      .setSize(12, 8),
  ] as gridCellTemplate[];
};
