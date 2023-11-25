/*
 * @Author: LJH
 * @Date: 2023-07-07 14:59:04
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-07-11 09:37:45
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
import { SearchCellStorage } from "@/modules/userManage/component/searchTable/searchTable";

export const eventTemplateStorage = new SearchCellStorage([]);

export const knowledgeConfig = async () => {
  return [
    gridCellMaker(
      "knowledgeConfig",
      "知识专辑管理列表",
      {},
      {
        name: "knowledge_knowledgeConfig",
        type: cardComponentType.componentList,
      },
      {
        props: {},
        isSettingTool: false,
      }
    )
      .setPosition(0, 0)
      .setSize(12, 8),
  ] as gridCellTemplate[];
};
