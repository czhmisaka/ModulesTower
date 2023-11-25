/*
 * @Date: 2023-02-28 18:21:13
 * @LastEditors: CZH
 * @LastEditTime: 2023-11-07 15:04:28
 * @FilePath: /lcdp_fe_setup/src/modules/ApplicationManage/PageConfigData/appGroupManage.ts
 */
import {
  gridCellMaker,
  gridSizeMaker,
  cardComponentType,
  cardOnChangeType,
  gridCellTemplate,
} from "@/components/basicComponents/grid/module/dataTemplate";
import { post, get } from "@/utils/api/requests";
import { ElIcon } from "element-plus";
import {
  allProcessDobuleCheckBtnMaker,
  btnMaker,
  openDrawerFormEasy,
} from "@/modules/userManage/component/searchTable/drawerForm";
import {
  SearchCellStorage,
  tableCellTemplateMaker,
  showCell,
  searchCell,
  actionCell,
  remoteDictSelectSearchCell,
  staticSelectCell,
} from "@/modules/userManage/component/searchTable/searchTable";
import {
  showType,
  formInputType,
  stringAnyObj,
  btnActionTemplate,
  drawerProps,
} from "@/modules/userManage/types";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  changeCardProperties,
  refreshDesktop,
} from "@/components/basicComponents/grid/module/cardApi";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { useModuleHook } from "@/store/modules/module";
import { btnCellTemplate } from "@/modules/userManage/types";
import { repBackMessageShow } from "@/modules/userManage/component/searchTable/drawerForm";
import { defineComponent } from "vue";
import { ElTag } from "element-plus";
import { dobuleCheckBtnMaker } from "../../userManage/component/searchTable/drawerForm";
import * as Icons from "@element-plus/icons-vue";
import { customComponentMakerForSearchCell } from "../../userManage/component/searchTable/searchTable";
import iconPicker from "@/modules/userManage/component/searchTable/inputElementComponent/iconPicker.vue";

export const 应用分类管理字段库 = new SearchCellStorage([
  tableCellTemplateMaker("分类名称", "name"),
  tableCellTemplateMaker(
    "描述",
    "description",
    searchCell(formInputType.textarea)
  ),
]);

const 删除应用分类 = allProcessDobuleCheckBtnMaker(
  "删除",
  "删除应用分类",
  (that, data) => `确认删除【${data["name"]}】`,
  async (that, data) => {
    let res = await post("/web/app/group/delete", {
      ...data,
    });
    repBackMessageShow(that, res);
  }
);

const 编辑应用分类 = btnMaker("编辑", btnActionTemplate.Function, {
  icon: "Edit",
  function: async (that, data) => {
    let drawerProps = {
      title: data.name,
      schema: { required: ["name"] },
      queryItemTemplate: 应用分类管理字段库.getAll(["asd"]),
      btnList: [
        btnMaker("提交", btnActionTemplate.Function, {
          function: async (that, data) => {
            if (
              await dobuleCheckBtnMaker(
                "提交编辑",
                `确认提交应用分类【${data.name}】`
              ).catch((x) => false)
            ) {
              let res = await post("/web/app/group/update", data);
              repBackMessageShow(that, res);
            }
          },
        }),
      ],
      data,
    } as drawerProps;
    openDrawerFormEasy(that, drawerProps);
  },
});

const 新增应用分类 = btnMaker("新增应用分类", btnActionTemplate.Function, {
  icon: "Plus",
  elType: "primary",
  function: async (that, data) => {
    let drawerProps = {
      title: "新增应用分类",
      schema: { required: ["name"] },
      queryItemTemplate: 应用分类管理字段库.getAll(["asd"]),
      btnList: [
        btnMaker("提交", btnActionTemplate.Function, {
          function: async (that, data) => {
            if (
              await dobuleCheckBtnMaker(
                "新增应用分类",
                `确认新增应用分类【${data.name}】`
              ).catch((x) => false)
            ) {
              let res = await post("/web/app/group/insert", data);
              repBackMessageShow(that, res);
            }
          },
        }),
      ],
    } as drawerProps;
    openDrawerFormEasy(that, drawerProps);
  },
});

应用分类管理字段库.push(
  tableCellTemplateMaker(
    "操作",
    "asd",
    actionCell([删除应用分类, 编辑应用分类], {
      fixed: "right",
      noDetail: true,
    })
  )
);

const 切换到列表 = btnMaker("切换模式", btnActionTemplate.Function, {
  function: async (that, data) => {
    changeCardProperties(that, {
      searchTable: {
        isCard: !that.isCard,
      },
    });
  },
});

export const AppGroupManage = async () => {
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
          searchItemTemplate: [应用分类管理字段库.getByKey("name")],
          showItemTemplate: 应用分类管理字段库.getAll(),
          searchFunc: async (data: stringAnyObj) => {
            let query = JSON.parse(JSON.stringify(data));
            if (!query) query = {};
            let res = await post("/web/app/group/page", { ...query });
            return res.data.list.map((x) => {
              return {
                ...x,
              };
            });
          },
          defaultQuery: {
            showLink: null,
          },
          btnList: [新增应用分类, 切换到列表],
          autoSearch: false,
        },
        isSettingTool: false,
      }
    )
      .setPosition(0, 0)
      .setSize(12, 8),
  ] as gridCellTemplate[];
};
