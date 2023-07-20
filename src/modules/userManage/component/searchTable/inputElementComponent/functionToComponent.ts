/*
 * @Date: 2023-07-05 09:27:34
 * @LastEditors: CZH
 * @LastEditTime: 2023-07-06 10:45:18
 * @FilePath: /lcdp_fe_setup/src/modules/userManage/component/searchTable/inputElementComponent/functionToComponent.ts
 */
import { customComponent } from "@/modules/userManage/types";
import { defineComponent } from "vue";

export const componentMaker = (customComponent: customComponent) => {
  if (!customComponent.isLocalComponent) {
    const { props, emits, setup } = customComponent.component;
    return defineComponent({ props, emits, setup });
  } else {
    return customComponent.component;
  }
};
