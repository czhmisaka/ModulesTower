/*
 * @Date: 2022-04-28 22:29:05
 * @LastEditors: CZH
 * @LastEditTime: 2023-01-16 15:54:28
 * @FilePath: /configforpagedemo/src/modules/userManage/PageConfigData/actionLogManage.tsx
 */

import {
  gridCellMaker,
  cardComponentType,
  gridCellTemplate,
} from "@/components/basicComponents/grid/module/dataTemplate";
import { post, get } from "@/utils/api/requests";
import {
  SearchCellStorage,
  tableCellTemplateMaker,
  searchCell,
  showCell,
  DateCell,
  DateRangeCell
} from "@/modules/userManage/component/searchTable/searchTable";
import { formInputType, showType, stringAnyObj } from "@/modules/userManage/types";

export const actionLogManage = async () => {
  const actionLogTypeRes = await get('/web/usc/oplog/get', {})
  let actionLogType = {}
  actionLogTypeRes.data.map(x => {
    actionLogType[x] = x
  })

  // 部门数据
  const InfoTableCellStorage = new SearchCellStorage([
    tableCellTemplateMaker("操作人", "operatorName"),
    tableCellTemplateMaker('被操作对象', 'operatedObject'),
    tableCellTemplateMaker("操作类型", "type", {
      ...searchCell(formInputType.select, {
        inputOptions: actionLogType
      })
    }),
    tableCellTemplateMaker("操作详情", "detail", showCell(showType.dataKey, { width: '300px' })),
    tableCellTemplateMaker("IP", "ip"),

    // tableCellTemplateMaker("部门", "operatorUnitName"),

    tableCellTemplateMaker("操作时间", "createTime", DateCell()),
    tableCellTemplateMaker("操作地址", "operationAddress"),
    tableCellTemplateMaker('操作设备', 'operationEquipment')
  ]);



  const searchTableTemplate = [
    ...InfoTableCellStorage.getByLabelArr(['操作人', '被操作对象', '操作类型']),
    tableCellTemplateMaker('操作时间', 'timeRange', DateRangeCell('日志'),)
  ]


  const btnList = [];
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
          defaultQuery: {},
          autoSearch: false,
          searchItemTemplate: searchTableTemplate,
          showItemTemplate: InfoTableCellStorage.getAll(),
          searchFunc: async (query: stringAnyObj) => {
            const { timeRange } = query
            if (timeRange && timeRange.length > 1)
              query = {
                ...query,
                startTime: timeRange[0],
                endTime: timeRange[1],
              }
            let res = await post("/web/usc/oplog/page", { ...query });
            return res && res.data ? res.data : [];
          },
          btnList,
        },
        isSettingTool: false,
      }
    )
      .setPosition(0, 0)
      .setSize(12, 8),
  ] as gridCellTemplate[];
};
