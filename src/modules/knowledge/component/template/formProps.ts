/*
 * @Date: 2023-08-10 20:04:59
 * @LastEditors: CZH
 * @LastEditTime: 2023-08-10 20:32:17
 * @FilePath: /lcdp_fe_setup/src/modules/knowledge/component/template/formProps.ts
 */
import {
  SearchCellStorage,
  searchCell,
  tableCellTemplateMaker,
} from "@/modules/userManage/component/searchTable/searchTable";
import { formInputType } from "@/modules/userManage/types";

const 表单属性配置 = new SearchCellStorage([
  tableCellTemplateMaker(
    "列数",
    "layoutColumn",
    searchCell(formInputType.number, {
      inputOptions: {
        minimum: 1,
        maximum: 4,
      },
    })
  ),
]);

export const 表单属性 = 表单属性配置.getAll();
