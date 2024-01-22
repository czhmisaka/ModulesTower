import {
  cardComponentType,
  gridCellMaker,
  gridCellTemplate,
} from "@/components/basicComponents/grid/module/dataTemplate";
import {
  SearchCellStorage,
  tableCellTemplateCell,
  tableCellTemplateMaker,
} from "@/modules/userManage/component/searchTable/searchTable";
import { post } from "@/utils/api/requests";

const iot设备字段 = new SearchCellStorage([
  tableCellTemplateMaker("设备名称", "name"),
  tableCellTemplateMaker("设备名称（En)", "nameEn"),
  tableCellTemplateMaker("简介", "description"),
  tableCellTemplateMaker("设备服务", "service"),
  tableCellTemplateMaker("更新时间", "updateTime"),
  tableCellTemplateMaker("创建时间", "createTime"),
]);

// iotInfo 设备列表
export const iotInfoList = async (): Promise<gridCellTemplate[]> => {
  return [
    gridCellMaker(
      "列表",
      "list",
      {},
      {
        name: "userManage_searchTable",
        type: cardComponentType.componentList,
      },
      {
        props: {
          searchItemTemplate: [],
          showItemTemplate: iot设备字段.getAll(),
          searchFunc: async (query, that) => {
            let res = await post("/admin/iot/iot/list", {});
            return res.data;
          },
          defaultQuery: {
            showLink: null,
          },
          btnList: [],
          autoSearch: false,
        },
      }
    )
      .setPosition(0, 0)
      .setSize(12, 8),
  ] as gridCellTemplate[];
};
