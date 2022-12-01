/*
 * @Date: 2022-11-10 08:56:53
 * @LastEditors: CZH
 * @LastEditTime: 2022-12-01 10:23:42
 * @FilePath: /configforpagedemo/src/modules/userManage/component/searchTable/searchTable.ts
 */

import { btnCellTemplate } from "./drawerForm";

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

  getAll() {
    return this.storage;
  }
}

export interface PageDataTemplate extends stringAnyObj {
  data: stringAnyObj[];
  pageNum: number;
  pageSize: number;
  total: number;
}

// 主要是懒得重复写了
export interface stringAnyObj {
  [key: string]: any;
}

export interface tableCellOptionsInputPropertiesTemplate {
  // 表单属性
  propertiesOption?: stringAnyObj;
  // 输入值属性，不同输入方式有不同的数据解构方案
  inputOptions?: stringAnyObj;
  // 动态数据输入属性，其他同上
  funcInputOptionsLoader?: (obj: stringAnyObj) => stringAnyObj;
  // 当这个值被修改的时候触发的函数
  onChangeFunc?: (that: stringAnyObj) => void;
  // 一些style
  style?: stringAnyObj;
  [key: string]: any;
}
export interface tableCellOptionsInputTemplate
  extends tableCellOptionsInputPropertiesTemplate {
  type: formInputType;
}
export interface tableCellOptionsTableTemplate {
  showFunc?: (data: any, key: string) => any;
  type: showType;
  style?: stringAnyObj;
  sortable?: boolean;
  [key: string]: any;
}

/**
 * @name: 表格单元配置
 * @description: tableCellOptions
 * @authors: CZH
 * @Date: 2022-11-10 09:30:21
 */
export interface tableCellOptions {
  input?: tableCellOptionsInputTemplate;
  table?: tableCellOptionsTableTemplate;
  [key: string]: any;
}

export enum showType {
  func,
  funcComponent,
  dataKey,
  btnList,
}

/**
 * @name: tableCellTemplate
 * @description: 表格单元
 * @authors: CZH
 * @Date: 2022-11-10 09:52:01
 */
export interface tableCellTemplate extends tableCellOptions {
  label: string;
  key: string;
  [key: string]: any;
}

/**
 * @name: DataCell
 * @description: 创建表单日期显示
 * @authors: CZH
 * @Date: 2022-11-29 14:52:10
 * @param {stringAnyObj} options
 */
export const DataCell = (options: stringAnyObj = {}): tableCellOptions => {
  return showCell(showType.func, {
    showFunc: (data: any, key: string) => new Date(data[key]).toLocaleString(),
    ...options,
  });
};

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

// 构建表单内的数据操作实例
export const actionCell = (btnList: btnCellTemplate[]) => {
  let tableCellOption = {} as tableCellOptions;
  tableCellOption.table = {
    type: showType.btnList,
    btnList: btnList,
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
 * @name: 表单输入类型
 * @description: formInputType
 * @authors: CZH
 * @Date: 2022-11-15 14:15:58
 */
export enum formInputType {
  select = "select",
  selects = "selects",
  inputList = "inputList",
  input = "input",
  areaCascader = "areaCascader",
  datePicker = "datePicker",
  timePicker = "timePicker",
  datePickerRanger = "datePickerRanger",
  timePickerRanger = "timePickerRanger",
  radioGroup = "radioGroup",
  radio = "radio",
  upload = "upload",
  mobile = "mobile",
  idCard = "idCard",
}

/**
 * @name: propertiesMaker
 * @description: 使用tableCellTemplate 转换为 json schema 的properties 对象
 * @authors: CZH
 * @Date: 2022-11-14 10:39:07
 * @param {tableCellTemplate[]} cellList
 * @param {stringAnyObj} queryItemConfig
 */

export const propertiesMaker = async (
  cellList: tableCellTemplate[],
  that: stringAnyObj
) => {
  function base(cell) {
    return {
      title: cell.label,
      type: "string",
    };
  }
  let properties = {} as stringAnyObj;
  for (let i = 0; i < cellList.length; i++) {
    const cell = cellList[i];
    const { input } = cell;
    if (input && input.type)
      if (input.type == formInputType.input) {
        properties[cell.key] = {
          ...base(cell),
          "ui:options": {
            placeholder: "请输入" + cell.label,
          },
        };
      }
    if (input.type == formInputType.datePicker) {
      properties[cell.key] = {
        ...base(cell),
        type: "number",
        format: "date",
      };
    }
    if (input.type == formInputType.radio) {
      properties[cell.key] = {
        ...base(cell),
        type: "boolean",
        "ui:options": {
          placeholder: "请输入" + cell.label,
        },
      };
    }
    if (input.type == formInputType.idCard) {
      properties[cell.key] = {
        ...base(cell),
        "ui:options": {
          placeholder: "请输入" + cell.label,
        },
      };
    }
    if (input.type == formInputType.select) {
      properties[cell.key] = {
        ...base(cell),
        "ui:widget": "SelectWidget",
        "ui:options": {
          attrs: {
            clearable: "true",
          },
        },
      };
      if (input.inputOptions) {
        properties[cell.key] = {
          ...properties[cell.key],
          enum: Object.keys(input.inputOptions),
          enumNames: Object.keys(input.inputOptions).map(
            (x) => input.inputOptions[x]
          ),
        };
      }
      if (input.funcInputOptionsLoader) {
        const inputOptions = await input.funcInputOptionsLoader(that);
        properties[cell.key] = {
          ...properties[cell.key],
          enum: Object.keys(inputOptions),
          enumNames: Object.keys(inputOptions).map((x) => inputOptions[x]),
        };
      }
    }
    if (input.type == formInputType.inputList) {
      properties[cell.key] = {
        ...base(cell),
        "ui:widget": "SelectWidget",
        type: "array",
        uniqueItems: true,
        items: {
          type: "string",
        },
        "ui:options": {
          attrs: {
            clearable: true,
            multiple: true,
            "collapse-tags": true,
            "allow-create": true,
            filterable: true,
          },
        },
      };
      if (input.inputOptions) {
        properties[cell.key].items = {
          ...properties[cell.key].items,
          enum: Object.keys(input.inputOptions),
          enumNames: Object.keys(input.inputOptions).map(
            (x) => input.inputOptions[x]
          ),
        };
      }
      if (input.funcInputOptionsLoader) {
        const inputOptions = await input.funcInputOptionsLoader(that);
        properties[cell.key].items = {
          ...properties[cell.key].items,
          enum: Object.keys(inputOptions),
          enumNames: Object.keys(inputOptions).map((x) => inputOptions[x]),
        };
      }
    }
    if (input.propertiesOption) {
      properties[cell.key] = {
        ...properties[cell.key],
        ...input.propertiesOption,
      };
    }
  }
  console.log(properties, "asdasd");
  return properties;
};
