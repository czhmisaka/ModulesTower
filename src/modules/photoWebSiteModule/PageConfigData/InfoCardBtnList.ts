/*
 * @Date: 2023-02-16 23:41:40
 * @LastEditors: CZH
 * @LastEditTime: 2023-06-22 23:53:42
 * @FilePath: /ConfigForDesktopPage/src/modules/photoWebSiteModule/PageConfigData/InfoCardBtnList.ts
 */
import {
  btnMaker,
  repBackMessageShow,
} from "@/modules/userManage/component/searchTable/drawerForm";
import {
  btnActionTemplate,
  drawerProps,
  formInputType,
} from "@/modules/userManage/types";
import { tableCellTemplateMaker } from "@/modules/userManage/component/searchTable/searchTable";
import { searchCell } from "../../userManage/component/searchTable/searchTable";
import { piwigoMethod } from "@/utils/api/requests";
import { openDrawerFormEasy } from "../../userManage/component/searchTable/drawerForm";
import { useUserStoreHook } from "@/store/modules/user";
import { useCartHook } from "@/store/modules/cart";

const 提交 = btnMaker("确定", btnActionTemplate.Function, {
  elType: "primary",
  icon: "Position",
  function: async (that, data) => {
    let res = await piwigoMethod({
      method: "pwg.collections.addImages",
      ...data,
      image_ids: data.image_ids,
    });
    repBackMessageShow(that, res);
  },
});

export const 收藏按钮 = btnMaker("收藏", btnActionTemplate.Function, {
  elType: "primary",
  icon: "CollectionTag",
  function: async (that, data) => {
    let drawerProps = {
      title: "选择收藏夹",
      queryItemTemplate: [
        tableCellTemplateMaker(
          "收藏夹",
          "col_id",
          searchCell(formInputType.searchList, {
            funcInputOptionsLoader: async (that) => {
              let attr = {
                multiple: false,
              };
              attr["remoteMethod"] = async (query) => {
                const user = useUserStoreHook();
                let options = JSON.parse(
                  JSON.stringify(await user.getOptions())
                );
                let res = await piwigoMethod({
                  method: "pwg.collections.getList",
                  name: query,
                  user_id: options.id,
                });
                return res.result.collections.map((x) => {
                  return {
                    value: x.id + "",
                    label: x.name,
                  };
                });
              };
              return attr;
            },
          })
        ),
      ],
      data: {
        image_ids: data.id ? [data.id] : data.map((x) => x.id),
      },
      btnList: [提交],
    } as drawerProps;
    openDrawerFormEasy(that, drawerProps);
  },
});

const 提交标签绑定 = btnMaker("提交", btnActionTemplate.Function, {
  icon: "Position",
  elType: "primary",
  function: async (that, data) => {
    let { tag_ids } = data;
    let map = [];

    data.image_ids.map((x) => {
      map.push(
        piwigoMethod({
          method: "pwg.images.setInfo",
          tag_ids,
          image_id: x,
        })
      );
    });
    Promise.all([map]).then((res) => {
      repBackMessageShow(that, {
        stat: "ok",
      });
    });
  },
});

export const 添加标签按钮 = btnMaker("添加标签", btnActionTemplate.Function, {
  function: async (that, data) => {
    let drawerProps = {
      title: "选择标签",
      queryItemTemplate: [
        tableCellTemplateMaker(
          "标签",
          "tag_ids",
          searchCell(formInputType.searchList, {
            funcInputOptionsLoader: async (that) => {
              const res = await await piwigoMethod({
                method: "pwg.tags.getAdminList",
              });
              const tags = res.result.tags;
              let attr = {
                multiple: false,
                remoteMethod: async (data) => {
                  if (!data)
                    return tags.map((x) => {
                      return {
                        ...x,
                        value: x.id + "",
                        label: x.name,
                      };
                    });
                  else
                    return tags
                      .filter((x) => x.name.indexOf(data) > -1)
                      .map((x) => {
                        return {
                          ...x,
                          value: x.id + "",
                          label: x.name,
                        };
                      });
                },
              };
              return attr;
            },
          })
        ),
      ],
      data: {
        image_ids: data.id ? [data.id] : data.map((x) => x.id),
      },
      btnList: [提交标签绑定],
    } as drawerProps;
    openDrawerFormEasy(that, drawerProps);
  },
});

const cart = useCartHook();
export const 添加到处理区 = btnMaker(
  "添加到处理区",
  btnActionTemplate.Function,
  {
    icon: "Plus",
    elType: "primary",
    function: async (that, data) => {
      console.log(that, typeof data, "asd");
      const cart = useCartHook();
      if (data.length && data.length > 0) cart.setCart(data.map((x) => x.id));
      else cart.setCart([data.id]);
    },
  }
);

export const InfoCardBtnList = [收藏按钮, 添加标签按钮, 添加到处理区];
