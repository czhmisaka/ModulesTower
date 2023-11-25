/*
 * @Date: 2023-08-08 17:06:38
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-10-30 13:56:58
 * @FilePath: /lcdp_fe_setup/src/modules/knowledge/PageConfigData/template/templateDetail.ts
 */
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import {
  SearchCellStorage,
  customComponentMakerForSearchCell,
  gridDesktopCell,
  searchCell,
  showCell,
  staticSelectCell,
  tableCellTemplateMaker,
} from "@/modules/userManage/component/searchTable/searchTable";
import {
  btnActionTemplate,
  formInputType,
  gridDesktopPropsTemplate,
  showType,
} from "@/modules/userManage/types";
import iconPicker from "@/modules/userManage/component/searchTable/inputElementComponent/iconPicker.vue";
import { setSize } from "@/components/basicComponents/grid/module/util";
import {
  cardComponentType,
  gridCellMaker,
  gridCellTemplate,
} from "@/components/basicComponents/grid/module/dataTemplate";
import { getAction } from "@/router/util";
import {
  changeCardProperties,
  refreshDesktop,
  upToTopDataChange,
} from "@/components/basicComponents/grid/module/cardApi";
import { deepClone } from "@/components/basicComponents/grid/module/cardApi/deepClone";
import { 图标 } from "@/modules/userManage/PageConfigData/menuManage";
import { 选择部门_多选 } from "@/modules/userManage/PageConfigData/main";
import { 表单属性 } from "../../component/template/formProps";
import { ElMessage, formProps } from "element-plus";
import { reactive, ref } from "vue";
import { deepMerge } from "@/components/basicComponents/grid/module/cardApi";
import {
  makeComponents,
  useAbleComponents,
} from "../../component/template/useAbleComponents";
import { btnMaker } from "@/modules/userManage/component/searchTable/drawerForm";
import { post, request } from "@/utils/api/requests";
import { baseComponents } from "../../component/template/componentsList/baseComponents";
import { gridDesktopComponents } from "../../component/template/componentsList/gridDesktopComponents";

export const 模板图标 = tableCellTemplateMaker("模板图标", "icon", {
  ...customComponentMakerForSearchCell({
    isLocalComponent: true,
    component: iconPicker,
  }),
  ...showCell(showType.funcComponent, {
    style: {
      paddingLeft: "4px",
      display: "inline-block",
      width: "40px",
    },
    showFunc: (data, key) => {
      if (data[key] && data[key][0] == "{")
        return useRenderIcon(JSON.parse(data[key]));
      else if (data[key]) return useRenderIcon(data[key]);
    },
  }),
});

export const queryItemTemplateLocal = reactive({ queryItemTemplate: [] });

const ask = async (word) => {
  // let res = await request.post(
  //   "/api/chat",
  //   {
  //     prompt: word,
  //   },
  //   {
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   }
  // );
  // return res['response']
  let res = await post("/web/intelligence/intellectualWrite", {
    content: word,
  });
  console.log(res.data.info);
  return res.data.info;
};

const AI生成 = btnMaker("AI生成表单", btnActionTemplate.Function, {
  icon: "DataAnalysis",
  elType: "primary",
  isShow: () => false,
  function: async (that, data) => {
    try {
      let res = await ask(
        `假设你作为一名低代码工具的使用者，你会使用的输入方式有：${baseComponents.componentslist
          .map((x) => x.name)
          .join("、")}、${gridDesktopComponents.componentslist
          .map((x) => x.name)
          .join(
            "、"
          )}。请为这些表单的参数选择一个最合适的输入方式:${Object.keys(
          refKeyMap_模板单元智慧写作专用
        )
          .map((x, i) => `${i + 1}.${x}`)
          .join(
            ","
          )}。输出的格式按照 (变量：输出方式)，请使用中文符号，请不要解释你的选择或输出其他无关的文本。`
      );
      const list = res
        .split("\n")
        .map((x) => {
          return x
            ? {
                key: x.split(".")[1].split("：")[0].replace(/\ /g, ""),
                comp: x.split("：")[1],
              }
            : false;
        })
        .filter(Boolean);
      const queryItemTemplate = [];
      list.map((x) => {
        useAbleComponents.map((modules) => {
          modules.componentslist.map((comp) => {
            if (x.comp == comp.name) {
              queryItemTemplate.push({
                ...comp.tableCellMaker,
                label: x.key,
                key: x.key,
                __name: comp.name,
                __key: `key_${(Math.random() + "").replaceAll(".", "")}`,
              });
            }
          });
        });
      });

      let cardProperties = {};
      cardProperties["board"] = {
        queryItemTemplate: queryItemTemplate,
      };
      changeCardProperties(that, cardProperties);
      upToTopDataChange(that, {
        queryItemTemplate,
      });
      ElMessage.success("AI智能生成已完成");
    } catch {
      ElMessage.error("生成失败，请稍后重试，或者使用描述性更强的变量命名");
    }
  },
});

export const btnList = [AI生成];

export const 模板编辑桌面 = async () => {
  const TargetComponent = "board";
  let queryItemTemplate = queryItemTemplateLocal.queryItemTemplate;
  let formProps = {
    layoutColumn: 1,
    inlineFooter: false,
    labelSuffix: "",
    labelPosition: "left",
    isMiniDes: false,
    defaultSelectFirstOption: true,
    labelWidth: "120px",
  };
  let componentPropsLabel = "componentPropsLabel";
  return [
    gridCellMaker(
      "btnList",
      "按钮列表",
      {},
      {
        name: "knowledge_btnList",
        type: cardComponentType.componentList,
      },
      {
        props: {
          btnList,
        },
      }
    )
      .setSize(8, 1)
      .setPosition(4, 0),
    gridCellMaker(
      TargetComponent,
      "展示板面",
      {},
      {
        name: "knowledge_board",
        type: cardComponentType.componentList,
      },
      {
        props: {
          componentPropsLabel: componentPropsLabel,
          defaultFormData: {},
          schema: {
            type: "object",
            properties: {},
          },
          formProps: formProps,
          queryItemTemplate: deepClone(queryItemTemplate),
          queryItemTemplateChange: async (that, list) => {
            let cardProperties = {};
            queryItemTemplate = list;
            cardProperties[TargetComponent] = {
              queryItemTemplate: queryItemTemplate,
            };
            changeCardProperties(that, cardProperties);
            upToTopDataChange(that, {
              queryItemTemplate: queryItemTemplate || [],
            });
            console.log(queryItemTemplate, "asdfuck");
          },
        },
        isSettingTool: false,
      }
    )
      .setSize(8, 14)
      .setPosition(4, 1),
    gridCellMaker(
      "componentsboard",
      "可用组件板面",
      {},
      {
        name: "knowledge_useAbleComponentsList",
        type: cardComponentType.componentList,
      },
      {
        props: {},
      }
    )
      .setSize(4, 15)
      .setPosition(0, 0),
    gridCellMaker(
      "componentPropsLabel",
      "组件属性板面",
      {},
      {
        type: cardComponentType.componentList,
        name: "knowledge_formProps",
      },
      {
        props: {
          title: "组件属性配置",
          queryItemTemplate: [],
          formData: {},
          canUpdate: false,
          onChange: async (that, data) => {
            queryItemTemplate = queryItemTemplate.map((x) => {
              if (x.__key == data.__key) {
                return JSON.parse(JSON.stringify(makeComponents(x, data)));
              } else return x;
            });
            let cardProperties = {};
            cardProperties[TargetComponent] = {
              queryItemTemplate: queryItemTemplate,
            };
            cardProperties["componentPropsLabel"] = {
              formData: data,
            };
            changeCardProperties(that, cardProperties);
          },
        },
      }
    )
      .setSize(6, 15)
      .setPosition(12, 0),
  ] as gridCellTemplate[];
};

export let refKeyMap_模板单元智慧写作专用 = reactive({});
export let useRefKeyMap_模板单元智慧写作专用 = reactive({});
export const 模板单元库 = new SearchCellStorage([
  tableCellTemplateMaker("模板名称", "name"),
  模板图标,
  tableCellTemplateMaker(
    "提示词",
    "content",
    searchCell(formInputType.textarea, {
      inputOptions: {
        height: "128px",
        style: {
          width: "99%",
          fontWeight: "900",
        },
      },
      onChangeFunc: async (that, data) => {
        const { content } = data;
        let keyMap = {};
        content.match(/\{[\s\S]*?\}/g)?.map((i) => {
          let x = i.replace("{", "").replace("}", "");
          keyMap[x] = x;
        });
        refKeyMap_模板单元智慧写作专用 = keyMap;
        refreshDesktop(that);
      },
    })
  ),
  tableCellTemplateMaker(
    "范例",
    "example",
    searchCell(formInputType.richTextArea)
  ),
  tableCellTemplateMaker(
    "",
    "condition",
    gridDesktopCell(
      async (that) => {
        return {
          gridColNum: 18,
          cusStyle: {
            wholeScreen: true,
            maxRows: 15,
            margin: 3,
          },
          componentLists: getAction().getAllComponents(),
          desktopData: 模板编辑桌面,
        } as gridDesktopPropsTemplate;
      },
      {
        style: {
          height: "calc(100vh)",
          maxHeight: "calc(100vh)",
          marginLeft: "-120px",
          width: "calc(100% + 120px)",
        },
      }
    )
  ),
]);
