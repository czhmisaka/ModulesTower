/*
 * @Date: 2022-11-10 08:56:53
 * @LastEditors: CZH
 * @LastEditTime: 2022-12-08 15:49:05
 * @FilePath: /configforpagedemo/src/modules/userManage/component/searchTable/searchTable.ts
 */

import { deepMerge } from "@/components/basicComponents/grid/module/cardApi";
import inputElement from "./inputElement";
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

/**
 * @name: searchCellStorage
 * @description: 表单元素存储库构建工具
 * @authors: CZH
 * @Date: 2022-11-10 09:33:04
 */
export class SearchCellStorage {
  storage = [] as tableCellTemplate[];
  constructor(storage: tableCellTemplate[]) {
    this.storage = storage;
  }
  getByLabel(label: string, options?: tableCellOptions) {
    let back = {} as { [key: string]: any };
    this.storage.map((cell) => {
      if (label && label == cell.label) back = cell;
    });
    if (!back.label)
      return {
        label: `-${label}-`,
        prop: `no_label_${Math.random()}`,
      };
    if (options) return { ...back, ...options };
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
  getByLabelArr(labelArr: string[]) {
    let back = [];
    for (let key in labelArr) {
      back.push(this.getByKey(labelArr[key]));
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
    if (!back.key) return null;
    if (options) return { ...back, ...options };
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
  getByKeyArr(keyArr: string[]) {
    let back = [];
    for (let key in keyArr) {
      back.push(this.getByKey(keyArr[key]));
    }
    return back.filter(Boolean);
  }
  见;

  /**
   * @name: getAll
   * @description: 获取全部标签，可以使用keyarr字段做排除法
   * @authors: CZH
   * @Date: 2022-12-06 15:48:39
   * @param {string} keyArr
   */
  getAll(expectKeyArr: string[] = []) {
    if (expectKeyArr && expectKeyArr.length > 0)
      return this.storage.filter((cell) => {
        return expectKeyArr.indexOf(cell.key) == -1;
      });
    else return this.storage;
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
 * @name: DataCell
 * @description: 创建表单日期显示
 * @authors: CZH
 * @Date: 2022-11-29 14:52:10
 * @param {stringAnyObj} options
 */
export const DataCell = (options: stringAnyObj = {}): tableCellOptions => {
  return {
    ...showCell(showType.func, {
      showFunc: (data: any, key: string) =>
        new Date(data[key]).toLocaleString(),
      ...options,
    }),
    ...searchCell(formInputType.datePicker),
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
    showFunc: (data: any, key: string) => data[key],
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
  formInputType: formInputType,
  options?: tableCellOptionsInputPropertiesTemplate
): tableCellOptions => {
  let tableCellOption = {} as tableCellOptions;
  tableCellOption.input = {
    type: formInputType,
    ...options,
  };
  return tableCellOption;
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
      showFunc: (data, key) => inputOptions[data[key]],
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
    ...options,
  };
  return tableCellOption;
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
  return {
    label,
    key,
    table: {
      showFunc: (data, key) => data[key],
      type: showType.func,
      sortable: true,
      width: "auto",
      style: {
        maxHeight: "120px",
      },
    },
    input: {
      type: formInputType.input,
    },
    ...options,
  };
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
  that: stringAnyObj
) => {
  let properties = {} as stringAnyObj;
  for (let i = 0; i < cellList.length; i++) {
    const cell = cellList[i];
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
        properties[cell.key],
        input.propertiesOption
      );
    }
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
    const { input } = cell;
    if (input && input.type) {
      const inputElementDeal = inputElement[cell.input.type];
      if (inputElementDeal && inputElementDeal.uiSchema)
        uiSchema[cell.key] = inputElementDeal.uiSchema(that, cell);
    }
  }
  return uiSchema;
};
