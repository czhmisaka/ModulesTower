/*
 * @Date: 2022-12-02 11:00:29
 * @LastEditors: CZH
 * @LastEditTime: 2023-02-27 21:15:13
 * @FilePath: /configforpagedemo/src/modules/userManage/types.ts
 */

import { gridCellTemplate } from "@/components/basicComponents/grid/module/dataTemplate";

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
  size?: number;

  schema?: stringAnyObj;
  data?: stringAnyObj;
  //  true 纯数据展示模式
  noEdit?: boolean;
  //  true 开启桌面模式 （需要搭配 gridDesktopConfig 属性使用
  gridDesktop?: boolean;
  gridDesktopConfig?: desktopDataTemplate;
  // 表单输入服务
  queryItemTemplate?: tableCellOptions[];

  // 针对当前表单的按钮服务
  btnList?: btnCellTemplate[];

  afterFunction?: (closeType: closeType, that: stringAnyObj) => void;
}

/**
 * @name: gridDesktopConfigTemplate
 * @description: 调起完整桌面服务的配置
 * @authors: CZH
 * @Date: 2023-02-09 14:55:34
 */
export interface desktopDataTemplate {
  desktopData?: () => Promise<gridCellTemplate[]> | gridCellTemplate[];
  gridColNum?: number;
  cusStyle?: {
    wholeScreen: boolean;
    maxRows: number;
    margin: number;
  };
  preBaseData?: stringAnyObj;
  permission?: stringAnyObj[];
  dataPermission?: stringAnyObj[];
  btnList?: btnCellTemplate[];
  Fullscreen?: boolean;
}

/**
 * @name: btnCellTemplate
 * @description: 按钮对象
 * @authors: CZH
 * @Date: 2022-11-23 22:50:42
 */
export interface btnCellTemplate extends stringAnyObj {
  isShow: (data: stringAnyObj, btn: btnCellTemplate) => boolean;
  isDisable: (data: stringAnyObj) => boolean;
  label: string;
  type: btnActionTemplate;
  icon?: string;
  elType?: "success" | "danger" | "primary" | "warning";
  drawerDetail?: drawerProps;
  function?: (that: stringAnyObj, data?: stringAnyObj) => void;
  url?: string;
  apiList: string[];
  showAbleKey: string;
}

export interface PageDataTemplate extends stringAnyObj {
  data: stringAnyObj[];
  pageNum: number;
  pageSize: number;
  total: number;
}

export interface tableCellOptionsInputPropertiesTemplate {
  // 字典属性
  dictKey?: string;
  // 表单属性
  propertiesOption?: stringAnyObj;
  // 输入值属性，不同输入方式有不同的数据解构方案
  inputOptions?: stringAnyObj;
  // 动态数据输入属性，其他同上
  funcInputOptionsLoader?: (
    obj: stringAnyObj
  ) => stringAnyObj | Promise<stringAnyObj>;
  // 当这个值被修改的时候触发的函数
  onChangeFunc?: (
    that: stringAnyObj,
    data: stringAnyObj
  ) => Promise<tableCellOptions[] | void> | tableCellOptions[] | void;
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
  customSelect = "customSelect",
  select = "select",
  selects = "selects",
  number = "number",
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
  uploadImage = "uploadImage",
  mobile = "mobile",
  idCard = "idCard",
  treeSelect = "treeSelect",
  treeSelectRemote = "treeSelectRemote",
  searchList = "searchList",
  indexListForSwitch = "indexListForSwitch",
  botton = "botton",
  searchTable = "searchTable",
  component = "component",
  remoteDictSelect = "remoteDictSelect",
}

/**
 * @name:  搭配formInputType规范组件注册函数的使用方案
 * @description: waitForWriting
 * @authors: CZH
 * @Date: 2022-12-07 19:15:01
 */
export interface inputElementTemplate {
  properties: (
    that: stringAnyObj,
    cell: tableCellTemplate
  ) => stringAnyObj | Promise<stringAnyObj>;
  uiSchema?: (
    that: stringAnyObj,
    cell: tableCellTemplate
  ) => stringAnyObj | Promise<stringAnyObj>;
}

export default {};
