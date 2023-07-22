/*
 * @Date: 2023-07-19 21:15:02
 * @LastEditors: CZH
 * @LastEditTime: 2023-07-22 15:27:16
 * @FilePath: /ConfigForDesktopPage/src/modules/Fake3dPlace/cardApi/changeDesktopProperties.ts
 */

import { checkContext } from "@/components/basicComponents/grid/module/cardApi";
import {
  cardOnChangeType,
  gridCellOptions,
} from "@/components/basicComponents/grid/module/dataTemplate";
import { stringAnyObj } from "@/modules/userManage/types";

export const changeDesktopProperties = (
  content: stringAnyObj,
  value: stringAnyObj
) => {
  if (!checkContext(content, value)) return;
  try {
    let func = content["$emit"] ? "$emit" : "emit";
    let data = {} as gridCellOptions;
    Object.keys(value).map((name: string) => {
      data[name] = {
        options: { showInGridDesktop: value[name] },
      };
    });
    content[func]("onChange", data, {
      type: [cardOnChangeType.changeDesktopProperties],
    });
  } catch (err) {
    console.error("changeVisible 错误:", err, content, value);
  }
};

export const changeDesktopToFake3D = (content: stringAnyObj) => {
  if (!checkContext(content, {})) return;
  try {
    let func = content["$emit"] ? "$emit" : "emit";
    let data = {} as gridCellOptions;
    content[func](
      "onChange",
      {},
      {
        type: [cardOnChangeType.changeDesktopProperties],
      }
    );
  } catch (err) {
    console.error("changeVisible 错误:", err, content, {});
  }
};
