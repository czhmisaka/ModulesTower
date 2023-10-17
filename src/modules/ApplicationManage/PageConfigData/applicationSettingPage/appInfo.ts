/*
 * @Date: 2022-04-28 22:29:05
 * @LastEditors: CZH
 * @LastEditTime: 2023-10-17 23:36:37
 * @FilePath: /ConfigForDesktopPage/src/modules/ApplicationManage/PageConfigData/applicationSettingPage/appInfo.ts
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
import { btnMaker } from "@/modules/userManage/component/searchTable/drawerForm";
import { btnActionTemplate } from "@/modules/userManage/types";

const 编辑 = btnMaker("编辑", btnActionTemplate.Function, {
  icon: "Edit",
  elType: "primary",
  function: async (that, data) => {
    let dealData = {
      mainBoard: {
        showTypeProp: "edit",
      },
    };
    changeCardProperties(that, dealData);
  },
});

const 应用管理字段库 = new SearchCellStorage([]);

export const appInfo = async (data: ApplicationInfoTemplate = {}) => {
  const queryItemTemplate = 应用管理字段库.getByLabelArr([]);
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
          btnList: [编辑],
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
