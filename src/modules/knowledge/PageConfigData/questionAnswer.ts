/*
 * @Author: LJH
 * @Date: 2023-07-07 14:59:04
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-07-27 15:47:18
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

export const questionAnswer = async () => {
  return [
    gridCellMaker(
      "questionAnswer",
      "智能问答页面",
      {},
      {
        name: "knowledge_questionAnswer",
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
