/*
 * @Date: 2023-07-19 21:15:02
 * @LastEditors: CZH
 * @LastEditTime: 2023-07-27 22:13:57
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
export const changeCard3DTransform = (content: stringAnyObj, is3d: boolean) => {
  if (!checkContext(content, { 1: 1 })) return;
  try {
    let func = content["$emit"] ? "$emit" : "emit";
    content[func](
      "onChange",
      {
        transform: is3d ? "rotateX(60deg) rotateZ(-30deg) scale(1.3) " : "none",
      },
      {
        type: [cardOnChangeType.changeDesktopProperties],
      }
    );
  } catch (err) {
    console.error("changeCard3DTransform 错误:", err, content, {});
  }
};
