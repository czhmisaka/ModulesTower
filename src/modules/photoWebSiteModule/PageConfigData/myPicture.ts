/*
 * @Date: 2023-06-20 16:46:31
 * @LastEditors: CZH
 * @LastEditTime: 2023-06-25 01:49:11
 * @FilePath: /ConfigForDesktopPage/src/modules/photoWebSiteModule/PageConfigData/myPicture.ts
 */
import {
  cardComponentType,
  gridCellMaker,
  gridCellTemplate,
} from "@/components/basicComponents/grid/module/dataTemplate";
import { InfoCardBtnList } from "./InfoCardBtnList";
import { post } from "@/utils/api/requests";
import { useCartHook } from "@/store/modules/cart";
import { setPosition } from "@/components/basicComponents/grid/module/util";
import { setSize } from "../../../components/basicComponents/grid/module/util";
import { setData } from "@/components/basicComponents/grid/module/cardApi";

export const myPicture = async () => {
  const cart = useCartHook();
  return [
    // gridCellMaker(
    //   "刷新",
    //   "打开组件菜单",
    //   {},
    //   {
    //     type: cardComponentType.componentList,
    //     name: "icon",
    //   },
    //   {
    //     isSettingTool: true,
    //     props: {
    //       name: "Refresh",
    //       onClickFunc: async ({ props, context, e }) => {
    //       },
    //     },
    //   }
    // )
    //   .setPosition(0, 0)
    //   .setSize(1, 1),
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
            return res.data.list.map((x) => {
              let path = x.path.replace("./", "/");
              return {
                ...x,
                url: `/imageserver/i.php?` + path.replace(".", "-sm.") + "",
              };
            });
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
      "InfoCard",
      "图片信息",
      {},
      {
        type: cardComponentType.componentList,
        name: "photoWebSiteModule_infoCard",
      },
      {
        props: {
          btnList: InfoCardBtnList,
          watchKeyForCategory: "category",
        },
      }
    )
      .setPosition(10, 1)
      .setSize(2, 11),
  ] as gridCellTemplate[];
};
