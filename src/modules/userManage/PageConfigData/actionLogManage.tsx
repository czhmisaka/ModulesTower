/*
 * @Date: 2022-04-28 22:29:05
 * @LastEditors: CZH
 * @LastEditTime: 2023-11-14 19:40:13
 * @FilePath: /lcdp_fe_setup/src/modules/userManage/PageConfigData/actionLogManage.tsx
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
import { btnActionTemplate, formInputType, showType, stringAnyObj } from "@/modules/userManage/types";
import { btnMaker, roleBtnMaker } from "../component/searchTable/drawerForm";
import { changeCardProperties } from "@/components/basicComponents/grid/module/cardApi";

export const actionLogManageBtnList = [
  roleBtnMaker(['/web/sys/oplog/types', "/web/sys/oplog/page"], '查询操作日志菜单')
]

let actionLogType = {}
const getActionType = async () => {
  const actionLogTypeRes = await get('/web/sys/oplog/types', {})
  actionLogTypeRes.data.map(x => {
    actionLogType[x] = x
  })
}

export const actionLogManage = async () => {
  if (Object.keys(actionLogType).length == 0) {
    await getActionType()
  }
  // 部门数据
  const InfoTableCellStorage = new SearchCellStorage([
    tableCellTemplateMaker("操作人", "operatorName"),
    tableCellTemplateMaker('被操作对象', 'operatedObject'),
    tableCellTemplateMaker("操作详情", "detail", showCell(showType.dataKey, { width: '300px' })),
    tableCellTemplateMaker("IP", "ip"),
    tableCellTemplateMaker("操作时间", "createTime", DateCell()),
    tableCellTemplateMaker("操作地址", "operationAddress"),
    tableCellTemplateMaker('操作设备', 'operationEquipment', showCell(showType.func, {
      showFunc: (d, k) => d[k],
      width: '100px'
    })),
    tableCellTemplateMaker("操作类型", "type", {
      ...searchCell(formInputType.select, {
        inputOptions: actionLogType
      })
    })
  ]);
  const searchTableTemplate = [
    ...InfoTableCellStorage.getByLabelArr(['操作人', '被操作对象', '操作类型']),
    tableCellTemplateMaker('操作时间', 'timeRange', DateRangeCell('日志'),)
  ]
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
          btnList: [],
          searchFunc: async (query: stringAnyObj) => {
            const { timeRange } = query
            if (timeRange && timeRange.length > 1)
              query = {
                ...query,
                startTime: timeRange[0],
                endTime: timeRange[1] + 86400 * 1000,
              }
            let res = await post("/web/sys/oplog/page", { ...query });
            return res && res.data ? res.data : [];
          },
        },
        isSettingTool: false,
      }
    )
      .setPosition(0, 0)
      .setSize(12, 8),
  ] as gridCellTemplate[];
};
