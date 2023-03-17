/*
 * @Date: 2023-02-16 23:41:40
 * @LastEditors: CZH
 * @LastEditTime: 2023-03-18 01:58:56
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

const 提交 = btnMaker("确定", btnActionTemplate.Function, {
  elType: "primary",
  icon: "Position",
  function: async (that, data) => {
    let res = await piwigoMethod({
      method: "pwg.collections.addImages",
      ...data,
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
              const user = useUserStoreHook();
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
        image_ids: [data.id, 1],
      },
      btnList: [提交],
    } as drawerProps;
    openDrawerFormEasy(that, drawerProps);
  },
});

export const InfoCardBtnList = [收藏按钮];
