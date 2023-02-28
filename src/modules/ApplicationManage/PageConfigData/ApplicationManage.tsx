/*
 * @Date: 2023-02-28 18:21:13
 * @LastEditors: CZH
 * @LastEditTime: 2023-02-28 19:54:10
 * @FilePath: /configforpagedemo/src/modules/ApplicationManage/PageConfigData/ApplicationManage.tsx
 */
import {
  gridCellMaker,
  gridSizeMaker,
  cardComponentType,
  cardOnChangeType,
  gridCellTemplate,
} from "@/components/basicComponents/grid/module/dataTemplate";
import { post, get } from "@/utils/api/requests";
import * as Icons from "@element-plus/icons-vue";
import { ElIcon } from "element-plus";

import { btnMaker } from "@/modules/userManage/component/searchTable/drawerForm";
import {
  SearchCellStorage,
  tableCellTemplateMaker,
  showCell,
  searchCell,
  actionCell,
  remoteDictSelectSearchCell,
} from "@/modules/userManage/component/searchTable/searchTable";
import {
  showType,
  formInputType,
  stringAnyObj,
  btnActionTemplate,
  drawerProps,
} from "@/modules/userManage/types";
import { ElMessage, ElMessageBox } from "element-plus";
import { refreshDesktop } from "@/components/basicComponents/grid/module/cardApi";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { useModuleHook } from "@/store/modules/module";
import { btnCellTemplate } from "@/modules/userManage/types";
import { repBackMessageShow } from "@/modules/userManage/component/searchTable/drawerForm";
import { defineComponent } from "vue";
import { ElTag } from "element-plus";
import { dobuleCheckBtnMaker } from '../../userManage/component/searchTable/drawerForm';

const 集成应用管理字段库 = new SearchCellStorage([
  tableCellTemplateMaker("应用名称", "name", {
    ...showCell(showType.funcComponent, {
      showFunc: (row, key) => {
        return defineComponent({
          setup() {
            return () =>
              row.top ? <div>
                <div style={{
                  float: 'left',
                  marginTop: '-2px',
                  marginRight: '3px'
                }}><ElTag type='danger' size="small">置顶</ElTag></div>
                {row.name}
              </div > : <span>{row.name}</span>
          },
        });
      },
    }),
  }),
  // tableCellTemplateMaker("应用图标", "icon"),
  tableCellTemplateMaker("应用描述", "description"),
  tableCellTemplateMaker("应用状态", "published", remoteDictSelectSearchCell('lcdp_app_status')),
  tableCellTemplateMaker("应用类型", "type", remoteDictSelectSearchCell('lcdp_app_type')),
  tableCellTemplateMaker("应用分类", "groups", searchCell(formInputType.select)),
  tableCellTemplateMaker("所属部门ID", "belongUnitId"),
  tableCellTemplateMaker("排序", "orderNumber"),
]);


const 置顶按钮 = btnMaker('置顶', btnActionTemplate.Function, {
  icon: 'Top',
  elType: 'primary',
  isShow: (data) => {
    return !data.top;
  },
  function: async (that, data) => {
    if (await dobuleCheckBtnMaker('置顶应用', `【${data.name}】`, {
      type: 'success',
      icon: 'Position'
    }).catch(() => false)) {
      let res = await post('/web/app/update/top', {
        id: data.id,
        top: !data.top
      })
      repBackMessageShow(that, res)
    }
  }
}, ['/web/app/update/top'], '集成应用置顶操作')

const 取消置顶按钮 = btnMaker('取消置顶', btnActionTemplate.Function, {
  icon: 'Top',
  elType: 'danger',
  isShow: (data) => {
    return data.top;
  },
  function: async (that, data) => {
    if (await dobuleCheckBtnMaker('取消置顶应用', `【${data.name}】`, {
      type: 'danger',
      icon: 'Position'
    }).catch(() => false)) {
      let res = await post('/web/app/update/top', {
        id: data.id,
        top: !data.top
      })
      repBackMessageShow(that, res)
    }
  }
}, ['/web/app/update/top'], '集成应用置顶操作')

export const ApplicationManage = async () => {


  集成应用管理字段库.push(tableCellTemplateMaker('操作', 'asd', actionCell([置顶按钮, 取消置顶按钮], {
    fixed: 'right',
    noEdit: true
  })))
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
          searchItemTemplate: 集成应用管理字段库.getByLabelArr([
            "应用名称",
            "应用分类",
            "应用状态",
          ]),
          showItemTemplate: 集成应用管理字段库.getAll(),
          searchFunc: async (querys: stringAnyObj) => {
            let query = JSON.parse(JSON.stringify(querys))
            if (!query) query = {};
            if (query.published)
              query.published = query.published == 1 ? true : false
            let res = await post("/web/app/page", { ...query });
            return res.data.list.map((x) => {
              return {
                ...x,
                published: x.published ? 1 : 2
              };
            });
          },
          defaultQuery: {
            showLink: null,
          },
          btnList: [],
          autoSearch: false,
        },
        isSettingTool: false,
      }
    )
      .setPosition(0, 0)
      .setSize(12, 8),
  ] as gridCellTemplate[];
};
