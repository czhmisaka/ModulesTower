/*
 * @Date: 2022-11-10 08:56:53
 * @LastEditors: CZH
 * @LastEditTime: 2022-11-23 15:02:58
 * @FilePath: /configforpagedemo/src/modules/userManage/component/searchTable/searchTable.ts
 */

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

  getAll() {
    return this.storage;
  }
}

// 主要是懒得重复写了
export interface stringAnyObj {
  [key: string]: any;
}
/**
 * @name: 表格单元配置
 * @description: tableCellOptions
 * @authors: CZH
 * @Date: 2022-11-10 09:30:21
 */
export interface tableCellOptions {
  input?: {
    type: formInputType;
    inputOptions?: stringAnyObj;
    style?: stringAnyObj;
    [key: string]: any;
  };
  table?: {
    showFunc: (data: any, key: string) => any;
    type: showType;
    style?: stringAnyObj;
    [key: string]: any;
  };
  [key: string]: any;
}

export enum showType {
  func,
  funcComponent,
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

export const DataCell = (): tableCellOptions => {
  let tableCellOption = {} as tableCellOptions;
  tableCellOption.table = {
    type: showType.func,
    showFunc: (data: any, key: string) => {
      return new Date(data[key]).toLocaleString() as any;
    },
  };
  return tableCellOption;
};

export const showCell = (formInputType: formInputType): tableCellOptions => {
  let tableCellOption = {} as tableCellOptions;
  let showFunc = null;
  tableCellOption.table = {
    type: showType.func,
    showFunc: (data: any, key: string) => {},
  };
  return tableCellOption;
};

export const searchCell = (formInputType: formInputType): tableCellOptions => {
  let tableCellOption = {} as tableCellOptions;
  tableCellOption.input = {
    type: formInputType,
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
  options: tableCellOptions = {
    table: {
      showFunc: (data, key) => data[key],
      type: showType.func,
      style: {
        maxHeight: "120px",
      },
    },
  }
): tableCellTemplate => {
  return {
    label,
    key,
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

export const propertiesMaker = (
  cellList: tableCellTemplate[],
  queryItemConfig: stringAnyObj[] = []
) => {
  let properties = {} as stringAnyObj;
  cellList.map((cell) => {
    const { input } = cell;
    if (input)
      switch (input.type) {
        case formInputType.input:
          properties[cell.key] = {
            title: cell.label,
            type: "string",
            "ui:options": {
              placeholder: "请输入" + cell.label,
            },
          };
          break;
        case formInputType.datePicker:
          properties[cell.key] = {
            title: cell.label,
            type: "number",
            format: "date",
          };
          break;
        case formInputType.radio:
          properties[cell.key] = {
            title: cell.label,
            type: "string",
            "ui:options": {
              placeholder: "请输入" + cell.label,
            },
          };
          break;
        case formInputType.idCard:
          properties[cell.key] = {
            title: cell.label,
            type: "string",
            "ui:options": {
              placeholder: "请输入" + cell.label,
            },
          };
      }
  });
  return properties;
};
