/*
 * @Date: 2022-04-28 22:29:05
 * @LastEditors: CZH
 * @LastEditTime: 2023-10-24 18:29:29
 * @FilePath: /lcdp_fe_setup/src/modules/userManage/PageConfigData/departmenet.ts
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
  DateCell,
  searchCell,
  actionCell,
  showCell,
} from "@/modules/userManage/component/searchTable/searchTable";
import {
  btnActionTemplate,
  formInputType,
  showType,
  stringAnyObj,
  tableCellTemplate,
} from "@/modules/userManage/types";
import {
  btnMaker,
  dobuleCheckBtnMaker,
  roleBtnMaker,
} from "@/modules/userManage/component/searchTable/drawerForm";
import { ElMessage, ElMessageBox } from "element-plus";
import { refreshDesktop } from "@/components/basicComponents/grid/module/cardApi";
import { 选择部门 } from "./user/userInfo";
import { useUserStoreHook } from "@/store/modules/user";

const submit = btnMaker("提交", btnActionTemplate.Function, {
  elType: "primary",
  function: async (that: stringAnyObj, data: stringAnyObj) => {
    let res = await post(
      "/web/usc/unit/" + (data.id ? "update" : "insert"),
      data
    );
    ElMessage[res.message == "成功" ? "success" : "error"](res.message);
    if (res.message == "成功" && that.close) that.close();
  },
});

// 部门数据
export const UnitTableCellStorage = new SearchCellStorage([
  tableCellTemplateMaker("ID", "id"),
  tableCellTemplateMaker("创建者ID", "createUserId"),
  tableCellTemplateMaker(
    "创建时间",
    "createTime",
    DateCell({
      width: "200px",
    })
  ),
  tableCellTemplateMaker("更新者", "updateUserId"),
  tableCellTemplateMaker(
    "更新时间",
    "updateTime",
    DateCell({
      width: "200px",
    })
  ),
  tableCellTemplateMaker(
    "部门排序",
    "orderNumber",
    searchCell(formInputType.number, {
      propertiesOption: {
        "ui:options": {
          min: 0,
        },
      },
    })
  ),
  tableCellTemplateMaker("部门人数", "memberNumber"),
  tableCellTemplateMaker("是否置顶", "top"),
  tableCellTemplateMaker("删除", "deleted"),
  tableCellTemplateMaker("部门名称", "name", {
    ...searchCell(formInputType.input, {
      propertiesOption: {
        "err:required": "请输入名称",
      },
      fixed: "left",
      width: "200px",
    }),
    ...showCell(showType.func, {
      showFunc: (data, key) => {
        return (
          data[key] +
          (data["memberNumber"] > 0 ? "(" + data["memberNumber"] + ")" : "")
        );
      },
    }),
  }),
  tableCellTemplateMaker("部门名称", "不带人数", {
    ...showCell(showType.func, {
      showFunc: (data, key) => {
        return data["name"];
      },
    }),
  }),
  tableCellTemplateMaker("部门简介", "description"),
  tableCellTemplateMaker(
    "上级部门ID",
    "parentId",
    searchCell(formInputType.select, {
      funcInputOptionsLoader: async (that) => {
        let data = {};
        let res = await post("/web/usc/unit/list", {});
        res.data.map((x) => {
          data[x.id] = x.name;
        });
        return data;
      },
    })
  ),
  tableCellTemplateMaker("所有上级部门ID", "parentIds"),
  tableCellTemplateMaker("上级部门", "parentNames"),
  tableCellTemplateMaker("行政区划ID", "regionId"),
  tableCellTemplateMaker("行政区划", "regionName"),
  tableCellTemplateMaker("浙政钉Code", "zzdCode"),
]);

const userTableSearchTemplate = [...UnitTableCellStorage.getByKeyArr(["name"])];

let user_options = {} as any;

setTimeout(async () => {
  user_options = await useUserStoreHook().getOptions();
}, 0);

// 2023-02-16 要求可以更换上级部门 , 等待讨论
// 同时要求回显之前的部门
export const 新增部门 = btnMaker(
  "新增部门",
  btnActionTemplate.Function,
  {
    elType: "primary",
    isShow: (data) => {
      return user_options?.roles?.indexOf("admin") > -1;
    },
    function: async (that, data) => {
      let drawerProps = {
        title: "新增部门",
        schema: {
          required: ["name"],
        },
        queryItemTemplate: [
          选择上级部门,
          ...UnitTableCellStorage.getByKeyArr([
            "name",
            "description",
            "orderNumber",
          ]),
        ],
        btnList: [submit],
        data: {
          fuckNode: data ? JSON.parse(JSON.stringify(data)) : null,
          parentId:
            data && "id" in data ? data.id * 1 : that.baseData?.unit?.id * 1,
        },
      };
      that.$modules
        .getModuleApi()
        ["userManage_openDrawerForm"](that, drawerProps);
    },
  },
  ["/web/usc/unit/insert"],
  "新增部门按钮"
);

export const 选择上级部门 = tableCellTemplateMaker("上级部门", "parentId", {
  ...searchCell(formInputType.treeSelectRemote, {
    propertiesOption: {
      type: "number",
    },
    funcInputOptionsLoader: async (that) => {
      let parentList = that.formData?.parentIds
        ? that.formData?.parentIds?.split(",") || []
        : [];
      let attr = {
        props: {
          label: "name",
          isLeaf: "isLeaf",
          children: "children",
          value: "id",
        },
        nodeKey: "id",
        multiple: false,
        showCheckbox: false,
      };
      let res = await post("/web/usc/unit/list", {});
      let back = res.data.map((x) => {
        return {
          ...x,
          id: x.id + "",
          isLeaf: !x.hasLeaf,
        };
      });
      async function checkChild(fuckNodeData) {
        let children = [];
        if (parentList.length > 0) {
          if (parentList.indexOf(fuckNodeData.id + "") > -1) {
            let res = await post("/web/usc/unit/list", {
              parentId: fuckNodeData.id,
            });
            for (let x = 0; x < res.data.length; x++) {
              children.push(
                await checkChild({
                  ...res.data[x],
                  isLeaf: !res.data[x].hasLeaf,
                  id: res.data[x].id + "",
                })
              );
            }
          }
        }
        let back = {
          ...fuckNodeData,
          children,
        };
        return back;
      }
      for (let x = 0; x < back.length; x++) {
        back[x] = await checkChild(back[x]);
      }
      attr["data"] = back;
      attr["load"] = async (node, resolve) => {
        let res = await post("/web/usc/unit/list", {
          parentId: node.data.id,
        });
        let back = res.data.map((x) => {
          return {
            ...x,
            isLeaf: !x.hasLeaf,
            value: x.id,
          };
        });
        return resolve(back);
      };
      return attr;
    },
  }),
  ...showCell(showType.func, {
    showFunc: (data, key) => {
      return data["name"];
    },
  }),
});

// 2023-02-16 要求可以更换上级部门 , 等待讨论
// 同时要求回显之前的部门
export const 新增部门_不带入上级 = btnMaker(
  "新增部门",
  btnActionTemplate.Function,
  {
    elType: "primary",
    function: async (that, data) => {
      let drawerProps = {
        title: "新增部门",
        schema: {
          required: ["name"],
        },
        queryItemTemplate: [
          ...UnitTableCellStorage.getByKeyArr([
            "name",
            "description",
            "orderNumber",
          ]),
        ],
        btnList: [submit],
        data: {},
      };
      that.$modules
        .getModuleApi()
        ["userManage_openDrawerForm"](that, drawerProps);
    },
  },
  ["/web/usc/unit/insert"],
  "新增部门按钮"
);

const 删除部门 = btnMaker(
  "删除",
  btnActionTemplate.Function,
  {
    icon: "Delete",
    elType: "danger",
    function: async (that, data) => {
      if (data.children && data.children.length > 0)
        return ElMessage.warning("【无法删除】：存在子部门");
      if (
        await dobuleCheckBtnMaker(
          "删除部门",
          "确认删除【" + data.name + "】吗？"
        ).catch((x) => false)
      ) {
        let res = await post("/web/usc/unit/delete", {
          id: data.id,
        });
        if (res.message == "成功") {
          ElMessage.success(res.message);
          if (that.close) that.close();
          else refreshDesktop(that);
        } else ElMessage.error(res.message);
      }
    },
  },
  ["/web/usc/unit/delete"],
  "删除部门按钮"
);
const 编辑部门 = btnMaker(
  "编辑",
  btnActionTemplate.Function,
  {
    function: async (that, data) => {
      data.parentId = data.parentId == 0 ? null : data.parentId + "";
      let drawerProps = {
        title: `编辑部门`,
        schema: { required: ["name"] },
        queryItemTemplate: [
          选择上级部门,
          ...UnitTableCellStorage.getByKeyArr([
            "name",
            "description",
            "orderNumber",
          ]),
        ],
        data,
        btnList: [submit],
      };
      that.$modules
        .getModuleApi()
        ["userManage_openDrawerForm"](that, drawerProps);
    },
  },
  ["/web/usc/unit/update"],
  "编辑部门按钮"
);

const btnList = [新增部门];

export const departmentPropsBtnList = [
  { ...新增部门, label: "新增下级部门" },
  删除部门,
  编辑部门,
];

export const departmentBtnList = [
  ...departmentPropsBtnList,
  roleBtnMaker(["/web/usc/unit/list"], "查询部门"),
];
export const departmentDrawerprops = (
  that,
  data,
  options: stringAnyObj = {}
) => {
  that.$modules.getModuleApi()["userManage_openDrawerForm"](that, {
    title: "部门详情",
    queryItemTemplate: [
      ...UnitTableCellStorage.getByLabelArr(["上级部门"]),
      UnitTableCellStorage.getByKey("不带人数"),
      ...UnitTableCellStorage.getByLabelArr([
        "部门人数",
        "部门简介",
        "部门排序",
      ]),
    ],
    btnList: [{ ...新增部门, label: "新增下级部门" }, 删除部门, 编辑部门],
    noEdit: true,
    data: {
      ...data,
    },
    ...options,
  });
};

UnitTableCellStorage.push(
  tableCellTemplateMaker(
    "操作",
    "actionaction",
    actionCell([新增部门, 删除部门, 编辑部门], {
      fixed: "right",
    })
  )
);

export const department = async () => {
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
          treeDataFuncByLevel: async (node, resolve, key = "") => {
            let res = await post("/web/usc/unit/list", {
              parentId: node?.data?.id,
              name: key,
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
          clickItemDetailFunc: (that, data) => {
            departmentDrawerprops(that, data);
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
          searchItemTemplate: userTableSearchTemplate,
          showItemTemplate: UnitTableCellStorage.getByLabelArr([
            "部门名称",
            "部门人数",
            "行政区划",
            "部门排序",
            "操作",
          ]),
          searchFunc: async (query: stringAnyObj, that: stringAnyObj) => {
            if (!query) query = {};
            let res = await post("/web/usc/unit/list", {
              ...query,
              parentId: that.baseData?.unit?.id,
            });
            return res && res.data ? res.data : [];
          },
          searchKeyWithBaseData: ["unit"],
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
