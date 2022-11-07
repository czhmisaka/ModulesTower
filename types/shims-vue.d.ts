/*
 * @Date: 2022-11-03 16:40:47
 * @LastEditors: CZH
 * @LastEditTime: 2022-11-07 09:13:16
 * @FilePath: /configforpagedemo/types/shims-vue.d.ts
 */
declare module "*.vue" {
  import { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module "*.scss" {
  const scss: Record<string, string>;
  export default scss;
}

declare module "vuedraggable/src/vuedraggable";
declare module "@pureadmin/components";
declare module "@pureadmin/theme";
declare module "@pureadmin/theme/dist/browser-utils";

declare module "@/assets/svg/*.svg?component"