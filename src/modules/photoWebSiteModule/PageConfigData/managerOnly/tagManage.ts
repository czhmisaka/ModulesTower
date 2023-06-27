/*
 * @Date: 2023-02-18 19:50:20
 * @LastEditors: CZH
 * @LastEditTime: 2023-06-27 08:50:16
 * @FilePath: /ConfigForDesktopPage/src/modules/photoWebSiteModule/PageConfigData/managerOnly/tagManage.ts
 */
import {
  btnMaker,
  repBackMessageShow,
} from "@/modules/userManage/component/searchTable/drawerForm";
import {
  btnActionTemplate,
  drawerProps,
  formInputType,
  stringAnyObj,
} from "@/modules/userManage/types";
import {
  actionCell,
  tableCellTemplateMaker,
} from "@/modules/userManage/component/searchTable/searchTable";
import { searchCell } from "@/modules/userManage/component/searchTable/searchTable";
import { piwigoMethod, post } from "@/utils/api/requests";
import { openDrawerFormEasy } from "@/modules/userManage/component/searchTable/drawerForm";
import { SearchCellStorage } from "../../../userManage/component/searchTable/searchTable";
import { dobuleCheckBtnMaker } from "../../../userManage/component/searchTable/drawerForm";
import { useUserStoreHook } from "@/store/modules/user";

import {
  cardComponentType,
  gridCellMaker,
  gridCellTemplate,
} from "@/components/basicComponents/grid/module/dataTemplate";

export const tagManage = async () => {
  const tagsStorage = new SearchCellStorage([
    tableCellTemplateMaker("标签名", "name"),
    tableCellTemplateMaker("图片数量", "counter"),
    tableCellTemplateMaker("最近编辑时间", "lastmodified"),
  ]);

  const 查看图片 = btnMaker("查看图片", btnActionTemplate.Function, {
    elType: "success",
    icon: "Search",
    function: async (that, dataa) => {
      const getFunc = async (that, data) => {
        let { limit, offset } = data;
        let tags = dataa.id;
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
    },
  });

  const 添加标签 = btnMaker("添加", btnActionTemplate.OpenDrawer, {
    elType: "primary",
    icon: "Plus",
    drawerProps: {
      title: "添加标签",
      queryItemTemplate: tagsStorage.getByKeyArr(["name"]),
      btnList: [
        btnMaker("提交", btnActionTemplate.Function, {
          icon: "Position",
          function: async (that, data) => {
            let res = await piwigoMethod({
              method: "pwg.tags.add",
              name: data.name,
            });
            repBackMessageShow(that, res);
          },
        }),
      ],
    },
  });

  const 删除标签 = btnMaker("删除", btnActionTemplate.Function, {
    icon: "Delete",
    elType: "danger",
    function: async (that, data) => {
      let user = useUserStoreHook();
      if (await dobuleCheckBtnMaker("删除标签", data.name).catch(() => false))
        repBackMessageShow(
          that,
          await piwigoMethod({
            method: "pwg.tags.delete",
            tag_id: data.id,
            pwg_token: (await useUserStoreHook().getOptions())["pwg_token"],
          })
        );
    },
  });
  tagsStorage.push(
    tableCellTemplateMaker(
      "操作",
      "asd",
      actionCell([查看图片, 删除标签], {
        fixed: "right",
        noDetail: true,
      })
    )
  );
  return [
    gridCellMaker(
      "searchTable",
      "搜索结果列表",
      {},
      {
        name: "userManage_searchTable",
        type: cardComponentType.componentList,
      },
      {
        props: {
          searchItemTemplate: [],
          showItemTemplate: tagsStorage.getAll(),
          searchFunc: async (query: stringAnyObj, that: stringAnyObj) => {
            let res = await piwigoMethod({ method: "pwg.tags.getAdminList" });
            return res && res.result ? res.result.tags : [];
          },
          btnList: [添加标签],
          autoSearch: false,
        },
        isSettingTool: false,
      }
    )
      .setPosition(0, 0)
      .setSize(12, 8),
  ] as gridCellTemplate[];
};
