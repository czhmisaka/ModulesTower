/*
 * @Date: 2022-04-28 22:29:05
 * @LastEditors: CZH
 * @LastEditTime: 2023-11-08 18:31:34
 * @FilePath: /lcdp_fe_setup/src/modules/ApplicationManage/PageConfigData/applicationSettingPage/appDevConfig.tsx
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
import {
  ApplicationInfoTemplate,
  applicationStatus,
  stringAnyObj,
} from "../../types";
import { mainBoardSizeAndPosition } from "../main";
import { setPosition } from "../../../../components/basicComponents/grid/module/util";
import {
  SearchCellStorage,
  disabledCell,
  searchCell,
  showCell,
  tableCellTemplateMaker,
} from "@/modules/userManage/component/searchTable/searchTable";
import {
  btnMaker,
  repBackMessageShow,
} from "@/modules/userManage/component/searchTable/drawerForm";
import {
  btnActionTemplate,
  formInputType,
  showType,
} from "@/modules/userManage/types";
import { post } from "@/utils/api/requests";
import { defineComponent } from "vue";
import { ElCard, ElIcon, ElMessage } from 'element-plus';
import { Link } from "@element-plus/icons-vue";
import { windowResizeChecker } from "@/modules/userManage/component/eventCenter/eventCenter";
export const 终端映射 = {
  1: "PC",
  2: "H5",
};
const 应用开发配置字段库 = new SearchCellStorage([
  tableCellTemplateMaker(
    "App Key",
    "appKey",
    searchCell(formInputType.input, disabledCell())
  ),
  tableCellTemplateMaker(
    "App Secret",
    "appSecret",
    searchCell(formInputType.input, disabledCell())
  ),
  tableCellTemplateMaker("支持终端", "linkType", {
    ...searchCell(formInputType.checkBox, {
      inputOptions: [
        { label: "PC", value: "1" },
        { label: "H5", value: "2" },
      ],
      onChangeFunc: async (that, data) => {
        const linkArr = data.linkType.map((x) => {
          return tableCellTemplateMaker(
            `${终端映射[x]}链接`,
            `${终端映射[x]}_link`
          );
        });
        return [...应用开发配置字段库.getAll(), ...linkArr];
      },
    }),
    ...showCell(showType.funcComponent, {
      showFunc: (data, key) => {
        return defineComponent({
          setup: (props, content) => {
            return () => <div
              style={{
                display: "flex",
                justifyContent: 'flex-start'
              }}>
              {
                Object.keys(data).filter(x => x.indexOf('_link') > -1).map(x => {
                  return <ElCard body-style={{
                    padding: '0px 6px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    textWrap: 'nowrap'
                  }} style={{
                    // background: 'linear-gradient(135deg, rgb(64, 158, 255) -150%, rgba(0, 0, 0, 0) 50%) rgb(255, 255, 255)',
                    cursor: 'pointer',
                    boxShadow: 'none !important',
                    borderRaidus: '6px',
                    margin: '6px 6px 0px 0px',
                    minWidth: '180px',
                    maxWidth: '30vw',
                    height: 'auto',
                  }}
                  // onClick={() => window.open(data[x])}
                  >
                    <p><b><el-icon><Link /></el-icon>{x.split('_link')[0]} 地址</b></p>
                    {data[x]}
                  </ElCard>
                })
              }
            </div >
          }
        })
      },
    }),
  }),
]);

const queryItemTemplate = 应用开发配置字段库.getAll();

export const appDevConfig = async (appData: ApplicationInfoTemplate = {}) => {
  const 提交应用信息编辑 = btnMaker("提交", btnActionTemplate.Function, {
    elType: "primary",
    icon: "Position",
    function: async (that, data) => {
      const regList = [
        /^(?=^.{3,255}$)[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+$/,
        /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,
        /^(?=^.{3,255}$)(http(s)?:\/\/)?(www\.)?[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+(:\d+)*(\/\w+\.\w+)*$/,
        /^(?=^.{3,255}$)(http(s)?:\/\/)?(www\.)?[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+(:\d+)*(\/\w+\.\w+)*([\?&]\w+=\w*)*$/
      ]
      let needBreak = false
      data.linkType.map(x => {
        let url = data[终端映射[x] + '_link']
        let isTrue = false
        regList.map(x => {
          if (x.test(url)) isTrue = true
        })
        if (!isTrue) {
          needBreak = true
          ElMessage.error(url + " 不是合法的链接地址")
        }
      })
      if (!needBreak) {
        let res = await post("/web/app/update/link", {
          ...data,
          groups: appData.groups,
          links: data.linkType.map((x) => {
            return {
              linkType: x,
              link: data[终端映射[x] + "_link"],
            };
          }),
        });
        repBackMessageShow(that, res);
      }
    },
  });

  const 取消编辑 = btnMaker("取消编辑", btnActionTemplate.Function, {
    elType: "info",
    icon: "Close",
    function: async (that, data) => {
      let dealData = {
        mainBoard: {
          showTypeProp: "show",
          btnList: [编辑],
        },
      };
      changeCardProperties(that, dealData, true);
    },
  });

  const 编辑 = btnMaker("编辑", btnActionTemplate.Function, {
    icon: "Edit",
    elType: "primary",
    function: async (that, data) => {
      let dealData = {
        mainBoard: {
          showTypeProp: "edit",
          btnList: [提交应用信息编辑, 取消编辑],
        },
      };
      changeCardProperties(that, dealData, true);
    },
  });

  return [
    gridCellMaker(
      "mainBoard",
      "应用开发配置信息",
      {},
      {
        type: cardComponentType.componentList,
        name: "ApplicationManage_formPage",
      },
      {
        props: {
          formInputTemplate: queryItemTemplate,
          showItemTemplate: queryItemTemplate,
          defaultFormData: appData,
          showTypeProp: "show",
          cusStyle: {
            borderRadius: "6px",
          },
          btnList: [
            appData.published == applicationStatus.未发布 ? 编辑 : null,
          ].filter(Boolean),
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
      ), windowResize
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
