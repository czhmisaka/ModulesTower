/*
 * @Date: 2022-11-21 16:13:14
 * @LastEditors: CZH
 * @LastEditTime: 2022-11-23 19:21:09
 * @FilePath: /configforpagedemo/src/components/ReIcon/src/hooks.ts
 */
import { iconType } from "./types";
import { h, defineComponent, Component } from "vue";
import { IconifyIconOnline, IconifyIconOffline, FontIcon } from "../index";
import { ElIcon } from "element-plus";
import { getIcon } from "@/utils";

import iconCell from "@/components/basicComponents/cell/icon/iconCell.vue";

/**
 * 支持fontawesome4、5+、iconfont、remixicon、element-plus的icons、自定义svg
 * @param icon 必传 图标
 * @param attrs 可选 iconType 属性
 * @returns Component
 */
export function useRenderIcon(icon: any, attrs?: iconType): Component {
  // iconfont
  const ifReg = /^IF-/;
  // typeof icon === "function" 属于SVG
  if (ifReg.test(icon)) {
    // iconfont
    const name = icon.split(ifReg)[1];
    const iconName = name.slice(
      0,
      name.indexOf(" ") == -1 ? name.length : name.indexOf(" ")
    );
    const iconType = name.slice(name.indexOf(" ") + 1, name.length);
    return defineComponent({
      name: "FontIcon",
      render() {
        return h(FontIcon, {
          icon: iconName,
          iconType,
          ...attrs,
        });
      },
    });
  } else if (typeof icon === "function" || typeof icon?.render === "function") {
    // svg
    return icon;
  } else if (icon[0] == "E" && icon[1] == "L" && icon[2] == "_") {
    console.log(icon, "qwe", icon.replace("EL_", ""));
    return defineComponent({
      name: "ELIcon",
      render() {
        return h(
          ElIcon,
          {
            style:{
              margin:'0px -3px'
            },
            ...attrs,
          },
          () => h(getIcon(icon.replace("EL_", "")))
        );
      },
    });
  } else {
    return defineComponent({
      name: "Icon",
      render() {
        const IconifyIcon =
          attrs && attrs["online"] ? IconifyIconOnline : IconifyIconOffline;
        return h(IconifyIcon, {
          icon: icon,
          ...attrs,
        });
      },
    });
  }
}
