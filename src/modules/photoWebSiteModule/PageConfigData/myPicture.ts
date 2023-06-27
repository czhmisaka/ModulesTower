/*
 * @Date: 2023-06-20 16:46:31
 * @LastEditors: CZH
 * @LastEditTime: 2023-06-27 09:37:04
 * @FilePath: /ConfigForDesktopPage/src/modules/photoWebSiteModule/PageConfigData/myPicture.ts
 */
import {
  cardComponentType,
  cardOnChangeType,
  gridCellMaker,
  gridCellTemplate,
} from "@/components/basicComponents/grid/module/dataTemplate";
import { InfoCardBtnList, 批量下载 } from "./InfoCardBtnList";
import { post } from "@/utils/api/requests";
import { useCartHook } from "@/store/modules/cart";
import { setPosition } from "@/components/basicComponents/grid/module/util";
import { setSize } from "../../../components/basicComponents/grid/module/util";
import { setData } from "@/components/basicComponents/grid/module/cardApi";

export const myPicture = async () => {
  const cart = useCartHook();
  return [
    gridCellMaker(
      "waterFall",
      "瀑布流图片展示功能",
      {},
      {
        name: "photoWebSiteModule_waterfall",
        type: cardComponentType.componentList,
      },
      {
        props: {
          watchKey: ["category", "collection", "query"],
          startSearch: true,
          getFunc: async (that, data) => {
            const { offset, limit } = data;
            let res = await useCartHook().getCartImage(offset, limit);
            return res;
          },
        },
      }
    )
      .setPosition(0, 0)
      .setSize(10, 12),
    gridCellMaker(
      "icon",
      "清空按钮",
      {},
      {
        type: cardComponentType.componentList,
        name: "icon",
      },
      {
        showInGridDesktop: true,
        props: {
          name: "Delete",
          onClickFunc: ({ props, context, e }) => {
            useCartHook().clearCart();
            location.reload();
          },
        },
      }
    )
      .setSize(1, 1)
      .setPosition(10, 0),
    gridCellMaker(
      "loadingProgress",
      "下载进度条",
      {},
      {
        type: cardComponentType.componentList,
        name: "photoWebSiteModule_loadingProgress",
      },
      {
        showInGridDesktop: false,
        props: {
          percentage: 10,
        },
      }
    )
      .setSize(1, 1)
      .setPosition(11, 0),
    gridCellMaker(
      "InfoCard",
      "图片信息",
      {},
      {
        type: cardComponentType.componentList,
        name: "photoWebSiteModule_infoCard",
      },
      {
        props: {
          btnList: [批量下载],
          watchKeyForCategory: "category",
        },
      }
    )
      .setPosition(10, 1)
      .setSize(2, 11),
  ] as gridCellTemplate[];
};
