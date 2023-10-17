/*
 * @Date: 2022-04-28 22:29:05
 * @LastEditors: CZH
 * @LastEditTime: 2023-10-12 16:41:43
 * @FilePath: /lcdp_fe_setup/src/modules/ApplicationManage/PageConfigData/applicationSettingPage/appDevConfig.ts
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

export const appDevConfig = async (data: ApplicationInfoTemplate = {}) => {
  const queryItemTemplate = new SearchCellStorage([
    tableCellTemplateMaker("App Key", "appKey"),
    tableCellTemplateMaker("App Secret", "appSecret"),
    tableCellTemplateMaker("支持终端", "end"),
    tableCellTemplateMaker("PC地址", "PC_link"),
    tableCellTemplateMaker("H5地址", "H5_link"),
  ]).getAll();
  return [
    gridCellMaker(
      "mainBoard",
      "应用开发配置信息",
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
          btnList: [],
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
