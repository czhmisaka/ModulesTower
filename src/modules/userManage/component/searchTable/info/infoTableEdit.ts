/*
 * @Date: 2023-12-14 16:04:48
 * @LastEditors: CZH
 * @LastEditTime: 2024-01-02 18:02:49
 * @FilePath: /lcdp_fe_setup/src/modules/userManage/component/searchTable/info/infoTableEdit.ts
 */

import {
  cardComponentType,
  cardOnChangeType,
  gridCellMaker,
  gridCellTemplate,
} from "@/components/basicComponents/grid/module/dataTemplate";
import {
  btnActionTemplate,
  desktopDataTemplate,
  drawerProps,
  showType,
  stringAnyObj,
  tableCellTemplate,
} from "@/modules/userManage/types";
import {
  btnMaker,
  closeDrawerForm,
  closeDrawerFormEasy,
  openDrawerFormEasy,
} from "../drawerForm";
import { useCardStyleConfigHook } from "@/store/modules/cardStyleConfig";
import {
  gridCell,
  staticSelectCell,
  tableCellTemplateMaker,
} from "../searchTable";
import {
  setPosition,
  setSize,
} from "../../../../../components/basicComponents/grid/module/util";
import {
  changeCardProperties,
  setData,
  upEmit,
  upToTopDataChange,
} from "@/components/basicComponents/grid/module/cardApi";
import { useUserStoreHook } from "@/store/modules/user";
import { gridEditList } from "@/modules/main/PageConfigData/main";

// 定义主要桌面大小
export const wholeScreen = {
  size: {
    width: 24,
    height: 16,
  },
};

interface searchTableInfo extends stringAnyObj {
  showItemTemplate: tableCellTemplate[];
  searchItemTamplate: tableCellTemplate[];
  rowHeightKey: string;
  isCard: boolean;
}

let outputShowItemTemplate = [];
let rowHeightKey = 32 as string | number;

// 打开表单编辑器界面
export const openTableEditor = async (that: searchTableInfo, data) => {
  outputShowItemTemplate = [];
  rowHeightKey = that.rowHeightKey || 32;
  const showItemTemplate = that.showItemTemplate.filter(
    (x) => x.table.type != showType.btnList
  );
  const actionItemTemplate = that.showItemTemplate.filter(
    (x) => x.table.type == showType.btnList
  );
  // 表单编辑器
  const TableEditor = async (): Promise<gridCellTemplate[]> => {
    let gridCellList = [
      gridCellMaker(
        "rowHeightKey",
        "rowHeightKey",
        {},
        {
          type: cardComponentType.componentList,
          name: "userManage_slider",
        },
        {
          props: {
            label: "表格行高",
            defaultValue: rowHeightKey,
            min: 32,
            max: 80,
            step: 24,
            showInput: false,
            showStops: true,
            marks: {
              32: "小",
              56: "中",
              80: "大",
            },
            onChangeFunc: (context, value) => {
              rowHeightKey = value;
            },
          },
        }
      )
        .setPosition(0, 0)
        .setSize(12, 3),
      gridCellMaker(
        "colEditor",
        "列表顺序编辑",
        {},
        {
          name: "userManage_colEditor",
          type: cardComponentType.componentList,
        },
        {
          props: {
            label: "展示列表配置",
            queryItemTemplate: showItemTemplate,
            onChange: async (th, data) => {
              let queryItemTemplateLocal = JSON.parse(
                JSON.stringify(th.queryItemTemplateLocal)
              );
              if (
                queryItemTemplateLocal
                  .map((x) => x.table.type)
                  .indexOf(showType.btnList) !=
                queryItemTemplateLocal.length - 1
              )
                queryItemTemplateLocal.push(
                  queryItemTemplateLocal.splice(
                    queryItemTemplateLocal
                      .map((x) => x.table.type)
                      .indexOf(showType.btnList),
                    1
                  )[0]
                );
              outputShowItemTemplate = [];
              [...data, ...actionItemTemplate].map((cell) => {
                that.showItemTemplate.map((target) => {
                  if (target.label == cell.label && target.key == cell.key)
                    outputShowItemTemplate.push({
                      ...target,
                      showAble: cell.showAble,
                    } as tableCellTemplate);
                });
              });
              setData(that, {
                colEditor: {
                  queryItemTemplate: outputShowItemTemplate,
                },
              });
            },
          },
        }
      )
        .setPosition(0, 3)
        .setSize(12, 13),
    ] as gridCellTemplate[];
    return gridCellList;
  };

  const 完成配置按钮 = btnMaker("保存配置", btnActionTemplate.Function, {
    function: async (th, data) => {
      console.log(data, that);
      let cardData = {};
      cardData[that.detail.label] = {
        showItemTemplate: outputShowItemTemplate,
      };
      let config = await useUserStoreHook().getPageConfig(that.detail.label);
      config["rowHeightKey"] = rowHeightKey;
      config["showItemTemplate"] = JSON.parse(
        JSON.stringify(
          outputShowItemTemplate.map((x) => {
            return {
              key: x.key,
              label: x.label,
              showAble: x.showAble,
            };
          })
        )
      );
      await useUserStoreHook().setPageConfig(that.detail.label, config);
      changeCardProperties(that, cardData);
      th.close();
    },
  });

  let drawerProps = {
    // bgColor: "rgba(0,0,0,0);box-shadow:none;",
    size: 40,
    gridDesktop: true,
    // fullscreenGridDesktop: true,
    gridDesktopConfig: {
      name: "表单编辑器页面",
      gridColNum: 12,
      desktopData: TableEditor,
      cusStyle: {
        wholeScreen: true,
        maxRows: 16,
        margin: useCardStyleConfigHook().get("margin"),
      },
    } as desktopDataTemplate,
    btnList: [
      完成配置按钮,
      btnMaker("取消", btnActionTemplate.Function, {
        function: async (that, data) => {
          that.close();
        },
      }),
    ],
  } as drawerProps;
  openDrawerFormEasy(that, drawerProps);
};
