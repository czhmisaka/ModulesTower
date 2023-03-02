/*
 * @Date: 2022-08-15 23:37:57
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-03-02 23:18:19
 * @FilePath: \ConfigForDesktopPage\src\modules\dictServerSiteModule\PageConfigData\index.ts
 */
import { gridCellTemplate } from "@/components/basicComponents/grid/module/dataTemplate";
import { isValidKey } from "@/utils/index";
import { desktopDataTemplate } from "@/modules/userManage/types";
import { mainDictDesktop } from "./main";


const base = {
  gridColNum: 12,
  cusStyle: {
    wholeScreen: true,
    maxRows: 8,
    margin: 12,
  },
};

const pageConfig = {
  dictManage:{
    ...base,
    desktopData:mainDictDesktop
  }
} as { [key: string]: desktopDataTemplate };

let Page = {} as {
  [key: string]: desktopDataTemplate;
};

Object.keys(pageConfig).map((key: string) => {
  if (isValidKey(key, pageConfig))
    Page[String(key).toUpperCase()] = pageConfig[key] as desktopDataTemplate;
});

export const PageConfig = { ...Page };
