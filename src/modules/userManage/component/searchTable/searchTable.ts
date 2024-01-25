/*
 * @Date: 2022-11-10 08:56:53
 * @LastEditors: CZH
 * @FilePath: /lcdp_fe_setup/src/modules/userManage/component/searchTable/searchTable.ts
 */

import { deepMerge } from "@/components/basicComponents/grid/module/cardApi";
import inputElement, { globalBaseCellDeal } from "./inputElement";
import { useModuleHook } from "@/store/modules/module";
import { useRemoteDictHook } from "@/store/modules/remoteDict";
import { defineEmits } from "vue";
import {
  desktopDataTemplate,
  gridDesktopPropsTemplate,
} from "@/modules/userManage/types";
import { defineComponent, h } from "vue";
import {
  btnCellTemplate,
  stringAnyObj,
  showType,
  tableCellOptions,
  tableCellOptionsTableTemplate,
  tableCellOptionsInputPropertiesTemplate,
  tableCellTemplate,
  formInputType,
} from "@/modules/userManage/types";
import { compile, VNode } from "vue";
import { gridCellTemplate } from "@/components/basicComponents/grid/module/dataTemplate";
import { deepClone } from "@/utils";
import { ElDrawer, ElDivider, ElButton, ElMessage } from "element-plus";
import { customComponent } from "@/modules/userManage/types";

const noDataIcon = "-";

const baseShowFunc = (data, key, isPopover = false) => {
  if (data[key] && data[key] != undefined) return data[key] + "";
  else return noDataIcon;
};

/**
 * @name: searchCellStorage
 * @description: 表单元素存储库构建工具
 * @authors: CZH
 * @Date: 2022-11-10 09:33:04
 */
export class SearchCellStorage {
  storage = [] as tableCellTemplate[];
  labels = [] as string[];
  keys = [] as string[];
  constructor(storage: tableCellTemplate[]) {
    this.storage = storage;
    this.labels = storage.map((x) => {
      return x.label;
    });
    this.keys = storage.map((x) => {
      return x.key;
    });
  }

  getByLabel(label: string, options: tableCellOptions = {}) {
    let back = {} as { [key: string]: any };
    this.storage.map((cell) => {
      if (label && label == cell.label) back = cell;
    });
    if (!back.label) return false;
    if (options) return deepMerge(options, back);
    else
      return {
        input: { type: formInputType.input },
        ...back,
      };
  }

  /**
   * @name: getByLabelArr
   * @description: 使用label获取元素
   * @authors: CZH
   * @Date: 2022-11-30 15:35:47
   * @param {string} labelArr
   */
  getByLabelArr(labelArr: string[], options: tableCellOptions = {}) {
    let back = [];
    for (let key in labelArr) {
      back.push(this.getByLabel(labelArr[key], deepClone(options)));
    }
    return back.filter(Boolean);
  }

  /**
   * @name: getByKey
   * @description: 通过key获取
   * @authors: CZH
   * @Date: 2022-12-02 10:26:40
   * @param {string} key
   * @param {tableCellOptions} options
   */
  getByKey(key: string, options?: tableCellOptions) {
    let back = {} as { [key: string]: any };
    this.storage.map((cell) => {
      if (key && key == cell.key) back = cell;
    });
    if (!back.key) return false;
    if (options) return deepMerge(options, back);
    else
      return {
        input: { type: formInputType.input },
        ...back,
      };
  }

  /**
   * @name: getByKeyArr
   * @description: 使用key获取元素
   * @authors: CZH
   * @Date: 2022-11-30 15:36:15
   * @param {string} keyArr
   */
  getByKeyArr(keyArr: string[], options: tableCellOptions = {}) {
    let back = [];
    for (let key in keyArr) {
      back.push(this.getByKey(keyArr[key], deepClone(options)));
    }
    return back.filter(Boolean);
  }

  /**
   * @name: getAll
   * @description: 获取全部标签，可以使用keyarr字段做排除法
   * @authors: CZH
   * @Date: 2022-12-06 15:48:39
   * @param {string} keyArr
   */
  getAll(expectKeyArr: string[] = [], options: tableCellOptions = {}) {
    let allGetKey = this.storage.map((x) => x.key);
    if (expectKeyArr && expectKeyArr.length > 0)
      allGetKey = allGetKey.filter((x) => {
        return expectKeyArr.indexOf(x) == -1;
      });
    return this.getByKeyArr(allGetKey, deepClone(options));
  }

  /**
   * @name: push
   * @description: 添加一个元素
   * @authors: CZH
   * @Date: 2022-12-06 15:50:51
   * @param {tableCellTemplate} cell
   */
  push(cell: tableCellTemplate) {
    this.storage.push(cell);
  }
}

/**
 * @name: DateCell
 * @description: 创建表单日期显示
 * @authors: CZH
 * @Date: 2022-11-29 14:52:10
 * @param {stringAnyObj} options
 */
export const DateCell = (
  options: stringAnyObj = {},
  inputOptions: stringAnyObj = {}
): tableCellOptions => {
  return {
    ...showCell(showType.func, {
      showFunc: (data: any, key: string) =>
        data[key] ? new Date(data[key] * 1).toLocaleString() : noDataIcon,
      ...options,
    }),
    ...searchCell(formInputType.datePicker, inputOptions),
  };
};

/**
 * @name: DateRangeCell画
 * @description: 创建日期区间
 * @authors: CZH
 * @Date: 2023-01-16 14:11:53
 * @param {stringAnyObj} options
 */
export const DateRangeCell = (
  placeholder: string,
  options: stringAnyObj = {}
): tableCellOptions => {
  return {
    ...showCell(showType.func, {
      showFunc: (data: any, key: string) =>
        new Date(data[key]).toLocaleString(),
      ...options,
    }),
    ...searchCell(formInputType.datePickerRanger, {
      inputOptions: {},
      propertiesOption: {
        "ui:options": {
          "start-placeholder": placeholder + "开始时间",
          "end-placeholder": placeholder + "结束时间",
        },
      },
    }),
  };
};

/**
 * @name: showCell
 * @description: 创建输入单元，表单展示用
 * @authors: CZH
 * @Date: 2022-12-06 14:54:25
 */
export const showCell = (
  showType: showType,
  options?: tableCellOptionsTableTemplate | stringAnyObj
): tableCellOptions => {
  let tableCellOption = {} as tableCellOptions;
  tableCellOption.table = {
    type: showType,
    sortable: true,
    showFunc: baseShowFunc,
    ...options,
  };
  return tableCellOption;
};

/**
 * @name: searchCell
 * @description: 创建搜索单元，表单输入用
 * @authors: CZH
 * @Date: 2022-12-06 14:54:07
 */
export const searchCell = (
  nowformInputType: formInputType,
  options?: tableCellOptionsInputPropertiesTemplate
): tableCellOptions => {
  let tableCellOption = {} as tableCellOptions;
  tableCellOption.input = {
    type: nowformInputType,
    ...options,
  };
  return tableCellOption;
};

/**
 * @name: 在线字典构建
 * @description: remoteDictSelectSearchCell
 * @authors: CZH
 * @Date: 2023-02-13 18:06:59
 */
export const remoteDictSelectSearchCell = (dictKey: string) => {
  let back = {
    ...showCell(showType.func, {
      showFunc: (data, key) => {
        const remoteDictStore = useRemoteDictHook();
        remoteDictStore.getByKey(dictKey)[data[key]];
        return remoteDictStore.keyMap[dictKey]
          ? remoteDictStore.keyMap[dictKey][data[key]] || noDataIcon
          : noDataIcon;
      },
    }),
    ...searchCell(formInputType.remoteDictSelect, {
      dictKey,
      onChangeFunc: async (that, data, key) => {
        const remoteDictStore = useRemoteDictHook();
        const result = remoteDictStore.keyMap[dictKey][data[key]];
        if (!result) {
          delete data[key];
          data[key] = "";
        }
      },
    }),
  } as tableCellOptions;
  return back;
};

export const colorfulIconCell = (
  inputOptions?: tableCellOptionsInputPropertiesTemplate,
  showOptions?: tableCellOptionsTableTemplate
) => {
  return {
    // ...searchCell(),
  };
};

/**
 * @name: staticSelectCell
 * @description: 静态资源选择 展示&输入组合
 * @authors: CZH
 * @Date: 2022-12-06 15:10:13
 * @param {stringAnyObj} inputOptions
 * @param {tableCellOptionsInputPropertiesTemplate} inputProperties
 * @param {tableCellOptionsTableTemplate} showOptions
 */
export const staticSelectCell = (
  inputOptions: stringAnyObj,
  inputProperties?: tableCellOptionsInputPropertiesTemplate,
  showOptions?: tableCellOptionsTableTemplate
) => {
  return {
    ...searchCell(formInputType.select, {
      inputOptions,
      ...inputProperties,
    }),
    ...showCell(showType.func, {
      showFunc: (data, key) => inputOptions[data[key] + ""],
      ...showOptions,
    }),
  };
};

// 构建表单内的数据操作实例
// 也就是操作按钮列表
export const actionCell = (
  btnList: btnCellTemplate[],
  options?: tableCellOptionsTableTemplate | stringAnyObj
) => {
  let tableCellOption = {} as tableCellOptions;
  tableCellOption.table = {
    type: showType.btnList,
    btnList: btnList,
    fixed: "right",
    ...options,
  };
  return tableCellOption;
};

// 禁止操作cell
export const disabledCell = () => {
  return {
    propertiesOption: {
      "ui:options": {
        disabled: true,
      },
    },
  };
};

export const gridCell = (
  girdCell: gridCellTemplate,
  inputProperties?: tableCellOptionsInputPropertiesTemplate,
  showOptions?: tableCellOptionsTableTemplate
) => {
  return {
    ...searchCell(formInputType.gridCellMaker, {
      funcInputOptionsLoader: async () => {
        return;
      },
    }),
    ...showCell(showType.funcComponent, {
      showFunc: (data, key) =>
        defineComponent({
          setup() {
            return () => h(compile(data[key]));
          },
        }),
      ...showOptions,
    }),
  };
};

export const gridDesktopCell = (
  desktopDataTemplate: (
    that: stringAnyObj
  ) => Promise<gridDesktopPropsTemplate> | gridDesktopPropsTemplate,
  options: stringAnyObj = {}
) => {
  return {
    ...searchCell(formInputType.gridDesktop, {
      inputOptions: {
        style: {
          height: "50vh",
          maxHeight: "100vh",
          width: "100%",
        },
        ...options,
      },
      funcInputOptionsLoader: async (that) => {
        let data = await desktopDataTemplate(that);
        return {
          ...data,
          desktopData: await data.desktopData(),
        };
      },
    }),
  };
};

/**
 * @name: richTextCell
 * @description: 富文本编辑匹配展示和输入的cell生成
 * @authors: CZH
 * @Date: 2023-04-25 10:18:19
 */
export const richTextCell = (
  inputProperties?: tableCellOptionsInputPropertiesTemplate,
  showOptions?: tableCellOptionsTableTemplate
) => {
  return {
    ...searchCell(formInputType.richTextArea, {
      ...inputProperties,
      funcInputOptionsLoader: () => {
        return {};
      },
    }),
    ...showCell(showType.funcComponent, {
      showFunc: (data, key) =>
        defineComponent({
          setup() {
            return () => h(compile(data[key]));
          },
        }),
      ...showOptions,
    }),
  };
};

/**
 * @name: tableCellTemplateCell
 * @description: 一个用于嵌套json层级编辑的工具
 * @authors: CZH
 * @Date: 2023-09-25 19:24:18
 */
export const tableCellTemplateCell = (
  tableCellTemplateList: tableCellTemplate[]
) => {
  return {
    ...searchCell(formInputType.tableCellTemplate, {
      funcInputOptionsLoader: (that) => {
        return tableCellTemplateList;
      },
    }),
  };
};

/**
 * @name: htmlLinkCell
 * @description: 只是让外观变得像是一个html链接，实际操作是一个按钮事件,不能用于输入表单的展示
 * @authors: CZH
 * @Date: 2023-04-25 10:34:31
 */
export const htmlLinkCell = (
  btnCell: btnCellTemplate,
  showOptions?: tableCellOptionsTableTemplate
) => {
  return {
    ...showCell(showType.funcComponent, {
      showFunc: (data, key) =>
        defineComponent({
          setup(props, { emit }) {
            return () =>
              h(
                ElButton,
                {
                  type: "primary",
                  link: true,
                  onClick: () => {
                    emit("click", btnCell);
                  },
                },
                data[key]
              );
          },
        }),
      ...showOptions,
    }),
  };
};

export const customComponentMakerForSearchCell = (
  customComponent: customComponent,
  inputProperties?: tableCellOptionsInputPropertiesTemplate
) => {
  return searchCell(formInputType.customComponent, {
    customComponent,
    ...inputProperties,
  });
};

/**
 * @name: tableCellTemplateMaker
 * @description: 表单构建模块
 * @authors: CZH
 * @Date: 2022-11-10 09:17:52
 * @param {string} label
 * @param {string} key
 * @param {tableCellOptions} options
 */
export const tableCellTemplateMaker = (
  label: string,
  key: string,
  options: tableCellOptions = {}
): tableCellTemplate => {
  let back = {
    label,
    key,
    showAble: true,
    table: {
      showFunc: baseShowFunc,
      type: showType.func,
      sortable: false,
      width: "auto",
      style: {
        maxHeight: "120px",
      },
    },
    input: {
      type: formInputType.input,
    },
    ...options,
  } as tableCellTemplate;
  return back;
};

/**
 * @name: propertiesMaker
 * @description: 使用tableCellTemplate 转换为 json schema 的properties 对象
 * @authors: CZH
 * @Date: 2022-11-14 10:39:07
 * @param {tableCellTemplate[]} cellList
 *
 * @param {stringAnyObj} queryItemConfig
 */

export const propertiesMaker = async (
  cellList: tableCellTemplate[],
  that: stringAnyObj,
  needTitle: boolean = false
) => {
  let properties = {} as stringAnyObj;
  if (!cellList || cellList.length == 0) return properties;
  for (let i = 0; i < cellList.length; i++) {
    const cell = cellList[i];
    if (!cell) continue;
    const { input } = cell;
    if (input && input.type) {
      const inputElementDeal = inputElement[cell.input.type];
      if (inputElementDeal && inputElementDeal.properties)
        properties[cell.key] = await inputElementDeal.properties(that, cell);
      else
        console.error(
          `propertiesMaker: inputElement 中没有【${cell.input.type}】组件的定义`
        );
    }
    if (input && input.propertiesOption) {
      properties[cell.key] = deepMerge(
        input.propertiesOption,
        properties[cell.key]
      );
    }
    if (properties[cell.key])
      properties[cell.key] = globalBaseCellDeal(
        cell,
        properties[cell.key],
        needTitle
      );
  }
  return properties;
};

/**
 * @name: uiSchemaMaker
 * @description: 用于配置uiSchema 的自定义表单组件 具体文档 可以参考 https://vue-json-schema-form.lljj.me/zh/guide/adv-config.html#%E8%87%AA%E5%AE%9A%E4%B9%89widget
 * @authors: CZH
 * @Date: 2022-12-07 19:36:12
 */
export const uiSchemaMaker = async (
  cellList: tableCellTemplate[],
  that: stringAnyObj
) => {
  let uiSchema = {} as stringAnyObj;
  for (let i = 0; i < cellList.length; i++) {
    const cell = cellList[i];
    if (!cell) continue;
    const { input } = cell;
    if (input && input.type) {
      const inputElementDeal = inputElement[cell.input.type];
      if (inputElementDeal && inputElementDeal.uiSchema)
        uiSchema[cell.key] = inputElementDeal.uiSchema(that, cell);
    }
  }
  return uiSchema;
};

enum checkType {}
interface checkerOptions {
  type: checkType;
}

/**
 * @name: requireChecker
 * @description: 辅助检查,当表单结果不符合需求时返回false
 * @authors: CZH为
 * @Date: 2023-12-05 10:12:49
 */
export const requireChecker = async (
  that: stringAnyObj,
  otherCheckerList: checkerOptions[] = []
): Promise<boolean> => {
  // 基础检查 - schema require
  console.log(that, otherCheckerList, "start checker");
  let form = null;
  if (that.$refs["VueForm"]) form = that.$refs["VueForm"].$$uiFormRef;
  if (form) await form.validate().catch(() => false);

  const { schema, formData } = that;
  const { required, properties } = schema;
  const formKeys = Object.keys(properties);
  const getKeyLabel = (key) => {
    return properties[key].title || key;
  };
  let back = true;
  if (required && required.length > 0) {
    required.map((x) => {
      if (!formData[x] && formKeys.indexOf(x) != -1) {
        back = false;
        ElMessage.warning(`【${getKeyLabel(x)}】不能空`);
      }
    });
  }
  console.log("fuck", back);
  return back;
};
