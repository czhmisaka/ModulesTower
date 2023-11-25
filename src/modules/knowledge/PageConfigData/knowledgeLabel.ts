/*
 * @Date: 2023-02-08 16:28:14
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-11-14 14:55:12
 * @FilePath: /lcdp_fe_setup/src/modules/knowledge/PageConfigData/knowledgeLabel.ts
 */
import {
  gridCellMaker,
  gridSizeMaker,
  cardComponentType,
  cardOnChangeType,
  gridCellTemplate,
} from "@/components/basicComponents/grid/module/dataTemplate";
import { post, get } from "@/utils/api/requests";
import * as Icons from "@element-plus/icons-vue";
import { ElIcon } from "element-plus";
import {
  btnMaker,
  repBackMessageShow,
} from "@/modules/userManage/component/searchTable/drawerForm";
import {
  SearchCellStorage,
  tableCellTemplateMaker,
  showCell,
  searchCell,
  actionCell,
} from "@/modules/userManage/component/searchTable/searchTable";
import {
  showType,
  formInputType,
  stringAnyObj,
  btnActionTemplate,
  drawerProps,
} from "@/modules/userManage/types";
import { ElMessage, ElMessageBox } from "element-plus";
import { refreshDesktop } from "@/components/basicComponents/grid/module/cardApi";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { useModuleHook } from "@/store/modules/module";
// import { btnCellTemplate } from "@/modules/userManage/types";
import {
  openDrawerFormEasy,
  dobuleCheckBtnMaker,
} from "@/modules/userManage/component/searchTable/drawerForm";
import { dictDataManage } from "@/modules/userManage/PageConfigData/dictDataManage";
import { dictDataManageBtnList } from "@/modules/userManage/PageConfigData/dictDataManage";
import { changeTimeStamp } from "@/utils/api/time/timeStamp";

// 字典页面配置数据
const 知识列表配置数据列 = new SearchCellStorage([
  tableCellTemplateMaker("知识标签", "name"),
  tableCellTemplateMaker(
    "标签描述",
    "description",
    searchCell(formInputType.textarea)
  ),
  tableCellTemplateMaker("创建人", "createUserName"),
  tableCellTemplateMaker("创建时间", "createTime"),
  tableCellTemplateMaker("更新人", "updateUserName"),
  tableCellTemplateMaker("更新时间", "updateTime"),
]);

const 提交知识修改或者新增的按钮 = btnMaker(
  "提交",
  btnActionTemplate.Function,
  {
    elType: "primary",
    function: async (that, data) => {
      let api = "/web/knowledge/label/add";
      if (!data.name) {
        ElMessage({
          type: "info",
          message: "请填写知识标签",
        });
        return;
      }
      let res = await post(api, data);
      // 更新列表数据
      repBackMessageShow(that, res);
    },
  }
);

const 新增标签按钮 = btnMaker(
  "新增标签",
  btnActionTemplate.OpenDrawer,
  {
    elType: "primary",
    icon: "Plus",
    function(that, data) {
      console.log('kkkk')
    },
    drawerProps: {
      title: "新增标签",
      queryItemTemplate: 知识列表配置数据列.getByKeyArr([
        "name",
        "description",
      ]),
      schema: {
        required: ["name", "key"],
      },
      btnList: [提交知识修改或者新增的按钮],
    },
  },
  ["/web/knowledge/label/add"],
  "新增标签"
);

const 编辑标签按钮 = btnMaker(
  "编辑",
  btnActionTemplate.Function,
  {
    elType: "primary",
    function: (that, data) => {
      let drawerProps = {
        title: "编辑知识",
        queryItemTemplate: 知识列表配置数据列.getByKeyArr([
          "name",
          "description",
        ]),
        btnList: [提交知识修改或者新增的按钮],
        schema: {
          required: ["name"],
        },
        data,
      };
      openDrawerFormEasy(that, drawerProps);
    },
  },
  ["/web/knowledge/label/add"],
  "编辑标签"
);

const 删除标签按钮 = btnMaker(
  "删除",
  btnActionTemplate.Function,
  {
    elType: "danger",
    function: async (that, data) => {
      try {
        if ((await dobuleCheckBtnMaker("删除书签" + data.name, "删除")) == true) {
          let res = await post("/web/knowledge/label/delete", { id: data.id });
          repBackMessageShow(that, res);
        }
      } catch {
        return true;
      }
    },
  },
  ["/web/knowledge/label/delete"],
  "删除标签"
);

// 添加操作栏目
知识列表配置数据列.push(
  tableCellTemplateMaker(
    "操作",
    "actionaction",
    actionCell([编辑标签按钮, 删除标签按钮], {
      fixed: "right",
    })
  )
);

// 指定搜索项
export const SearchTemplate = 知识列表配置数据列.getByKeyArr(["name"]);
// 指定列表展示项
export const ShowTemplate = 知识列表配置数据列.getAll();

// 列表可用按钮
const btnList = [新增标签按钮];

// 字典管理页面可用按钮配置表
export const dictManageBtnList = [编辑标签按钮, 删除标签按钮];

/**
 * @name: dictManage
 * @description: 字典数据
 * @authors: CZH
 * @Date: 2023-02-09 15:25:41
 */
export const knowledgeLabel = async () => {
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
          searchItemTemplate: SearchTemplate,
          showItemTemplate: ShowTemplate,
          searchFunc: async (query: stringAnyObj) => {
            if (!query) query = {};
            let res = await post("/web/knowledge/label/page", {
              ...query,
            });
            if (res.data.list) {
              res.data.list.forEach((item) => {
                item.createTime = changeTimeStamp(item.createTime);
                item.updateTime = changeTimeStamp(item.updateTime);
              });
            }
             return res && res.data ? res.data : [];
          },
          defaultQuery: {
          },
          btnList,
          autoSearch: false,
          screenStatus: true,
        },
        isSettingTool: false,
      }
    )
      .setPosition(0, 0)
      .setSize(12, 8),
  ] as gridCellTemplate[];
};
