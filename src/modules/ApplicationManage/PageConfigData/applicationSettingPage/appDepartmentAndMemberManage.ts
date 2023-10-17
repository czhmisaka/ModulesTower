/*
 * @Date: 2022-04-28 22:29:05
 * @LastEditors: CZH
 * @LastEditTime: 2023-10-12 17:39:12
 * @FilePath: /lcdp_fe_setup/src/modules/ApplicationManage/PageConfigData/applicationSettingPage/appDepartmentAndMemberManage.ts
 */

import {
  gridCellMaker,
  gridSizeMaker,
  cardComponentType,
  cardOnChangeType,
  gridCellTemplate,
} from "@/components/basicComponents/grid/module/dataTemplate";
import {
  changeVisible,
  changeCardSize,
  changeCardPosition,
  changeCardProperties,
} from "@/components/basicComponents/grid/module/cardApi/index";
import { ApplicationInfoTemplate, stringAnyObj } from "../../types";
import { mainBoardSizeAndPosition } from "../main";
import { setPosition } from "../../../../components/basicComponents/grid/module/util";
import {
  SearchCellStorage,
  tableCellTemplateMaker,
} from "@/modules/userManage/component/searchTable/searchTable";

const 部门和成员管理字段库 = new SearchCellStorage([
  tableCellTemplateMaker("部门范围", "depart"),
]);

export const appDepartmentAndMemberManage = async (
  data: ApplicationInfoTemplate = {}
) => {
  const queryItemTemplate = 部门和成员管理字段库.getAll();
  return [
    gridCellMaker(
      "mainBoard",
      "应用信息",
      {},
      {
        type: cardComponentType.componentList,
        name: "ApplicationManage_formPage",
      },
      {
        props: {
          formInputTemplate: queryItemTemplate,
          showItemTemplate: queryItemTemplate,
          defaultFormData: data,
          showTypeProp: "show",
          cusStyle: {
            borderRadius: "0px",
            filter: "None",
          },
        },
      }
    )
      .setSize(
        mainBoardSizeAndPosition.size.width,
        mainBoardSizeAndPosition.size.height
      )
      .setPosition(
        mainBoardSizeAndPosition.position.x,
        mainBoardSizeAndPosition.position.y
      ),
  ] as gridCellTemplate[];
};
