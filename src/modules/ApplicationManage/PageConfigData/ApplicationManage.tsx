/*
 * @Date: 2023-02-28 18:21:13
 * @LastEditors: CZH
 * @LastEditTime: 2023-11-15 15:40:02
 * @FilePath: /lcdp_fe_setup/src/modules/ApplicationManage/PageConfigData/ApplicationManage.tsx
 */
import {
  gridCellMaker,
  gridSizeMaker,
  cardComponentType,
  cardOnChangeType,
  gridCellTemplate,
} from "@/components/basicComponents/grid/module/dataTemplate";
import { post, get } from "@/utils/api/requests";
import { ElIcon } from "element-plus";
import { allProcessDobuleCheckBtnMaker, btnMaker, openDrawerFormEasy } from "@/modules/userManage/component/searchTable/drawerForm";
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
import { changeCardProperties, refreshDesktop } from "@/components/basicComponents/grid/module/cardApi";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { useModuleHook } from "@/store/modules/module";
import { btnCellTemplate } from "@/modules/userManage/types";
import { repBackMessageShow } from "@/modules/userManage/component/searchTable/drawerForm";
import { defineComponent, h } from "vue";
import { ElTag } from "element-plus";
import { dobuleCheckBtnMaker } from '../../userManage/component/searchTable/drawerForm';
import * as Icons from "@element-plus/icons-vue";
import { customComponentMakerForSearchCell, staticSelectCell } from '../../userManage/component/searchTable/searchTable';
import iconPicker from '@/modules/userManage/component/searchTable/inputElementComponent/iconPicker.vue';
import { useRoute } from "vue-router";
import { ApplicationInfoTemplate, applicationType } from "../types";
import { fuckDefaultDeleteBtn } from "@/modules/Cultural/PageConfigData/ruoyiSystem";
import ApplicationCard from "../component/headerBar/applicationHeaderBar.vue";
import { checkToMenu, clearQuery, mainDesktop } from "./main";

let iconMap = {};
for (let x in Icons) {
  iconMap["EL_" + x] = x;
}

const 发布状态 = {
  0: "未发布", 1: "已发布"
}
export const 集成应用管理字段库 = new SearchCellStorage([
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
  tableCellTemplateMaker("图标", "icon", {
    ...customComponentMakerForSearchCell({
      isLocalComponent: true,
      component: iconPicker
    }),
    ...showCell(showType.funcComponent, {
      style: {
        paddingLeft: "4px",
        display: "inline-block",
        width: "40px",
      },
      showFunc: (data, key) => {
        if (data[key] && data[key][0] == "{")
          return useRenderIcon(JSON.parse(data[key]));
        else if (data[key]) return useRenderIcon(data[key]);
      },
    }),
  }),
  tableCellTemplateMaker("应用简介", "description", searchCell(formInputType.textarea)),
  tableCellTemplateMaker("应用状态", "published", {
    ...staticSelectCell(发布状态),
    ...showCell(showType.funcComponent, {
      showFunc: (row, key) => {
        return defineComponent({
          setup() {
            return () => <div style={{
              float: 'left',
              marginTop: '-2px',
              marginRight: '3px'
            }}><ElTag type={row[key] == 1 ? 'success' : 'info'} size="small">{发布状态[row[key]]}</ElTag>
            </div>
          },
        });
      },
    }),
  }),
  tableCellTemplateMaker("类型", "type", staticSelectCell({
    1: "自建", 2: "集成"
  })),
  tableCellTemplateMaker('分类', 'group', searchCell(formInputType.searchList, {
    funcInputOptionsLoader: async (that) => {
      let attr = {
        type: 'string',
        multiple: false,
        remoteMethod: async (data) => {
          let res = await post('/web/app/group/page', {})
          return res.data.list.map(x => {
            return {
              value: x.id + '',
              label: x.name
            }
          })
        }
      }
      return attr
    }
  })),
  tableCellTemplateMaker("应用分类", "groups",
    {
      ...searchCell(formInputType.searchList, {
        funcInputOptionsLoader: async (that) => {
          let attr = {
            multiple: true,
            remoteMethod: async (data) => {
              let res = await post('/web/app/group/page', {})
              return res.data.list.map(x => {
                return {
                  value: x.id,
                  label: x.name
                }
              })
            }
          }
          return attr
        }
      }),
      ...showCell(showType.funcComponent, {
        showFunc: (row, key) => {
          return defineComponent({
            setup() {
              return () => {
                {
                  return row?.appGroupList?.map(x =>
                    <div style={{
                      float: 'left',
                      marginTop: '-2px',
                      marginRight: '3px'
                    }}><ElTag type='info' size="small">{x.name}</ElTag>
                    </div>
                  )
                }
              }
            },
          });
        },
      })
    }
  ),
  tableCellTemplateMaker("所属部门", "belongUnitId", showCell(showType.func, {
    showFunc: (data, key) => {
      return data['belongUnitName'] || '-'
    }
  })),
  tableCellTemplateMaker("排序", "orderNumber", searchCell(formInputType.number)),
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
      type: 'warning',
    }).catch(() => false)) {
      let res = await post('/web/app/update/top', {
        id: data.id,
        top: !data.top
      })
      repBackMessageShow(that, res)
    }
  }
}, ['/web/app/update/top'], '集成应用置顶操作')


const 提交应用更新按钮 = btnMaker('提交', btnActionTemplate.Function, {
  icon: 'Position',
  elType: 'primary',
  function: async (that, data: ApplicationInfoTemplate) => {
    const isCreate = data.id ? '编辑' : '创建';
    const api = `/web/app/${data.id ? 'update' : 'insert'}`
    if (await dobuleCheckBtnMaker(`${isCreate}`, `确定提交应用【${data.name}】吗？`).catch(x => false)) {
      let res = await post(api, data)
      repBackMessageShow(that, res)
    }
  }
})

export const 编辑应用按钮 = btnMaker('编辑', btnActionTemplate.Function, {
  icon: 'Edit',
  elType: 'primary',
  function: async (that, data: ApplicationInfoTemplate) => {
    let drawProps = {
      title: data.name,
      size: 70,
      schema: {
        required: ['name', 'groups'],
      },
      queryItemTemplate: 集成应用管理字段库.getByKeyArr(['name', 'groups', 'orderNumber', 'description', 'belongUnitId', 'icon']),
      data: data,
      btnList: [提交应用更新按钮],
    } as drawerProps;
    openDrawerFormEasy(that, drawProps)
  },
}, ['/web/app/update'], '集成应用应用编辑操作')

export const 进入应用设置界面 = btnMaker('设置', btnActionTemplate.Function, {
  icon: 'Setting',
  elType: 'primary',
  function: async (that, data: ApplicationInfoTemplate) => {
    that.$router.push({
      path: '/ApplicationManage/MAIN',
      query: {
        appId: data.id,
        menu: '应用信息'
      },
    })
  }
})

export const 进入应用设置界面弹窗 = btnMaker('设置弹窗', btnActionTemplate.Function, {
  icon: 'Setting',
  elType: 'primary',
  function: async (that, data: ApplicationInfoTemplate) => {
    clearQuery()
    checkToMenu('应用信息&appId=' + data.id)
    openDrawerFormEasy(that, {
      gridDesktop: true,
      size: 90,
      gridDesktopConfig: {
        name: "开放平台应用管理界面-应用信息和管理界面",
        desktopData: mainDesktop,
        gridColNum: 192,
        cusStyle: {
          wholeScreen: true,
          maxRows: 108,
          margin: 6,
          Fullscreen: true,
          // NoMenu: true,
        },
      }
    })
  }
})

const 新增应用提交按钮 = btnMaker(
  '提交', btnActionTemplate.Function, {
  icon: 'Plus', elType: 'primary',
  function: async (that, data) => {
    let res = await post('/web/app/insert', data)
    repBackMessageShow(that, res)
  }
})

export const 新增集成应用 = btnMaker('新增应用', btnActionTemplate.Function, {
  icon: 'Plus',
  elType: 'primary',
  function: async (that) => {
    let drawProps = {
      title: '新增集成应用',
      size: 70,
      schema: {
        required: ['name', 'groups'],
      },
      queryItemTemplate: 集成应用管理字段库.getByKeyArr(['name', 'groups', 'orderNumber', 'description', 'belongUnitId', 'icon']),
      btnList: [新增应用提交按钮],
      data: {
        type: applicationType.集成
      }
    } as drawerProps;
    openDrawerFormEasy(that, drawProps)
  }
})

export const 新增低代码应用 = btnMaker('新增应用', btnActionTemplate.Function, {
  icon: 'Plus',
  elType: 'primary',
  function: async (that) => {
    let drawProps = {
      title: '新增低代码应用',
      size: 70,
      schema: {
        required: ['name', 'groups'],
      },
      queryItemTemplate: 集成应用管理字段库.getByKeyArr(['name', 'groups', 'orderNumber', 'description', 'belongUnitId', 'icon']),
      btnList: [新增应用提交按钮],
      data: {
        type: applicationType.自建
      }
    } as drawerProps;
    openDrawerFormEasy(that, drawProps)
  }
})

export const 发布应用 = btnMaker('发布', btnActionTemplate.Function, {
  icon: 'Position',
  elType: 'primary',
  isShow: (data) => { return data.published == 0 },
  function: async (that, data) => {
    if (await dobuleCheckBtnMaker('发布应用', `发布应用【${data.name}】`).catch(x => false)) {
      let res = await post('/web/app/update/status', {
        id: data.id,
        published: 1
      });
      repBackMessageShow(that, res)
    }
  }
})

export const 下架应用 = btnMaker('取消发布', btnActionTemplate.Function, {
  icon: 'Position',
  elType: 'danger',
  isShow: (data) => { return data.published == 1 },
  function: async (that, data) => {
    if (await dobuleCheckBtnMaker('取消发布应用', `取消发布应用【${data.name}】`).catch(x => false)) {
      let res = await post('/web/app/update/status', {
        id: data.id,
        published: 0
      });
      repBackMessageShow(that, res)
    }
  }
})

export const 删除应用 = allProcessDobuleCheckBtnMaker('删除', '删除应用', (that, data) => `删除应用【${data.name}】`, async (that, data) => {
  return await post('/web/app/delete', {
    id: data.id
  })
})


集成应用管理字段库.push(tableCellTemplateMaker('操作', 'asd', actionCell([
  置顶按钮,
  取消置顶按钮,
  // 编辑应用按钮,
  发布应用,
  下架应用,
  进入应用设置界面,
  删除应用
], {
  fixed: 'right',
  noEdit: true,
  noDetail: true,
})))

const cardFunc = (data) => {
  return defineComponent({
    setup(props, context) {
      return () => <div style={{
        position: 'relative',
        width: 'calc(25% - 12px)',
        height: '200px',
        margin: '0px 12px 12px 0px'
      }}>
        <ApplicationCard
          applicationInfo={data}
          showType={'card'}
          onBtnClick={(e) => {
            context.emit('btnClick', e)
          }}
          btnList={[
            置顶按钮,
            取消置顶按钮,
            发布应用,
            下架应用,
            // 进入应用设置界面弹窗,
            进入应用设置界面,
            删除应用]}
        >
        </ApplicationCard>
      </div>
    }
  })
}

export const ApplicationManage = async () => {
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
          searchItemTemplate: [...集成应用管理字段库.getByLabelArr([
            "应用名称",
            "应用状态",
          ]), 集成应用管理字段库.getByKey('group')],
          showItemTemplate: 集成应用管理字段库.getAll(['group']),

          searchFunc: async (querys: stringAnyObj) => {
            let query = JSON.parse(JSON.stringify(querys))
            if (!query) query = {};
            let res = await post("/web/app/page", {
              ...query,
              type: 2
            });
            return res.data.list.map((x) => {
              return {
                ...x,
              };
            });
          },
          isCard: true,
          cardFunc,
          defaultQuery: {
            showLink: null,
          },
          btnList: [新增集成应用],
          autoSearch: false,
        },
        isSettingTool: false,
      }
    )
      .setPosition(0, 0)
      .setSize(12, 8),
  ] as gridCellTemplate[];
};

export const LowCodeApplicationManage = async () => {
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
          searchItemTemplate: [...集成应用管理字段库.getByLabelArr([
            "应用名称",
            "应用状态",
          ]), 集成应用管理字段库.getByKey('group')],
          showItemTemplate: 集成应用管理字段库.getAll(['group']),
          searchFunc: async (querys: stringAnyObj) => {
            let query = JSON.parse(JSON.stringify(querys))
            if (!query) query = {};
            let res = await post("/web/app/page", {
              ...query,
              type: 1
            });
            return res.data.list.map((x) => {
              return {
                ...x,
              };
            });
          },
          defaultQuery: {
            showLink: null,
          },
          cardFunc,
          isCard: true,
          btnList: [新增低代码应用],
          autoSearch: false,
        },
        isSettingTool: false,
      }
    )
      .setPosition(0, 0)
      .setSize(12, 8),
  ] as gridCellTemplate[];
};