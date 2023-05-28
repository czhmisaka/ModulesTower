/*
 * @Date: 2023-04-27 16:59:11
 * @LastEditors: CZH
 * @LastEditTime: 2023-05-15 09:49:05
 * @FilePath: /configforpagedemo/src/utils/wordModules/type/index.ts
 */
export interface stringAnyObj {
  [key: string]: any;
}

// 生成文档描述工具类
// 需要在客户端构建对应的文件结构体发送解析
// 实际接口获取采用string字符串接
export interface fileObjTemplate {
  fileName: string;
  Author: string;
}

export enum wordType {
  文件函号 = "文件函号",
  红头文件标头 = "红头文件标头",
  正文标题 = "正文标题",
  正文段落 = "正文段落",
  告知对象 = "告知对象",
  附件 = "附件",
  附件标题 = "附件标题",
  落款 = "落款",
  抄送 = "抄送",
  table表单 = "table表单",
  分页 = "分页",
  换行 = "换行",
}

export interface wordObjCellTemplate extends stringAnyObj {
  type: wordType;
  word: string;
  data?: stringAnyObj;
}

export interface wordTemplate {
  file: fileObjTemplate;
  wordCellList: wordObjCellTemplate[];
  baseData: stringAnyObj;
  baseWordConfig: {
    lineHeightNumber: number;
    lineNumber: number;
  };
}

// 生成引擎描述工具类
export type wordCellMakerFuncTemplate = {
  [key in wordType]: {
    preDealFunc?: (
      cell: wordObjCellTemplate,
      cellList: wordObjCellTemplate[],
      word: wordTemplate
    ) => wordObjCellTemplate[] | void;
    function: (cell: wordObjCellTemplate, data: stringAnyObj) => string;
    lineNumber: (
      wordObjCellTemplate: wordObjCellTemplate,
      word?: wordTemplate
    ) => number;
    config?: stringAnyObj;
  };
};

export const baseWordTemplate = {
  wordCellList: [],
  baseData: {},
  baseWordConfig: {
    lineHeightNumber: 24,
    lineNumber: 29,
    tabIndexNumber: 2,
  },
};
