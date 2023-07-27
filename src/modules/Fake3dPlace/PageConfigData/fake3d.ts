/*
 * @Date: 2023-03-12 23:10:24
 * @LastEditors: CZH
 * @LastEditTime: 2023-07-23 21:20:42
 * @FilePath: /ConfigForDesktopPage/src/modules/Fake3dPlace/PageConfigData/fake3d.ts
 */
import { changeCardPosition } from "@/components/basicComponents/grid/module/cardApi";
import {
  gridCellMaker,
  gridSizeMaker,
  cardComponentType,
  cardOnChangeType,
  gridCellTemplate,
} from "@/components/basicComponents/grid/module/dataTemplate";
import { openDrawerFormEasy } from "@/modules/userManage/component/searchTable/drawerForm";
import { post } from "@/utils/api/requests";
import {
  btnActionTemplate,
  drawerProps,
  formInputType,
  stringAnyObj,
} from "@/modules/userManage/types";

import stone from "@/modules/Fake3dPlace/assest/stone.png";
import house1 from "@/modules/Fake3dPlace/assest/house1.png";
import house2 from "@/modules/Fake3dPlace/assest/house2.png";
import house3 from "@/modules/Fake3dPlace/assest/house3.png";

let num = 0;
const block = (transform, image = stone) =>
  gridCellMaker(
    "spritBlock_" + num++,
    "spritBlock",
    {},
    {
      name: "Fake3dPlace_spritBlock",
      type: cardComponentType.componentList,
    },
    {
      props: {
        image: image,
        fit: transform == "wall" ? "contain" : "cover",
        transform: transform,
        clickFunc: async (that) => {
          if (transform == "road") {
            const { detail } = that;
            console.log(detail);
            let data = {};
            data[detail.key] = {
              ...detail.gridInfo.default.position,
              x: detail.gridInfo.default.position.x + 1,
            };
            changeCardPosition(that, data);
          } else if (transform == "wall") {
            const getFunc = async (that, data) => {
              let { limit, offset } = data;
              let tags = 23;
              let res = await post(
                `/images?offset=${offset}&limit=${limit}${
                  tags ? "&tags=" + tags : ""
                }`,
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
            let drawerProps = {
              gridDesktop: true,
              size: 80,
              gridDesktopConfig: {
                desktopData: async () => [
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
                        getFunc: getFunc,
                        startSearch: true,
                      },
                    }
                  )
                    .setPosition(0, 0)
                    .setSize(12, 8),
                ],
                gridColNum: 12,
                cusStyle: {
                  wholeScreen: true,
                  maxRows: 8,
                },
              },
            } as drawerProps;
            openDrawerFormEasy(that, drawerProps);
          }
        },
      },
    }
  ).setSize(1, 1);

export const Fake3dPlace = async () => {
  let x = 24,
    y = 16;
  let list = [];
  for (let i_x = 0; i_x < x; i_x++) {
    for (let i_y = 0; i_y < y; i_y++) {
      list.push(block("road").setPosition(i_x, i_y));
    }
  }
  return [
    ...list,
    ...[1, 2, 3, 4, 5, 6, 7, 8, 10].map((x) => {
      return block("wall", house2).setPosition(x, 3);
    }),
    ...[3, 4, 5, 6, 7, 8, 10].map((x) => {
      return block("wall", house3).setPosition(x, 5);
    }),
    block("wall", house1).setPosition(10, 7).setSize(2, 2),
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
      .setPosition(5, 5)
      .setSize(1, 1),
  ];
};
