/*
 * @Date: 2022-04-28 22:29:05
 * @LastEditors: CZH
 * @LastEditTime: 2022-12-12 11:27:51
 * @FilePath: /configforpagedemo/src/modules/userManage/PageConfigData/roleBindUserManage.ts
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
  DataCell,
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
import { btnMaker } from "../component/searchTable/drawerForm";
import { ElMessage, ElMessageBox } from "element-plus";
import { refreshDesktop } from "@/components/basicComponents/grid/module/cardApi";

export const roleBindUserManage = async () => {
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
    tableCellTemplateMaker("身份证信息", "idCard"),
    tableCellTemplateMaker("浙政钉code", "zzdCode"),
    tableCellTemplateMaker("部门", "unitIds", {
      ...searchCell(formInputType.selects, {}),
    }),
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
            let res = await post("/web/usc/user/page/org", {
              name: query,
            });
            let data = [];
            if (res?.data?.list)
              data = res.data.list.map((x) => {
                return {
                  value: x.id,
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
    icon: "Position",
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
  const addUser = btnMaker("绑定用户", btnActionTemplate.Function, {
    icon: "Connection",
    elType: "primary",
    function: (that, data) => {
      let { roleList } = that.baseData;
      let role = roleList.filter(
        (x) => x.id == (that.$route?.query?.roleId || that?.baseData?.role?.id)
      )[0];
      let drawerProps = {
        title: `绑定用户【${role.name}】`,
        schema: {
          required: ["uids"],
        },
        queryItemTemplate: userBindRole.getAll(),
        btnList: [submit],
        data: {
          roleId: role.id,
        },
      } as drawerProps;

      that.$modules
        .getModuleApi()
        ["userManage_openDrawerForm"](that, drawerProps);
    },
  });

  const unBindUser = btnMaker("解除绑定关系", btnActionTemplate.Function, {
    icon: "Connection",
    elType: "danger",
    function: async (that, data) => {
      let routeQuery = that.$route.query;
      let query = { ...routeQuery, ...that.query };
      if (that.baseData?.role?.id)
        query = {
          ...query,
          roleId: that.baseData?.role?.id,
        };
      let res = await post("/web/usc/role/cancelUser", {
        uid: data.id,
        roleId: query.id,
      });
    },
  });

  // btnList
  const btnList = [addUser] as btnCellTemplate[];

  // 操作按钮
  userTableCellStorage.push(
    tableCellTemplateMaker("操作", "actionBtnList", actionCell([unBindUser]))
  );

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
          treeDataFunc: async (that) => {
            let res = await post("/web/usc/role/list", {});
            let data = res.data.map((x) => {
              return {
                ...x,
                isLeaf: !x.hasLeaf,
                value: x.id,
              };
            });
            setData(that, { roleList: data });
            return data;
          },
          outputKey: "role",
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
          searchItemTemplate: userTableCellStorage.getByKeyArr([]),
          showItemTemplate: userTableCellStorage.getByKeyArr([
            "name",
            "gender",
            "mobile",
            "actionBtnList",
          ]),
          searchFunc: async (query: stringAnyObj, that: stringAnyObj) => {
            let routeQuery = that.$route.query;
            if (!query) query = {};
            if (that.baseData?.role?.id)
              query = {
                ...query,
                roleId: that.baseData?.role?.id,
              };
            let res = await post("/web/usc/user/page/org", {
              ...routeQuery,
              ...query,
            });
            return res && res.data ? res.data : [];
          },
          searchKeyWithBaseData: ["role"],
          btnList,
          autoSearch: true,
        },
        isSettingTool: false,
      }
    )
      .setPosition(3, 0)
      .setSize(9, 8),
  ] as gridCellTemplate[];
};
