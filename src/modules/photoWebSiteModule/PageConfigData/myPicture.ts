/*
 * @Date: 2023-06-20 16:46:31
 * @LastEditors: CZH
 * @LastEditTime: 2023-06-20 17:30:30
 * @FilePath: /ConfigForDesktopPage/src/modules/photoWebSiteModule/PageConfigData/myPicture.ts
 */
import {
  cardComponentType,
  gridCellMaker,
  gridCellTemplate,
} from "@/components/basicComponents/grid/module/dataTemplate";
import { InfoCardBtnList } from "./InfoCardBtnList";
import { post } from "@/utils/api/requests";

export const myPicture = async () => {
  let res = await post("/my/picture", {});
  return [
    gridCellMaker(
      "InfoCard",
      "图片信息",
      {},
      {
        type: cardComponentType.componentList,
        name: "photoWebSiteModule_infoCard",
      },
      {
        showInGridDesktop: false,
        props: {
          btnList: InfoCardBtnList,
          watchKeyForCategory: "category",
        },
      }
    )
      .setPosition(19, 1)
      .setSize(4, 12),
  ] as gridCellTemplate[];
};
