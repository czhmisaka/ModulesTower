/*
 * @Date: 2023-02-14 16:00:45
 * @LastEditors: CZH
 * @LastEditTime: 2023-02-15 16:28:57
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

const tfConfig = {
  true: "允许",
  false: "不允许",
};

const 用户字段存储库 = new SearchCellStorage([
  tableCellTemplateMaker("字段名", "name"),
  tableCellTemplateMaker("类型", "type"),
  tableCellTemplateMaker(
    "用户可编辑",
    "updateTerm",
    searchCell(formInputType.select, {
      inputOptions: tfConfig,
    })
  ),
  tableCellTemplateMaker(
    "用户可查看",
    "showTerm",
    searchCell(formInputType.select, {
      inputOptions: tfConfig,
    })
  ),
  tableCellTemplateMaker(
    "排序",
    "orderNumber",
    searchCell(formInputType.number)
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
  ["/web/usc/customize/field/insert"],
  "新增用户字段按钮"
);

const 编辑用户字段按钮 = btnMaker(
  "编辑",
  btnActionTemplate.Function,
  {
    function: async (that, data) => {
      let drawerProps = {
        ...用户字段表单,
        data,
      } as drawerProps;
      openDrawerFormEasy(that, drawerProps);
    },
  },
  ["/web/usc/customize/field/update"],
  "编辑用户字段按钮"
);

const 删除用户字段按钮 = btnMaker("删除", btnActionTemplate.Function, {
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
});

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

export const userFieldList = async () => {
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
          showItemTemplate: 用户字段存储库.getAll(),
          searchFunc: async (query: stringAnyObj, that: stringAnyObj) => {
            let res = await post("/web/usc/customize/field/list/", {
              ...query,
            });
            if (!res.data["list"]) res.data["list"] = [];
            if (!res.data["data"]) res.data["data"] = res.data["list"];
            return res.data;
          },
          autoSearch: true,
          searchKeyWithBaseData: ["unit"],
          defaultQuery: {},
          btnList,
        },
        isSettingTool: false,
      }
    )
      .setPosition(0, 0)
      .setSize(12, 8),
  ] as gridCellTemplate[];
};
