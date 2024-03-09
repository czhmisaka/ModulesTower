import {
  cardComponentType,
  gridCellMaker,
  gridCellTemplate,
} from "@/components/basicComponents/grid/module/dataTemplate";
import {
  iotEventActionTypeObject,
  iotEventTemplate,
  iotEventTriggerTypeObject,
} from "@/modules/moduleTower/types";
import {
  btnMaker,
  openDrawerFormEasy,
} from "@/modules/userManage/component/searchTable/drawerForm";
import {
  SearchCellStorage,
  staticSelectCell,
  tableCellTemplateMaker,
} from "@/modules/userManage/component/searchTable/searchTable";
import { btnActionTemplate, drawerProps } from "@/modules/userManage/types";
import { post } from "@/utils/api/requests";

let iotEventStoage = new SearchCellStorage([
  tableCellTemplateMaker("id", "id"),
  tableCellTemplateMaker("createTime", "createTime"),
  tableCellTemplateMaker("updateTime", "updateTime"),
  /** 事件名称 */
  tableCellTemplateMaker("事件名称", "name"),
  /** 事件描述 */
  tableCellTemplateMaker("事件描述", "description"),
  /** 触发主题 */
  tableCellTemplateMaker("触发主题", "triggerTopic"),
  /** 触发范围 */
  tableCellTemplateMaker("触发范围", "triggerTarget"),
  /** 触发方式 */
  tableCellTemplateMaker(
    "触发方式",
    "triggerType",
    staticSelectCell(iotEventTriggerTypeObject)
  ),
  /** 触发条件 */
  tableCellTemplateMaker("触发条件", "triggerCondition"),
  /** 触发事件类型 */
  tableCellTemplateMaker(
    "触发事件类型",
    "eventType",
    staticSelectCell(iotEventActionTypeObject)
  ),
  /** 目标主题 */
  tableCellTemplateMaker("目标主题", "targetTopic"),
]);

const openDrawerForIotEvent = async (that, data: iotEventTemplate = null) => {
  const isEdit = data.id ? true : false;
  let drawerProps = {
    title: isEdit ? "编辑事件" : "新增事件",
    size: 50,
    queryItemTemplate: [
      
    ],
  } as drawerProps;
  openDrawerFormEasy(that, drawerProps);
};

const 新增事件 = btnMaker("新增事件", btnActionTemplate.Function, {
  icon: "Plus",
  function: async (that, data) => {
    openDrawerForIotEvent(that);
  },
});

// iot设备事件管理列表
export const iotEventManage = async () => {
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
          showItemTemplate: iotEventStoage.getAll(),
          searchFunc: async (query, that) => {
            let res = await post("/admin/iot/iotEvent/list", {});
            return res.data;
          },
          defaultQuery: {
            showLink: null,
          },
          btnList: [新增事件],
          autoSearch: false,
          modeChange: true,
          isCard: false,
        },
      }
    )
      .setPosition(0, 0)
      .setSize(12, 8),
  ] as gridCellTemplate[];
};
