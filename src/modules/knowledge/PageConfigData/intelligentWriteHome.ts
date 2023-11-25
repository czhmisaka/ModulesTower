/*
 * @Author: LJH
 * @Date: 2023-07-07 14:59:04
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-07-21 09:41:47
 */
/*
 * @Date: 2023-07-03 09:03:55
 * @LastEditors: Suily
 * @LastEditTime: 2023-07-03 16:52:40
 * @FilePath: \fe\src\modules\event\PageConfigData\eventList\list.ts
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
  setData,
} from "@/components/basicComponents/grid/module/cardApi/index";
import { post, get } from "@/utils/api/requests";
import {
  SearchCellStorage,
  tableCellTemplateMaker,
  DateCell,
  searchCell,
  actionCell,
  showCell,
  staticSelectCell,
} from "@/modules/userManage/component/searchTable/searchTable";
import {
  btnActionTemplate,
  btnCellTemplate,
  drawerProps,
  formInputType,
  showType,
  stringAnyObj,
  tableCellTemplate,
} from "@/modules/userManage/types";
import { btnMaker } from "@/modules/userManage/component/searchTable/drawerForm";
import { ElMessage, ElMessageBox } from "element-plus";
import { refreshDesktop } from "@/components/basicComponents/grid/module/cardApi";

export const eventTemplateStorage = new SearchCellStorage([]);

export const intelligentWriteHome = async () => {
  return [
    gridCellMaker(
      "intelligentWriteHome",
      "智能问答首页",
      {},
      {
        name: "knowledge_intelligentWriteHome",
        type: cardComponentType.componentList,
      },
      {
        props: {},
      }
    )
      .setPosition(0, 0)
      .setSize(12, 8),
  ] as gridCellTemplate[];
};
