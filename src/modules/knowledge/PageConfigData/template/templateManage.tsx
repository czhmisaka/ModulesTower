/*
 * @Date: 2023-08-08 14:59:36
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-10-31 17:18:43
 * @FilePath: /lcdp_fe_setup/src/modules/knowledge/PageConfigData/template/templateManage.tsx
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
import { ElIcon, ElLoading, ElTag } from "element-plus";

import {
  btnMaker,
  dobuleCheckBtnMaker,
  openDrawerFormEasy,
} from "@/modules/userManage/component/searchTable/drawerForm";
import {
  SearchCellStorage,
  tableCellTemplateMaker,
  showCell,
  searchCell,
  actionCell,
  customComponentMakerForSearchCell,
  staticSelectCell,
  DateCell,
  DateRangeCell,
  remoteDictSelectSearchCell,
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
  deepMerge,
  refreshDesktop,
} from "@/components/basicComponents/grid/module/cardApi";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { useModuleHook } from "@/store/modules/module";

import { repBackMessageShow } from "@/modules/userManage/component/searchTable/drawerForm";
import { getModuleFromView } from "@/router/util";
import iconPicker from "@/modules/userManage/component/searchTable/inputElementComponent/iconPicker.vue";
import { queryItemTemplateLocal, 模板单元库 } from "./templateDetail";
import {
  getUseAbleComponents,
  makeComponents,
  useAbleComponents,
} from "../../component/template/useAbleComponents";
import { questionAnswer } from "../questionAnswer";
import { defineComponent } from "vue";

const openDrawer = (that: stringAnyObj, drawerProps: drawerProps) => {
  that.drawerData = drawerProps;
  that.$refs["drawer"].open();
};
const 发布状态 = {
  "1": "未发布",
  "2": "已发布",
}
const templateCellStorage = new SearchCellStorage([
  tableCellTemplateMaker("id", "id"),
  tableCellTemplateMaker("名称", "name"),
  tableCellTemplateMaker("状态", "status", {
    ...staticSelectCell(发布状态),
    ...showCell(showType.funcComponent, {
      showFunc: (row, key) => {
        return defineComponent({
          setup() {
            return () => (
              <div
                style={{
                  float: "left",
                  marginTop: "-2px",
                  marginRight: "3px",
                }}
              >
                <ElTag type={row[key] == 1 ? "info" : "success"} size="small">
                  {发布状态[row[key]]}
                </ElTag>
              </div>
            );
          },
        });
      },
    }),
  }),
  tableCellTemplateMaker("创建时间", "createTime", DateCell()),
  tableCellTemplateMaker("发布时间", "publishTime", DateCell()),
]);
const 搜索项目字段库 = new SearchCellStorage([
  // tableCellTemplateMaker("名称", "name"),
  tableCellTemplateMaker("关键字", "keyword"),
  tableCellTemplateMaker("发布时间", "publishTime", DateRangeCell("发布时间")),
  tableCellTemplateMaker("创建时间", "createTime", DateRangeCell("创建时间")),
  templateCellStorage.getByKey("status"),
]);

const 创建模板_提交 = btnMaker("提交", btnActionTemplate.Function, {
  function: async (that, data) => {
    // 保存
    queryItemTemplateLocal.queryItemTemplate = [];
    const { condition, name, content, icon, example } = data;
    let res = await post("/web/knowledge//template/save", {
      name,
      icon,
      content,
      condition: JSON.stringify(condition),
      example,
    });
    repBackMessageShow(that, res);
  },
});

const 编辑模板_提交 = btnMaker("提交", btnActionTemplate.Function, {
  function: async (that, data) => {
    // 保存
    const { condition, name, content, icon, id, example } = data;
    let res = await post("/web/knowledge/template/update", {
      id,
      name,
      icon,
      example,
      content,
      condition: JSON.stringify(condition),
    });
    repBackMessageShow(that, res);
  },
});

const 范例预览 = tableCellTemplateMaker(
  "输入预览",
  "preView",
  searchCell(formInputType.textarea, {
    disabled: true,
  })
);

const 预览模板 = btnMaker("预览模板", btnActionTemplate.Function, {
  function: async (that, data) => {
    // 保存
    const { condition, name, context } = data;
    let queryItemTemplate = [];
    condition.queryItemTemplate.map((x) => {
      queryItemTemplate.push(
        makeComponents(getUseAbleComponents(x.__name).tableCellMaker, x)
      );
    });
    openDrawer(that, {
      title: name,
      formProps: {
        labelPosition: "top",
      },
      queryItemTemplate: [...queryItemTemplate],
      data: {},
    });
  },
});

const 预览模板h5 = btnMaker("预览模板h5", btnActionTemplate.Function, {
  function: async (that, data) => {
    // 保存
    const { condition, name, context } = data;
    let queryItemTemplate = [];
    condition.queryItemTemplate.map((x) => {
      queryItemTemplate.push(
        makeComponents(getUseAbleComponents(x.__name).tableCellMaker, x)
      );
    });
    openDrawer(that, {
      title: name,
      size: 20,
      formProps: {
        labelPosition: "top",
      },
      queryItemTemplate: [...queryItemTemplate],
      data: {},
    });
  },
});

const 新增模板 = btnMaker("新增模板", btnActionTemplate.Function, {
  icon: "Plus",
  elType: "primary",
  function: async (that, data) => {
    queryItemTemplateLocal.queryItemTemplate = [];
    let drawerProps = {
      size: 90,
      queryItemTemplate: 模板单元库.getAll(),
      schema: {
        required: ["content", "name", "icon"],
      },
      btnList: [创建模板_提交, 预览模板, 预览模板h5],
      data: {
        content:
          "在大扩号内输入即可成为注入{变量},请务必保持各个变量的名字不同,比如{变量1}{变量2}",
        icon: '{"color":"#E6A23C","iconType":"elicon","src":"BellFilled"}',
        name: "新模板",
      },
    } as drawerProps;
    openDrawerFormEasy(that, drawerProps);
  },
});

const 编辑模板 = btnMaker("编辑", btnActionTemplate.Function, {
  icon: "Edit",
  elType: "primary",
  isDisable(data) {
    return data.status == 2;
  },
  function: async (that, data) => {
    const loading = ElLoading.service({
      lock: true,
      text: "模板加载中",
      background: "rgba(0, 0, 0, 0.7)",
    });
    let res = await get("/web/knowledge//template/detail?id=" + data.id, {});
    queryItemTemplateLocal.queryItemTemplate = JSON.parse(
      res.data.condition
    ).queryItemTemplate;
    let drawerProps = {
      size: 90,
      queryItemTemplate: 模板单元库.getAll(),
      schema: {
        required: ["content", "name", "icon"],
      },
      btnList: [编辑模板_提交, 预览模板, 预览模板h5],
      data: {
        ...res.data,
      },
    };
    openDrawerFormEasy(that, drawerProps);
    loading.close();
  },
});

const 发布模板 = btnMaker("发布", btnActionTemplate.Function, {
  isShow: (data) => {
    return data.status == 1;
  },
  function: async (that, data) => {
    if (await dobuleCheckBtnMaker("发布模板", data.name).catch((x) => false)) {
      let res = await post("/web/knowledge//template/operate", {
        id: data.id,
        isOnline: true,
      });
      repBackMessageShow(that, res);
    }
  },
});

const 取消发布模板 = btnMaker("取消发布", btnActionTemplate.Function, {
  isShow: (data) => {
    return data.status == 2;
  },
  function: async (that, data) => {
    if (
      await dobuleCheckBtnMaker("取消发布模板", data.name).catch((x) => false)
    ) {
      let res = await post("/web/knowledge//template/operate", {
        id: data.id,
        isOnline: false,
      });
      repBackMessageShow(that, res);
    }
  },
});

const 删除模板 = btnMaker("删除", btnActionTemplate.Function, {
  isDisable(data) {
    return data.status == 2;
  },
  function: async (that, data) => {
    if (await dobuleCheckBtnMaker("删除模板", data.name).catch((x) => false)) {
      let res = await post("/web/knowledge//template/delete/" + data.id, {});
      repBackMessageShow(that, res);
    }
  },
});

templateCellStorage.push(
  tableCellTemplateMaker(
    "操作",
    "asd",
    actionCell([编辑模板, 发布模板, 取消发布模板, 删除模板], {})
  )
);

export const 模板列表搜索页面 = async () => {
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
          searchItemTemplate: 搜索项目字段库.getAll(),
          showItemTemplate: templateCellStorage.getByKeyArr([
            "name",
            "status",
            "createTime",
            "publishTime",
            "asd",
          ]),
          searchFunc: async (query: stringAnyObj) => {
            if (!query) query = {};
            const { publishTime, createTime } = query;
            if (publishTime && publishTime.length > 0) {
              query.publishStartTime = publishTime[0];
              if (publishTime.length > 1)
                query.publishEndTime = publishTime[1] + 24 * 3600 * 1000 - 1;
            } else {
              delete query.publishStartTime;
              delete query.publishEndTime;
            }
            if (createTime && createTime.length > 0) {
              query.createStartTime = createTime[0];
              if (createTime.length > 1)
                query.createEndTime = createTime[1] + 24 * 3600 * 1000 - 1;
            } else {
              delete query.createStartTime;
              delete query.createEndTime;
            }
            query.keyword = query.name;
            delete query.name;
            let res = await post("/web/knowledge//template/page", { ...query });
            return res.data;
          },
          defaultQuery: {
            showLink: null,
          },
          btnList: [新增模板],
          autoSearch: false,
          screenStatus: true
        },
        isSettingTool: false,
      }
    )
      .setPosition(0, 0)
      .setSize(12, 8),
  ] as gridCellTemplate[];
};
