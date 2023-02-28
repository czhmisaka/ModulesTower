/*
 * @Date: 2022-10-20 21:59:45
 * @LastEditors: CZH
 * @LastEditTime: 2023-02-28 18:05:15
 * @FilePath: /configforpagedemo/src/modules/ApplicationManage/component/index.ts
 */
import {
  CardComponentTemplate,
  cardComponentMaker,
  componentInfo,
  propInfo,
} from "../../../components/basicComponents/grid/module/dataTemplate";
import { defineAsyncComponent } from "vue";
import { moduleInfo } from "../output";

const preName = moduleInfo.name;
let componentList = [] as any[];

// 搜索当前文件夹内的所有.vue 文件，构建组件对象
const componentsFiles = require.context("./", true, /.vue$/);
componentsFiles.keys().map((componentsName: string) => {
  let data = componentsFiles(componentsName)["default"];
  if (!data["name"]) {
    data = {
      ...data,
      name: componentsName
        .split("/")
        [componentsName.split("/").length - 1].split(".vue")[0],
    };
  }
  componentList.push(data);
});

let componentLists = {} as { [key: string]: CardComponentTemplate };

componentList.map((module: any) => {
  let propsDetail = {} as propInfo;
  let baseProps = {} as { [key: string]: any };
  let componentInfo = { label: preName + "_" + module.name } as componentInfo;

  if (Object.keys(module).indexOf("propsDetail") > -1) {
    propsDetail = { ...module.propsDetail };
  }

  if (Object.keys(module).indexOf("baseProps") > -1) {
    baseProps = { ...module.baseProps };
  }

  if (Object.keys(module).indexOf("componentInfo") > -1) {
    componentInfo = { ...componentInfo, ...module.componentInfo };
  }

  componentLists[componentInfo.label] = cardComponentMaker(
    module,
    propsDetail,
    baseProps,
    componentInfo
  );
});

export default componentLists;
