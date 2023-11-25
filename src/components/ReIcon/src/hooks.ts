/*
 * @Date: 2022-11-21 16:13:14
 * @LastEditors: CZH
 * @LastEditTime: 2023-10-16 13:58:36
 * @FilePath: /lcdp_fe_setup/src/components/ReIcon/src/hooks.ts
 */
import { iconType } from "./types";
import { h, defineComponent, Component, defineAsyncComponent } from "vue";
import { IconifyIconOnline, IconifyIconOffline, FontIcon } from "../index";
import { ElIcon } from "element-plus";
import { getIcon } from "@/utils";
import customIcon from "./icon.vue";

const fuck_requireModule = require.context(
  "@/assets/svg/icon/",
  true,
  /.\.svg/g
);
const fuck_key = fuck_requireModule.keys() as string[];
let fuck = {};
fuck_key.map((x) => {
  fuck[x] = fuck_requireModule(x).default;
});

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
  if (typeof icon == "object" && icon["src"] && icon["iconType"]) {
    return defineComponent({
      render() {
        return h(customIcon, {
          icon,
        });
      },
    });
  } else if (ifReg.test(icon)) {
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
    return defineComponent({
      name: "ELIcon",
      render() {
        return h(
          ElIcon,
          {
            style: {
              // margin: "0px -3px",
            },
            ...attrs,
          },
          () => h(getIcon(icon.replace("EL_", "")))
        );
      },
    });
  } else if (
    icon[0] == "S" &&
    icon[1] == "V" &&
    icon[2] == "G" &&
    icon[3] == "_"
  ) {
    return defineComponent({
      name: "Icon",
      render() {
        return h(
          ElIcon,
          {
            style: {
              margin: "0px -3px",
            },
            ...attrs,
          },
          h(fuck[icon.replace("SVG_", "")])
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
