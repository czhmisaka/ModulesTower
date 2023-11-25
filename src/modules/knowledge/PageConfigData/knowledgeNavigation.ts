/*
 * @Author: LJH
 * @Date: 2023-07-27 15:37:02
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-07-27 15:37:09
 */
import {
  gridCellMaker,
  gridSizeMaker,
  cardComponentType,
  cardOnChangeType,
  gridCellTemplate,
} from "@/components/basicComponents/grid/module/dataTemplate";

export const knowledgeNavigation = async () => {
  return [
    gridCellMaker(
      "knowledgeNavigation",
      "知识导航",
      {},
      {
        name: "knowledge_knowledgeNavigation",
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