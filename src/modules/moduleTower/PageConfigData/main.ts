/*
 * @Date: 2022-04-28 22:29:05
 * @LastEditors: CZH
 * @LastEditTime: 2023-12-26 01:16:40
 * @FilePath: /ConfigForDesktopPage/src/modules/moduleTower/PageConfigData/main.ts
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
import { setSize } from "../../../components/basicComponents/grid/module/util";
import { btnActionTemplate, drawerProps, stringAnyObj, tableCellTemplate } from "@/modules/userManage/types";
import { post } from "@/utils/api/requests";
import {
  SearchCellStorage,
  actionCell,
  tableCellTemplateMaker,
} from "@/modules/userManage/component/searchTable/searchTable";
import { btnMaker, openDrawerFormEasy } from "@/modules/userManage/component/searchTable/drawerForm";
import { list } from "postcss";

export const mainDesktop = async (): Promise<gridCellTemplate[]> => {
  // const 设备字段存储库 = [
  const 设备字段存储库 = new SearchCellStorage([
    tableCellTemplateMaker("clientId", "clientId"),
    tableCellTemplateMaker("createTime", "createTime"),
    tableCellTemplateMaker("icon", "icon"),
    tableCellTemplateMaker("id", "id"),
    tableCellTemplateMaker("name", "name"),
    tableCellTemplateMaker("status", "status"),
    tableCellTemplateMaker("uniqueId", "uniqueId"),
    tableCellTemplateMaker("updateTime", "updateTime"),
  ]);
  // ]

  const 编辑设备 = btnMaker("编辑", btnActionTemplate.Function, {
    icon: "Edit",
    function: async (that, data) => {
      let drawerProps = {
        title:'编辑',
        queryItemTemplate:设备字段存储库.getByKeyArr(['name','uniqueId'])
      } as drawerProps;
      openDrawerFormEasy(that,drawerProps)
    },
  });
  const 操作栏 = tableCellTemplateMaker("操作", "asd", actionCell([编辑设备], {}));
  设备字段存储库.push(操作栏)
  const {labels ,keys} = 设备字段存储库
  const fuck = 设备字段存储库.getProps()
  console.log(labels,keys,'asasdasdd')
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
          modeChange: true,
          // isCard:true,
          searchItemTemplate: [],
          showItemTemplate: 设备字段存储库.getAll(),
          searchFunc: async (query: stringAnyObj, that: stringAnyObj) => {
            let res = await post("/admin/iot/device/searchByName", {
              ...query,
            });
            return {
              ...res.data,
              ...res.data.pagination,
            };
          },
          btnList: [],
          autoSearch: false,
        },
        isSettingTool: false,
      }
    )
      .setPosition(0, 0)
      .setSize(12, 8),
  ];
};
