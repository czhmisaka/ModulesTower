/*
 * @Date: 2022-04-28 22:29:05
 * @LastEditors: CZH
 * @LastEditTime: 2023-11-14 19:35:28
 * @FilePath: /lcdp_fe_setup/src/modules/userManage/PageConfigData/roleBindUserManage.ts
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
  setData,
} from "@/components/basicComponents/grid/module/cardApi/index";
import { post, get } from "@/utils/api/requests";
import {
  SearchCellStorage,
  tableCellTemplateMaker,
  DateCell,
  searchCell,
  actionCell,
  showCell,
  staticSelectCell,
} from "@/modules/userManage/component/searchTable/searchTable";
import {
  btnActionTemplate,
  btnCellTemplate,
  drawerProps,
  formInputType,
  showType,
  stringAnyObj,
} from "@/modules/userManage/types";
import {
  btnMaker,
  dobuleCheckBtnMaker,
  roleBtnMaker,
} from "@/modules/userManage/component/searchTable/drawerForm";
import { ElMessage, ElMessageBox } from "element-plus";
import { refreshDesktop } from "@/components/basicComponents/grid/module/cardApi";
import {
  roleDetailModel,
  addModelBtn,
  roleManageDataInitFunc,
} from "@/modules/userManage/PageConfigData/roleManage";

// 性别
const gender = {
  1: "男",
  2: "女",
};

const userTableCellStorage = new SearchCellStorage([
  tableCellTemplateMaker("名字", "name"),
  tableCellTemplateMaker("性别", "gender", staticSelectCell(gender)),
  tableCellTemplateMaker("授权人", "roleLicensor"),
  tableCellTemplateMaker("授权时间", "roleAuthTime", DateCell()),
  tableCellTemplateMaker("icon", "icon"),
  tableCellTemplateMaker("简介", "description"),
  tableCellTemplateMaker("管理员", "adminFlag"),
  tableCellTemplateMaker("邮箱", "mail"),
  tableCellTemplateMaker("手机号", "mobile"),
  tableCellTemplateMaker("身份证信息", "idCard"),
  tableCellTemplateMaker("浙政钉code", "zzdCode"),
  tableCellTemplateMaker(
    "部门",
    "unitNames",
    showCell(showType.func, {
      showFunc: (d, k, i) => (i ? d["wholeUnitNames"] : d[k]),
    })
  ),
  tableCellTemplateMaker("排序", "orderNumber"),
]);

// 用户绑定表单
const userBindRole = new SearchCellStorage([
  tableCellTemplateMaker(
    "绑定用户",
    "uids",
    searchCell(formInputType.searchList, {
      funcInputOptionsLoader: async (that) => {
        const remoteMethod = async (query: string) => {
          let res = await post("/web/usc/user/page", {
            name: query,
          });
          let data = [];
          if (res?.data?.list)
            data = res.data.list.map((x) => {
              return {
                value: x.id + "",
                label: x.name,
              };
            });
          return data;
        };
        return {
          "remote-method": remoteMethod,
        };
      },
    })
  ),
]);

const submit = btnMaker("提交", btnActionTemplate.Function, {
  function: async (that, data) => {
    let res = await post("/web/usc/role/authUser", data);
    if (res.message == "成功") {
      ElMessage.success(res.message);
      if (that.close) that.close();
      else refreshDesktop(that);
    } else ElMessage.error(res.message);
  },
});

// 新增角色绑定关系
const addUser = btnMaker(
  "绑定用户",
  btnActionTemplate.Function,
  {
    icon: "Connection",
    elType: "primary",
    function: (that, data) => {
      let { roleList, role } = that.baseData;
      if (roleList) {
        let cell = roleList.filter(
          (x) => x.id == that.$route?.query?.roleId
        )[0];
        if (role) cell = role;
        let drawerProps = {
          title: `绑定用户【${cell.name}】`,
          schema: {
            required: ["uids"],
          },
          queryItemTemplate: userBindRole.getAll(),
          btnList: [submit],
          data: {
            roleId: cell.id,
          },
        } as drawerProps;

        that.$modules
          .getModuleApi()
          ["userManage_openDrawerForm"](that, drawerProps);
      } else {
        ElMessage.error("请先选择角色");
      }
    },
  },
  ["/web/usc/user/page"],
  "新增角色绑定关系按钮"
);

const unBindUser = btnMaker(
  "解绑",
  btnActionTemplate.Function,
  {
    icon: "Connection",
    elType: "danger",
    function: async (that, data) => {
      let { roleList, role } = that.baseData;
      let cell = roleList.filter(
        (x) => x.id == (that.$route?.query?.roleId || that?.baseData?.role?.id)
      )[0];
      if (role) cell = role;
      if (
        await dobuleCheckBtnMaker(
          "解绑",
          "确认删除【" +
            data.name +
            "】和 角色【" +
            cell.name +
            "】的绑定关系吗吗？"
        ).catch((x) => false)
      ) {
        let res = await post("/web/usc/role/cancelUser", {
          uids: [data.id],
          roleId: cell.id,
        });
        if (res.message == "成功") {
          ElMessage.success(res.message);
          if (that.close) that.close();
          else refreshDesktop(that);
        } else ElMessage.error(res.message);
      }
    },
  },
  ["/web/usc/role/cancelUser"],
  "解除绑定关系按钮"
);

// btnList
const btnList = [addUser] as btnCellTemplate[];

export const roleBindUserManageBtnList = [
  addUser,
  unBindUser,
  roleBtnMaker(["/web/usc/role/list"], "查询角色"),
  roleBtnMaker(["/web/usc/user/page/role"], "查询角色下的用户"),
];

// 操作按钮
userTableCellStorage.push(
  tableCellTemplateMaker("操作", "actionBtnList", actionCell([unBindUser]))
);

export const roleBindUserManage = async () => {
  await roleManageDataInitFunc();
  return [
    gridCellMaker(
      "MenuList",
      "菜单列表分层获取",
      {},
      {
        name: "userManage_menuList",
        type: cardComponentType.componentList,
      },
      {
        props: {
          treeDataFunc: async (that, name = "") => {
            let reqdata = {};
            if (name != "") reqdata["name"] = name;
            let res = await post("/web/usc/role/list", reqdata);
            // let res = { data: [] };
            let data = res.data.map((x) => {
              return {
                ...x,
                isLeaf: !x.hasLeaf,
                value: x.id,
              };
            });

            function getSon(id) {
              let back = [];
              back = data
                .map((x) => {
                  return x.parentId == id
                    ? {
                        ...x,
                        children: getSon(x.id),
                      }
                    : false;
                })
                .filter(Boolean);
              return back;
            }

            let back = data
              .map((x) => {
                if (
                  x.parentId == 0 ||
                  data.map((c) => c.id).indexOf(x.parentId) == -1
                ) {
                  return x;
                } else {
                  return false;
                }
              })
              .filter(Boolean)
              .map((x) => {
                return { ...x, children: getSon(x.id) };
              });
            setData(that, { roleList: data });
            return back;
          },
          outputKey: "role",
          defaultProps: {
            label: "name",
            children: "children",
          },
          searchBtn: addModelBtn,
          clickItemDetailFunc: (that, data) => {
            that.$modules.getModuleApi()["userManage_openDrawerForm"](that, {
              ...roleDetailModel,
              data,
            });
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
          searchItemTemplate: userTableCellStorage.getByKeyArr(["name"]),
          showItemTemplate: userTableCellStorage.getByKeyArr([
            "name",
            "unitNames",
            "roleAuthTime",
            "roleLicensor",
            "actionBtnList",
          ]),
          searchFunc: async (query: stringAnyObj, that: stringAnyObj) => {
            let routeQuery = that.$route.query;
            if (!query) query = {};
            if (that.baseData?.role?.id) {
              query = {
                ...query,
                roleId: that.baseData?.role?.id,
              };
              let res = await post("/web/usc/user/page/role", {
                ...routeQuery,
                ...query,
              });
              return res && res.data ? res.data || [] : [];
            }
          },
          searchKeyWithBaseData: ["role"],
          btnList,
          autoSearch: false,
        },
        isSettingTool: false,
      }
    )
      .setPosition(3, 0)
      .setSize(9, 8),
  ] as gridCellTemplate[];
};
