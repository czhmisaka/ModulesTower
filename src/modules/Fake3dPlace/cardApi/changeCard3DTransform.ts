/*
 * @Date: 2023-07-19 21:15:02
 * @LastEditors: CZH
 * @LastEditTime: 2023-07-22 15:27:08
 * @FilePath: /ConfigForDesktopPage/src/modules/Fake3dPlace/cardApi/changeCard3DTransform.ts
 */

import { checkContext } from "@/components/basicComponents/grid/module/cardApi";
import {
  cardOnChangeType,
  gridCellOptions,
} from "@/components/basicComponents/grid/module/dataTemplate";
import { stringAnyObj } from "@/modules/userManage/types";

/**
 * @name: changeCard3DTransform
 * @description: 转换伪造2.5d模式，搭配 changeDesktopProperties 使用
 * @authors: CZH
 * @Date: 2023-07-22 15:26:13
 */
export const changeCard3DTransform = (
  content: stringAnyObj,
  value: {
    [key: string]: boolean;
  }
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
      type: [cardOnChangeType.cardConfigChange],
    });
  } catch (err) {
    console.error("changeVisible 错误:", err, content, value);
  }
};
