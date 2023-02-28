/*
 * @Date: 2022-04-28 22:29:05
 * @LastEditors: CZH
 * @LastEditTime: 2023-02-28 10:59:22
 * @FilePath: /configforpagedemo/src/modules/ApplicationManage/PageConfigData/main.ts
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

export const mainDesktop = async () => {
  return [
    gridCellMaker(
      "editable",
      "编辑",
      {},
      {
        name: "setting_editable",
        type: cardComponentType.componentList,
      },
      {
        isSettingTool: true,
      }
    )
      .setPosition(1, 0)
      .setSize(1, 1),
    gridCellMaker(
      "openComponents",
      "打开组件菜单",
      {},
      {
        type: cardComponentType.componentList,
        name: "icon",
      },
      {
        isSettingTool: true,
        props: {
          name: "Grid",
          onClickFunc: (content: any) => {
            const { context } = content;
            context.emit(
              "onChange",
              {},
              {
                type: [cardOnChangeType.openComponentsList],
              }
            );
          },
        },
      }
    )
      .setPosition(0, 0)
      .setSize(1, 1),
  ] as gridCellTemplate[];
};
