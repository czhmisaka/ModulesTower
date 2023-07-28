/*
 * @Date: 2023-03-12 23:10:24
 * @LastEditors: CZH
 * @LastEditTime: 2023-07-28 22:14:23
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
import { changeCard3DTransform } from "@/modules/Fake3dPlace/cardApi/changeCard3DTransform";

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
        fit: transform == "wall" ? "fill" : "fill",
        transform: transform,
        clickFunc: async (that) => {
          if (transform == "road") {
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
  const road = [
    [1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
    [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0],
    [0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0],
    [0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0],
    [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
  ];
  let roadMap = [];
  road.map((x, iy) => {
    return x.map((c, ix) => {
      if (c != 0) {
        roadMap.push(block("road", stone).setPosition(ix, iy));
      } else {
        return false;
      }
    });
  });

  const wall = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ];
  let wallMap = [];
  wall.map((x, iy) => {
    return x.map((c, ix) => {
      if (c != 0) {
        wallMap.push(block("wall", house3).setPosition(ix, iy).setSize(1, 1.5));
      } else {
        return false;
      }
    });
  });
  let is3d = false;
  return [
    ...roadMap,
    ...wallMap,
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
      .setPosition(5, 0)
      .setSize(1, 1),
    gridCellMaker(
      "showElcard1",
      "显示elcard1",
      {},
      {
        type: cardComponentType.componentList,
        name: "icon",
      },
      {
        props: {
          name: "View",
          onClickFunc: (content: any) => {
            const { context } = content;
            is3d = !is3d;
            changeCard3DTransform(context, is3d);
          },
        },
      }
    )
      .setPosition(2, 4)
      .setSize(1, 1),
  ];
};
