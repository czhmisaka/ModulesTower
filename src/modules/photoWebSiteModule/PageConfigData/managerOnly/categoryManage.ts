/*
 * @Date: 2023-02-18 19:50:20
 * @LastEditors: CZH
 * @LastEditTime: 2023-02-19 19:29:19
 * @FilePath: /ConfigForDesktopPage/src/modules/photoWebSiteModule/PageConfigData/managerOnly/categoryManage.ts
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

export const categoryManage = async () => {
  const categorysStorage = new SearchCellStorage([
    tableCellTemplateMaker("相册名", "name"),
    tableCellTemplateMaker("描述", "comment"),
    tableCellTemplateMaker("图片数量", "total_nb_images"),
    tableCellTemplateMaker("子相册数量", "nb_categories"),
    tableCellTemplateMaker("最近编辑时间", "lastmodified"),
  ]);

  const 提交 = btnMaker("提交", btnActionTemplate.Function, {
    elType: "primary",
    function: async (that, data) => {
      let res = await piwigoMethod({
        method: "pwg.categories.add",
        ...data,
      });
      repBackMessageShow(that, res);
    },
  });

  const 新增相册 = btnMaker("新增", btnActionTemplate.Function, {
    icon: "Plus",
    elType: "primary",
    function: async (that, data) => {
      let base = {};
      if (data && data.id) base["parent"] = data.id;
      let drawerProps = {
        title: "新增相册",
        queryItemTemplate: categorysStorage.getByKeyArr(["name", "comment"]),
        btnList: [提交],
        data: base,
      };
      openDrawerFormEasy(that, drawerProps);
    },
  });

  const 编辑提交 = btnMaker("提交", btnActionTemplate.Function, {
    icon: "Position",
    elType: "primary",
    function: async (that, data) => {
      let res = await piwigoMethod({
        method: "pwg.categories.setInfo",
        category_id: data.id,
        name: data.name,
        comment: data.comment,
      });
      repBackMessageShow(that, res);
    },
  });

  const 编辑相册 = btnMaker("编辑", btnActionTemplate.Function, {
    icon: "Plus",
    elType: "primary",
    function: async (that, data) => {
      let drawerProps = {
        title: "编辑相册",
        queryItemTemplate: categorysStorage.getByKeyArr(["name", "comment"]),
        btnList: [编辑提交],
        data: data,
      };
      openDrawerFormEasy(that, drawerProps);
    },
  });

  const 删除相册 = btnMaker("删除", btnActionTemplate.Function, {
    elType: "danger",
    icon: "Delete",
    function: async (that, data) => {
      if (await dobuleCheckBtnMaker("删除", data.name).catch(() => false))
        repBackMessageShow(
          that,
          await piwigoMethod({
            method: "pwg.categories.delete",
            category_id: data.id,
            pwg_token: useUserStoreHook().getOptions().token,
          })
        );
    },
  });

  categorysStorage.push(
    tableCellTemplateMaker(
      "操作",
      "asd",
      actionCell([新增相册, 编辑相册, 删除相册], {
        fixed: "right",
        noDetail: true,
      })
    )
  );

  return [
    gridCellMaker(
      "MenuList",
      "菜单列表分层获取",
      {},
      {
        name: "userManage_menuListRemote",
        type: cardComponentType.componentList,
      },
      {
        props: {
          treeDataFuncByLevel: async (node, resolve) => {
            let data = {
              method: "pwg.categories.getList",
            };
            if (node.data && node.data.id && node.data.id != 0)
              data["cat_id"] = node.data.id;
            let res = await piwigoMethod(data);
            let back = res.result.categories;
            back = back
              .filter((x) =>
                node.data && node.data.id ? x.id != node.data.id : true
              )
              .map((x) => {
                return {
                  ...x,
                  isLeaf: x.nb_categories == 0,
                };
              });
            resolve(back);
          },
          clickItemDetailFunc: async (that, data) => {
            let drawerProps = {
              title: "相册",
              queryItemTemplate: categorysStorage.getByKeyArr([
                "name",
                "comment",
              ]),
              btnList: [新增相册, 编辑相册, 删除相册],
              data: data,
              noEdit: true,
            };
            openDrawerFormEasy(that, drawerProps);
          },
          searchBtn: 新增相册,
          outputKey: "category",
          defaultProps: {
            label: "name",
            children: "children",
            isLeaf: "isLeaf",
          },
        },
        isSettingTool: false,
      }
    )
      .setPosition(0, 0)
      .setSize(3, 8),
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
          showItemTemplate: categorysStorage.getAll(),
          searchFunc: async (query: stringAnyObj, that: stringAnyObj) => {
            let res = await piwigoMethod({
              method: "pwg.categories.getList",
              cat_id: that.baseData.category.id,
            });
            let back = res.result.categories;
            back = back.filter((x) => x.id != that.baseData.category.id);
            return back;
          },
          searchKeyWithBaseData: ["category"],
          btnList: [],
          autoSearch: false,
        },
        isSettingTool: false,
      }
    )
      .setPosition(3, 0)
      .setSize(9, 8),
  ] as gridCellTemplate[];
};
