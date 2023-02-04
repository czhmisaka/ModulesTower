/*
 * @Date: 2022-04-28 22:29:05
 * @LastEditors: CZH
 * @LastEditTime: 2023-02-04 03:00:10
 * @FilePath: /configforpagedemo/src/modules/photoWebSiteModule/PageConfigData/main.ts
 */

import {
  gridCellMaker,
  gridSizeMaker,
  cardComponentType,
  cardOnChangeType,
  gridCellTemplate,
} from "@/components/basicComponents/grid/module/dataTemplate";
import {
  changeVisible,
  changeCardSize,
  changeCardPosition,
  changeCardProperties,
} from "@/components/basicComponents/grid/module/cardApi/index";
import { get, post } from "@/utils/api/requests";
import { ITEM_RENDER_EVT } from "element-plus/es/components/virtual-list/src/defaults";
const getFunc = async function (that, data) {
  let { limit, offset } = data;
  let res = await post(
    `/images?offset=${offset}&limit=${limit}&catrgory=${data.key.id}`,
    []
  );
  return res.data.list.map((x) => {
    let path = x.path.replace("./", "/");
    return {
      ...x,
      url: `/imageserver/i.php?` + path.replace(".", "-sm.") + "",
    };
  });
};
export const mainDesktop = async () =>
  [
    gridCellMaker(
      "upload",
      "上传",
      {},
      {
        type: cardComponentType.componentList,
        name: "photoWebSiteModule_upload",
      },
      {}
    )
      .setPosition(0, 9)
      .setSize(2, 3),

    gridCellMaker(
      "userManage_menuListRemote",
      "相册列表",
      {},
      {
        type: cardComponentType.componentList,
        name: "userManage_menuList",
      },
      {
        props: {
          noSearch: true,
          treeDataFunc: async (that) => {
            let res = await get("/categories", {});
            return res.data;
          },
          outputKey: "category",
          defaultProps: {
            label: "name",
            children: "children",
          },
        },
      }
    )
      .setPosition(0, 0)
      .setSize(2, 9),

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
          watchKeyForCategory: "category",
          getFunc: getFunc,
        },
      }
    )
      .setPosition(2, 0)
      .setSize(8, 12),
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
          watchKeyForCategory: "category",
        },
      }
    )
      .setPosition(10, 0)
      .setSize(2, 12),
    gridCellMaker(
      "icon",
      "返回按钮",
      {},
      {
        type: cardComponentType.componentList,
        name: "icon",
      },
      {
        showInGridDesktop: false,
        props: {
          name: "ArrowRightBold",
          onClickFunc: ({ props, context, e }) => {
            changeCardPosition(context, {
              waterFall: {
                x: 2,
                y: 0,
              },
            });
            changeCardSize(context, {
              InfoCard: {
                width: 2,
                height: 12,
              },
              waterFall: {
                width: 8,
                height: 12,
              },
            });
            changeVisible(context, {
              userManage_menuListRemote: true,
              upload: true,
              icon: false,
            });
            changeCardProperties(context, {
              waterFall: {
                getFunc: getFunc,
              },
            });
          },
        },
      }
    )
      .setPosition(10, 10)
      .setSize(2, 2),
  ] as gridCellTemplate[];

export const mobile = async () =>
  [
    gridCellMaker(
      "upload",
      "上传",
      {},
      {
        type: cardComponentType.componentList,
        name: "photoWebSiteModule_upload",
      },
      {}
    )
      .setPosition(0, 0)
      .setSize(1, 2),

    gridCellMaker(
      "userManage_menuListRemote",
      "相册列表",
      {},
      {
        type: cardComponentType.componentList,
        name: "userManage_menuList",
      },
      {
        props: {
          noSearch: true,
          treeDataFunc: async (that) => {
            let res = await get("/categories", {});
            return res.data;
          },
          outputKey: "category",
          defaultProps: {
            label: "name",
            children: "children",
          },
        },
      }
    )
      .setPosition(0, 17)
      .setSize(4, 3),

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
          watchKeyForCategory: "category",
          getFunc: getFunc,
        },
      }
    )
      .setPosition(0, 2)
      .setSize(4, 15),
    gridCellMaker(
      "InfoCard",
      "图片信息",
      {},
      {
        type: cardComponentType.componentList,
        name: "photoWebSiteModule_infoCard",
      },
      {
        props: {},
      }
    )
      .setPosition(1, 0)
      .setSize(3, 2),
  ] as gridCellTemplate[];
