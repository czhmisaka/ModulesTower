/*
 * @Date: 2022-12-02 11:00:29
 * @LastEditors: CZH
 * @LastEditTime: 2022-12-05 09:35:08
 * @FilePath: /configforpagedemo/src/modules/userManage/types.ts
 */

export interface stringAnyObj {
  [key: string]: any;
}

export enum closeType {
  outLayerClickClose,
  btnClose,
}

/**
 * @name: btnCell
 * @description: 自定义事件按钮
 * @authors: CZH
 * @Date: 2022-11-21 17:11:45
 */
export enum btnActionTemplate {
  OpenDrawer = "OpenDrawer",
  Function = "Function",
  Url = "Url",
}

/**
 * @name: drawerProps
 * @description: 弹窗属性事件
 * @authors: CZH
 * @Date: 2022-11-23 22:49:56
 */
export interface drawerProps {
  title: string;
  queryItemTemplate: tableCellOptions[];
  schema?: stringAnyObj;
  btnList?: btnCellTemplate[];
  data?: stringAnyObj;
  noEdit?: boolean;
  afterFunction?: (closeType: closeType, that: stringAnyObj) => void;
}

/**
 * @name: btnCellTemplate
 * @description: 按钮对象
 * @authors: CZH
 * @Date: 2022-11-23 22:50:42
 */
export interface btnCellTemplate extends stringAnyObj {
  isShow: (data: stringAnyObj) => boolean;
  isDisable: (data: stringAnyObj) => boolean;
  label: string;
  type: btnActionTemplate;
  icon?: "";
  elType?: "success" | "danger" | "primary" | "warning";
  drawerDetail?: drawerProps;
  function?: (that: stringAnyObj, data?: stringAnyObj) => void;
  url?: string;
}

export interface PageDataTemplate extends stringAnyObj {
  data: stringAnyObj[];
  pageNum: number;
  pageSize: number;
  total: number;
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
  fixed?: "left" | "none" | "right";
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


export default {}