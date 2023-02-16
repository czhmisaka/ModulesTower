/*
 * @Date: 2023-02-14 16:00:45
 * @LastEditors: CZH
 * @LastEditTime: 2023-02-16 19:07:05
 * @FilePath: /configforpagedemo/src/modules/userManage/PageConfigData/user/userValueManage.ts
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
  remoteDictSelectSearchCell,
} from "@/modules/userManage/component/searchTable/searchTable";
import {
  btnActionTemplate,
  formInputType,
  showType,
  stringAnyObj,
  drawerProps,
} from "@/modules/userManage/types";
import {
  btnMaker,
  dobuleCheckBtnMaker,
} from "@/modules/userManage/component/searchTable/drawerForm";
import { ElMessage, ElMessageBox } from "element-plus";
import { refreshDesktop } from "@/components/basicComponents/grid/module/cardApi";
import { tableCellTemplate } from "../../types";
import { repBackMessageShow } from "@/modules/userManage/component/searchTable/drawerForm";
import { openDrawerFormEasy } from "../../component/searchTable/drawerForm";
import { staticSelectCell } from "../../component/searchTable/searchTable";

const tfConfig = {
  true: "允许",
  false: "不允许",
};

export const userFieldTypeConfig = {
  input: "Text",
  number: "数字",
  datePicker: "日期",
  mobile: "手机号",
  uploadImage: "图片上传",
  remoteDictSelect: "在线字典",
};
const valueListApi = "/web/usc/customize/field/list/";

/**
 * @name: userFieldStorage
 * @description: 获取用户表单中的额外字段
 * @authors: CZH
 * @Date: 2023-02-16 19:02:22
 */
export const userFieldStorage = async () => {
  let res = await post(valueListApi, {});
  const list = res.data;
  let userFieldStorage = new SearchCellStorage([]);
  list.map((cell) => {
    let inputOptions = {};
    if (cell.type == formInputType.remoteDictSelect) {
      userFieldStorage.push(
        tableCellTemplateMaker(
          cell.name,
          cell.key,
          remoteDictSelectSearchCell(cell["fieldOptions"])
        )
      );
    } else {
      userFieldStorage.push(
        tableCellTemplateMaker(cell.name, cell.key, {
          ...searchCell(cell.type, inputOptions),
        })
      );
    }
  });
  return userFieldStorage;
};

const 用户字段存储库 = new SearchCellStorage([
  tableCellTemplateMaker("字段名", "name"),
  tableCellTemplateMaker(
    "用户可编辑",
    "updateTerm",
    staticSelectCell(tfConfig)
  ),
  tableCellTemplateMaker("用户可查看", "showTerm", staticSelectCell(tfConfig)),
  tableCellTemplateMaker(
    "排序",
    "orderNumber",
    searchCell(formInputType.number)
  ),
  tableCellTemplateMaker(
    "类型",
    "type",
    staticSelectCell(userFieldTypeConfig, {
      onChangeFunc: async (that, data) => {
        let back = 用户字段存储库.getByKeyArr([
          "name",
          "updateTerm",
          "showTerm",
          "type",
        ]);
        if (data.type == formInputType.remoteDictSelect) {
          back.push(用户字段存储库.getByKey("fieldOptions"));
        }
        return back;
      },
    })
  ),
  tableCellTemplateMaker(
    "字典key",
    "fieldOptions",
    searchCell(formInputType.searchList, {
      funcInputOptionsLoader: async (that) => {
        let attr = {
          multiple: false,
        };
        attr["remoteMethod"] = async (query) => {
          let res = await post("/web/usc/dict/page", {
            name: query,
          });
          return res.data.list.map((x) => {
            return {
              value: x.key + "",
              label: x.name,
            };
          });
        };
        return attr;
      },
    })
  ),
]);

const 新增或编辑用户字段的提交按钮 = btnMaker(
  "提交",
  btnActionTemplate.Function,
  {
    elType: "primary",
    function: async (that, data) => {
      let api = "/web/usc/customize/field/insert";
      if (data.id) api = api.replace("insert", "update");
      let res = await post(api, data);
      repBackMessageShow(that, res);
    },
  }
);

const 用户字段表单 = {
  title: "新增用户字段",
  schema: {
    required: ["name", "updateTerm", "showTerm", "type"],
  },
  queryItemTemplate: 用户字段存储库.getByKeyArr([
    "name",
    "updateTerm",
    "showTerm",
    "type",
  ]),
  btnList: [新增或编辑用户字段的提交按钮],
} as drawerProps;

const 新增用户字段按钮 = btnMaker(
  "新增",
  btnActionTemplate.OpenDrawer,
  {
    drawerProps: 用户字段表单,
  },
  ["/web/usc/customize/field/insert", "/web/usc/dict/page"],
  "新增用户字段按钮"
);

const 编辑用户字段按钮 = btnMaker(
  "编辑",
  btnActionTemplate.Function,
  {
    function: async (that, data) => {
      let drawerProps = {
        ...用户字段表单,
        data: {
          ...data,
          showTerm: data.showTerm + "",
          updateTerm: data.updateTerm + "",
        },
      } as drawerProps;
      openDrawerFormEasy(that, drawerProps);
    },
  },
  ["/web/usc/customize/field/update", "/web/usc/dict/page"],
  "编辑用户字段按钮"
);

const 删除用户字段按钮 = btnMaker(
  "删除",
  btnActionTemplate.Function,
  {
    elType: "primary",
    function: async (that, data) => {
      let api = "/web/usc/customize/field/delete";
      if (
        await dobuleCheckBtnMaker("确认删除", data.name).catch(() => {
          return false;
        })
      ) {
        let res = await post(api, data);
        repBackMessageShow(that, res);
      }
    },
  },
  ["/web/usc/customize/field/delete"],
  "删除用户字段按钮"
);

const btnList = [新增用户字段按钮];

用户字段存储库.push(
  tableCellTemplateMaker(
    "操作",
    "action",
    actionCell([编辑用户字段按钮, 删除用户字段按钮], {
      fixed: "right",
      noDetail: true,
    })
  )
);

export const userValueManageBtnList = [
  编辑用户字段按钮,
  删除用户字段按钮,
  新增用户字段按钮,
];

export const userFieldList = async () => {
  const showModel = btnMaker("测试展示表单", btnActionTemplate.Function, {
    function: async (that, data) => {
      let storage = await userFieldStorage();
      let drawerProps = {
        title: "",
        queryItemTemplate: storage.getAll(),
      };
      openDrawerFormEasy(that, drawerProps);
    },
  });
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
          searchItemTemplate: [],
          showItemTemplate: 用户字段存储库.getAll(["fieldOptions"]),
          searchFunc: async (query: stringAnyObj, that: stringAnyObj) => {
            let res = await post(valueListApi, {
              ...query,
            });
            if (!res.data["list"]) res.data["list"] = [];
            if (!res.data["data"]) res.data["data"] = res.data["list"];
            return res.data;
          },
          autoSearch: true,
          searchKeyWithBaseData: ["unit"],
          defaultQuery: {},
          btnList: [...btnList, showModel],
        },
        isSettingTool: false,
      }
    )
      .setPosition(0, 0)
      .setSize(12, 8),
  ] as gridCellTemplate[];
};
