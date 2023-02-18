/*
 * @Date: 2022-04-28 22:29:05
 * @LastEditors: CZH
 * @LastEditTime: 2023-02-19 04:58:13
 * @FilePath: /ConfigForDesktopPage/src/modules/photoWebSiteModule/PageConfigData/main.ts
 */

import {
  gridCellMaker,
  gridSizeMaker,
  cardComponentType,
  cardOnChangeType,
  gridCellTemplate,
} from "@/components/basicComponents/grid/module/dataTemplate";

import {
  btnMaker,
  closeBtn,
} from "@/modules/userManage/component/searchTable/drawerForm";
import {
  changeVisible,
  changeCardSize,
  changeCardPosition,
  changeCardProperties,
} from "@/components/basicComponents/grid/module/cardApi/index";
import { get, piwigoMethod, post } from "@/utils/api/requests";
import { ITEM_RENDER_EVT } from "element-plus/es/components/virtual-list/src/defaults";
import { xor } from "lodash";
import { openDrawerFormEasy } from "../../userManage/component/searchTable/drawerForm";
import { openDrawerForm } from "../../userManage/component/searchTable/drawerForm";
import { btnActionTemplate, drawerProps } from "@/modules/userManage/types";
import { tableCellTemplateMaker } from "@/modules/userManage/component/searchTable/searchTable";
import { repBackMessageShow } from "@/modules/userManage/component/searchTable/drawerForm";
import { stringAnyObj } from "../../userManage/types";

// 图片信息操作列表
import { InfoCardBtnList } from "./InfoCardBtnList";
import { setData } from "../../../components/basicComponents/grid/module/cardApi/index";
import { dobuleCheckBtnMaker } from "../../userManage/component/searchTable/drawerForm";

let baseData = {} as { [key: string]: any };
let lastFunc = -1;
let dataBe = {};

// 获取图片列表
const getFunc = async function (that, data) {
  let res = {} as stringAnyObj;
  const getCategory = async (data) => {
    let { limit, offset, query } = data;
    let { tags, name } = query;
    let res = await post(
      `/images?offset=${offset}&limit=${limit}${
        Object.keys(query).length == 0 && data.category?.id
          ? "&catrgory=" + data.category?.id
          : "&catrgory=1"
      }${tags ? "&tags=" + tags : ""}${name ? "&name=" + name : ""}`,
      []
    );
    return res;
  };
  const getCollection = async (data) => {
    let { limit, offset, query } = data;
    let resp = await piwigoMethod({
      col_id: data["collection"].id,
      method: "pwg.collections.getImages",
      per_page: limit,
      page: Math.floor(offset / limit),
    });
    return {
      data: {
        list: resp.result.images.map((x) => {
          return {
            ...x,
            path: x.element_url.replace("http://42.192.134.238:1200", "."),
          };
        }),
      },
    };
  };
  if (
    JSON.stringify(baseData["category"]) !=
    JSON.stringify(that.baseData["category"])
  ) {
    lastFunc = 1;
    res = await getCategory(data);
    setData(that, {
      collection: {},
    });
  } else if (
    JSON.stringify(baseData["collection"]) !=
    JSON.stringify(that.baseData["collection"])
  ) {
    lastFunc = 2;
    res = await getCollection(data);
    setData(that, {
      category: {},
    });
  } else if (lastFunc == 1) res = await getCategory(data);
  else if (lastFunc == 2) res = await getCollection(data);
  baseData = JSON.parse(JSON.stringify(that.baseData));
  return res.data.list.map((x) => {
    let path = x.path.replace("./", "/");
    return {
      ...x,
      url: `/imageserver/i.php?` + path.replace(".", "-sm.") + "",
    };
  });
};

const 新增收藏夹 = btnMaker("新增收藏夹", btnActionTemplate.OpenDrawer, {
  elType: "primary",
  drawerProps: {
    title: "新增收藏夹",
    queryItemTemplate: [
      tableCellTemplateMaker("收藏夹名", "name"),
      tableCellTemplateMaker("comment", "comment"),
    ],
    btnList: [
      btnMaker("提交", btnActionTemplate.Function, {
        function: async (that, data) => {
          let res = await piwigoMethod({
            method: "pwg.collections.create",
            ...data,
          });
          repBackMessageShow(that, res);
        },
      }),
    ],
  },
});

const 删除收藏夹 = btnMaker("删除", btnActionTemplate.Function, {
  elType: "danger",
  icon: "Delete",
  function: async (that, data) => {
    if (await dobuleCheckBtnMaker("删除收藏夹", data.name).catch(() => false)) {
      let res = await piwigoMethod({
        method: "pwg.collections.delete",
        col_id: data.id,
      });
      repBackMessageShow(that, res);
    }
  },
});

export const mainDesktop = async () => {
  let res = await piwigoMethod({
    method: "pwg.tags.getList",
  });
  let tagList = res.result.tags.map((x) => {
    return {
      ...x,
      label: x.name,
    };
  });

  return [
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
      .setPosition(0, 10)
      .setSize(2, 2),

    gridCellMaker(
      "categoryList",
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
      .setSize(2, 5),
    gridCellMaker(
      "collectionList",
      "收藏夹列表",
      {},
      {
        type: cardComponentType.componentList,
        name: "userManage_menuList",
      },
      {
        props: {
          treeDataFunc: async (that) => {
            let col = await piwigoMethod({
              method: "pwg.collections.getList",
            });
            return col.result.collections;
          },
          clickItemDetailFunc: (that, data) => {
            openDrawerFormEasy(that, {
              title: "收藏夹【" + data.name + "】",
              queryItemTemplate: [tableCellTemplateMaker("名字", "name")],
              noEdit: true,
              data,
              btnList: [删除收藏夹],
            });
          },
          searchBtn: 新增收藏夹,
          outputKey: "collection",
          defaultProps: {
            label: "name",
            children: "children",
          },
        },
      }
    )
      .setPosition(0, 5)
      .setSize(2, 5),
    gridCellMaker(
      "searchInfo",
      "搜索栏",
      {},
      {
        type: cardComponentType.componentList,
        name: "photoWebSiteModule_searchInfo",
      },
      {
        props: {
          outputKey: "query",
          tagList: tagList,
        },
      }
    )
      .setPosition(2, 0)
      .setSize(8, 1),
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
          getFunc: getFunc,
        },
      }
    )
      .setPosition(2, 1)
      .setSize(8, 11),
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
                y: 1,
              },
              searchInfo: { x: 2, y: 0 },
            });
            changeCardSize(context, {
              InfoCard: {
                width: 2,
                height: 12,
              },
              waterFall: {
                width: 8,
                height: 11,
              },
              categoryList: {
                width: 2,
                height: 5,
              },
              collectionList: {
                width: 2,
                height: 5,
              },
              cate: {
                width: 2,
                height: 10,
              },
              searchInfo: {
                width: 8,
                height: 1,
              },
            });
            changeVisible(context, {
              upload: true,
              icon: false,
              searchInfo: true,
            });
            changeCardProperties(context, {
              waterFall: {
                watchKey: ["category", "query", "collection"],
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
};
