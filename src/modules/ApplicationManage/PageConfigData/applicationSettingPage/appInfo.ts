/*
 * @Date: 2022-04-28 22:29:05
 * @LastEditors: CZH
 * @LastEditTime: 2023-11-03 10:19:20
 * @FilePath: /lcdp_fe_setup/src/modules/ApplicationManage/PageConfigData/applicationSettingPage/appInfo.ts
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
  removeGridCell,
} from "@/components/basicComponents/grid/module/cardApi/index";
import { ApplicationInfoTemplate, stringAnyObj } from "../../types";
import { mainBoardSizeAndPosition } from "../main";
import { setPosition } from "../../../../components/basicComponents/grid/module/util";
import {
  SearchCellStorage,
  tableCellTemplateMaker,
} from "@/modules/userManage/component/searchTable/searchTable";
import { 集成应用管理字段库 } from "../ApplicationManage";
import {
  btnMaker,
  repBackMessageShow,
} from "@/modules/userManage/component/searchTable/drawerForm";
import { btnActionTemplate, showType } from "@/modules/userManage/types";
import { btnList } from "../../../knowledge/PageConfigData/template/templateDetail";
import { post } from "@/utils/api/requests";
import { deepClone } from "../../../../utils/index";
import { windowResizeChecker } from "@/modules/userManage/component/eventCenter/eventCenter";
import { showCell } from "../../../userManage/component/searchTable/searchTable";

export const appInfo = async (appData: ApplicationInfoTemplate = {}) => {
  let preData = appData;
  const 提交应用信息编辑 = btnMaker("提交", btnActionTemplate.Function, {
    elType: "primary",
    icon: "Position",
    function: async (that, data) => {
      let res = await post("/web/app/update", {
        ...data,
        groups: appData.groups,
      });
      repBackMessageShow(that, res);
    },
  });

  const 取消编辑 = btnMaker("取消编辑", btnActionTemplate.Function, {
    elType: "info",
    icon: "Close",
    function: async (that, data) => {
      let dealData = {
        mainBoard: {
          showTypeProp: "show",
          btnList: [编辑],
          defaultFormData: preData,
        },
      };
      changeCardProperties(that, dealData);
    },
  });

  const 编辑 = btnMaker("编辑", btnActionTemplate.Function, {
    icon: "Edit",
    elType: "primary",
    function: async (that, data) => {
      let dealData = {
        mainBoard: {
          showTypeProp: "edit",
          btnList: [提交应用信息编辑, 取消编辑],
        },
      };
      changeCardProperties(that, dealData);
    },
  });

  const queryItemTemplate = [
    集成应用管理字段库.getByLabel("应用名称", {
      ...showCell(showType.func, {
        showFunc: (data, key) => {
          return data[key] || "未命名";
        },
      }),
    }),
    ...集成应用管理字段库.getByLabelArr([
      "应用分类",
      "应用简介",
      "排序",
      "所属部门",
      "图标",
    ]),
  ];
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
          defaultFormData: appData,
          showTypeProp: "show",
          cusStyle: {
            borderRadius: "6px",
          },
          btnList: [编辑],
        },
      }
    )
      .setSize(
        mainBoardSizeAndPosition().size.width,
        mainBoardSizeAndPosition().size.height
      )
      .setPosition(
        mainBoardSizeAndPosition().position.x,
        mainBoardSizeAndPosition().position.y
      ),
    windowResize,
  ] as gridCellTemplate[];
};

let timeOut = null as any;
const windowResize = windowResizeChecker(async (that, baseData) => {
  if (timeOut) clearTimeout(timeOut);
  timeOut = setTimeout(() => {
    changeCardSize(that, {
      mainBoard: {
        width: mainBoardSizeAndPosition().size.width,
        height: mainBoardSizeAndPosition().size.height,
      },
    });
    changeCardPosition(that, {
      mainBoard: {
        x: mainBoardSizeAndPosition().position.x,
        y: mainBoardSizeAndPosition().position.y,
      },
    });
  }, 50);
}, "mainBoard_windowResize");
