/*
 * @Date: 2022-04-28 22:29:05
 * @LastEditors: CZH
 * @LastEditTime: 2023-10-30 17:54:58
 * @FilePath: /lcdp_fe_setup/src/modules/ApplicationManage/PageConfigData/applicationSettingPage/appDepartmentAndMemberManage.tsx
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
} from "@/components/basicComponents/grid/module/cardApi/index";
import { ApplicationInfoTemplate, applicationStatus, stringAnyObj } from "../../types";
import { mainBoardSizeAndPosition } from "../main";
import { setPosition } from "../../../../components/basicComponents/grid/module/util";
import {
  SearchCellStorage,
  searchCell,
  showCell,
  tableCellTemplateMaker,
} from "@/modules/userManage/component/searchTable/searchTable";
import { post } from "@/utils/api/requests";
import { btnMaker, openDrawerFormEasy, repBackMessageShow } from "@/modules/userManage/component/searchTable/drawerForm";
import { btnActionTemplate, formInputType, showType } from "@/modules/userManage/types";
import { defineComponent } from "vue";
import { ElTag } from "element-plus";
import { 选择部门_多选 } from "@/modules/userManage/PageConfigData/main";
import { drawerProps } from '../../../userManage/types';
import { base } from "@/modules/userManage/PageConfigData/outSideSelect";
import { userSelect } from "@/modules/userManage/PageConfigData/outSideSelect/userSelect";
import { windowResizeChecker } from "@/modules/userManage/component/eventCenter/eventCenter";

const 部门和成员管理字段库 = new SearchCellStorage([
  tableCellTemplateMaker("部门范围", "units", {
    ...showCell(showType.funcComponent, {
      showFunc: (data, key) => {
        return defineComponent({
          setup(props, content) {
            return () => <div style={{
              display: "flex",
            }}>
              {data[key] ? data[key].map(x => {
                return <ElTag style={'marginLeft:6px'}>{`${x.name}【${x.description}】`}</ElTag>
              }) : ''}
            </div>
          },
        });
      },
    }),
  }),
  tableCellTemplateMaker("成员范围", "users", {
    ...showCell(showType.funcComponent, {
      showFunc: (data, key) => {
        return defineComponent({
          setup(props, content) {
            return () => <div style={{
              display: "flex",
            }}>
              {data[key] ? data[key].map(x => {
                return <ElTag type="info" style={'marginLeft:6px'}>{`${x.name}`}</ElTag>
              }) : ''}
            </div>
          },
        });
      },
    }),
  }),
]);




export const appDepartmentAndMemberManage = async (
  appData: ApplicationInfoTemplate = {}
) => {
  let res = await post("/web/app/org/list", {
    appId: appData.id,
  });
  const resData = {
    ...res.data,
    units: res.data['units'] ? res.data['units'].map(x => {
      return {
        ...x,
        label: x.name,
        value: x.id
      }
    }) : [],
    users: res.data['users'] ? res.data['users'].map(x => {
      return {
        ...x,
        label: x.name,
        value: x.id
      }
    }) : [],
  }
  const queryItemTemplate = 部门和成员管理字段库.getAll();

  const 确认选择 = btnMaker('提交', btnActionTemplate.Function, {
    icon: 'Position',
    elType: 'primary',
    function: async (that, data) => {
      console.log(data['modelValue'])
      let { units, users } = data['modelValue']
      let res = await post('/web/app/org/update', {
        orgList: [
          units && units.length > 0 ? {
            orgIds: units.map(x => x.value),
            orgType: 2 // 成员1 、部门2 、角色3
          } : null,
          users && users.length > 0 ? {
            orgIds: users.map(x => x.value),
            orgType: 1 // 成员1 、部门2 、角色3
          } : null,
        ].filter(Boolean),
        appId: appData.id
      })
      repBackMessageShow(that, res)
    }
  })

  const 编辑 = btnMaker("编辑部门和成员", btnActionTemplate.Function, {
    icon: "Edit",
    elType: "primary",
    function: async (that, data) => {
      let drawerProps = {
        title: '配置部门和成员',
        size: 70,
        gridDesktop: true,
        gridDesktopConfig: {
          ...base,
          cusStyle: {
            wholeScreen: true,
            maxRows: 8,
            margin: 12,
            Fullscreen: true,
            allPeopleCanSee: true,
          },
          desktopData: async () => {
            return await userSelect({
              selectPropsList: [{
                label: '部门',
                key: 'units',
                color: 'primary'
              }, {
                label: '用户',
                key: 'users',
                color: 'info'
              }],
              selectData: resData,
              selectedKey: {
                department: 'units',
                user: 'users'
              },
            })
          }
        },
        btnList: [
          确认选择
        ],
      } as drawerProps
      openDrawerFormEasy(that, drawerProps)
    },
  });
  return [
    gridCellMaker(
      "mainBoard",
      "应用信息",
      {},
      {
        type: cardComponentType.componentList,
        name: "ApplicationManage_formPage",
      },
      {
        props: {
          formInputTemplate: queryItemTemplate,
          showItemTemplate: queryItemTemplate,
          defaultFormData: { ...appData, ...resData },
          btnList: [
            appData.published == applicationStatus.未发布 ? 编辑 : null
          ].filter(Boolean),
          showTypeProp: "show",
          cusStyle: {
            borderRadius: "6px",
          },
        },
      }
    )
      .setSize(
        mainBoardSizeAndPosition().size.width,
        mainBoardSizeAndPosition().size.height
      )
      .setPosition(
        mainBoardSizeAndPosition().position.x,
        mainBoardSizeAndPosition().position.y
      ),
    windowResize
  ] as gridCellTemplate[];
};

let timeOut = null as any;
const windowResize = windowResizeChecker(async (that, baseData) => {

  if (timeOut) clearTimeout(timeOut);
  timeOut = setTimeout(() => {
    changeCardSize(that, {
      mainBoard: {
        width: mainBoardSizeAndPosition().size.width,
        height: mainBoardSizeAndPosition().size.height,
      },
    });
    changeCardPosition(that, {
      mainBoard: {
        x: mainBoardSizeAndPosition().position.x,
        y: mainBoardSizeAndPosition().position.y,
      },
    });
  }, 50);
}, "mainBoard_windowResize");