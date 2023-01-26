/*
 * @Date: 2022-04-28 22:29:05
 * @LastEditors: CZH
 * @LastEditTime: 2023-01-26 10:31:28
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
      .setSize(3, 3),

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
      .setSize(3, 9),

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
          getFunc: async function (that, data) {
            let { limit, offset } = data;
            let res = await post(
              `/images?offset=${offset}&limit=${limit}&catrgory=${data.key.id}`,
              []
            );
            return res.data.list.map((x) => {
              let path = x.path.replace("./", "/");
              return (
                `http://42.192.134.238:1200/i.php?` + path.replace(".", "-sm.")
                // i.php?/upload/2023/01/04/20230104223508-af744305-sm.jpg
              );
            });
          },
        },
      }
    )
      .setPosition(3, 0)
      .setSize(9, 12),

    gridCellMaker(
      "editable",
      "编辑",
      {},
      {
        name: "setting_editable",
        type: cardComponentType.componentList,
      },
      {
        isSettingTool: true,
      }
    )
      .setPosition(11, 0)
      .setSize(1, 1),
    gridCellMaker(
      "openComponents",
      "打开组件菜单",
      {},
      {
        type: cardComponentType.componentList,
        name: "icon",
      },
      {
        isSettingTool: true,
        props: {
          name: "Grid",
          onClickFunc: (content: any) => {
            const { context } = content;
            context.emit(
              "onChange",
              {},
              {
                type: [cardOnChangeType.openComponentsList],
              }
            );
          },
        },
      }
    )
      .setPosition(11, 1)
      .setSize(1, 1),
  ] as gridCellTemplate[];
