/*
 * @Date: 2022-04-28 22:29:05
 * @LastEditors: CZH
 * @LastEditTime: 2023-11-13 16:09:51
 * @FilePath: /lcdp_fe_setup/src/modules/ApplicationManage/PageConfigData/applicationSettingPage/appRoleManage.tsx
 */

import {
  changeVisible,
  changeCardSize,
  changeCardPosition,
  changeCardProperties,
} from "@/components/basicComponents/grid/module/cardApi/index";
import { ApplicationInfoTemplate, stringAnyObj } from "../../types";
import { mainBoardSizeAndPosition } from "../main";
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

import {
  btnMaker,
  dobuleCheckBtnMaker,
  openDrawerFormEasy,
  roleBtnMaker,
} from "@/modules/userManage/component/searchTable/drawerForm";
import {
  SearchCellStorage,
  tableCellTemplateMaker,
  showCell,
  searchCell,
  actionCell,
  customComponentMakerForSearchCell,
  staticSelectCell,
} from "@/modules/userManage/component/searchTable/searchTable";
import {
  showType,
  formInputType,
  btnActionTemplate,
  drawerProps,
  btnCellTemplate,
} from "@/modules/userManage/types";
import { ElMessage, ElMessageBox } from "element-plus";
import { refreshDesktop } from "@/components/basicComponents/grid/module/cardApi";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { useModuleHook } from "@/store/modules/module";

import { repBackMessageShow } from "@/modules/userManage/component/searchTable/drawerForm";
import { getModuleFromView, timeChecker } from "@/router/util";
import iconPicker from "@/modules/userManage/component/searchTable/inputElementComponent/iconPicker.vue";
import { timeConsole } from "@/main";
import { th } from "element-plus/es/locale";
import { windowResizeChecker } from "@/modules/userManage/component/eventCenter/eventCenter";
import { btnList } from "@/modules/knowledge/PageConfigData/template/templateDetail";
import { reactive } from "vue";


export const appRoleManage = async (data: ApplicationInfoTemplate = {}) => {

  const 应用用户管理字段库 = new SearchCellStorage([
    tableCellTemplateMaker("姓名", "name"),
    tableCellTemplateMaker("部门", "department"),
    tableCellTemplateMaker(
      "选择用户",
      "uids",
      searchCell(formInputType.searchList, {
        funcInputOptionsLoader: async (that) => {
          const remoteMethod = async (query: string) => {
            let res = await post("/web/usc/user/page", {
              name: query,
            });
            let data = [];
            if (res?.data?.list)
              data = res.data.list.map((x) => {
                return {
                  value: x.id + "",
                  label: x.name,
                };
              });
            return data;
          };
          return {
            "remote-method": remoteMethod,
          };
        },
      })
    ),
  ]);

  let roleArr = reactive({ data: [] })
  const getRoleArr = async (needNew = false) => {
    if (needNew || roleArr.data.length == 0) {
      let res = await post("/web/app/org/role/list", {});
      roleArr.data = res.data.map((x) => {
        return {
          ...x,
          isLeaf: !x.hasLeaf,
          value: x.id,
        };
      })
    }
    return roleArr
  }
  await getRoleArr()

  const 应用角色字段库 = new SearchCellStorage([
    tableCellTemplateMaker(
      "父级角色",
      "parentId",
      {
        ...searchCell(formInputType.treeSelect, {
          funcInputOptionsLoader: async (that) => {
            let attr = {
              props: {
                label: "name",
                isLeaf: "isLeaf",
              },
              showCheckbox: false,
              multiple: false,
              type: "number",
              nodeKey: "id",
            };
            let res = await post("/web/app/org/role/list", {});
            let data = getRoleArr(true);
            return {
              ...attr,
              data,
            };
          },
          onChangeFunc: async (that, data, key) => {
            if (data[key] == 0)
              delete data[key]
            return data
          }
        }),
        ...showCell(showType.func, {
          showFunc: (data, key) => {
            let index = data[key]
            function flattenArray(arr, key) {
              let needtrans = []
              arr.map(x => x[key] && x[key].length > 0 ? needtrans = needtrans.concat(flattenArray(x[key], key)) : null)
              return arr.concat(needtrans)
            }
            let checkMap = flattenArray(roleArr.data, 'children')
            return index == 0 ? '-' : checkMap.filter(x => x.id == index)[0].name
          }
        })
      }
    ),
    tableCellTemplateMaker("角色名称", "name"),
    tableCellTemplateMaker("简介", "description"),
    // tableCellTemplateMaker("规则配置", "rule"),
    tableCellTemplateMaker("权限标识", "permission"),
    tableCellTemplateMaker(
      "排序",
      "orderNumber",
      searchCell(formInputType.number)
    ),
  ]);

  const 删除应用角色 = btnMaker("删除角色", btnActionTemplate.Function, {
    elType: "danger",
    icon: "Delete",
    function: async (that, data) => {
      let res = await post("/web/app/org/role/delete", {
        id: data.id,
      });
      repBackMessageShow(that, res);
    },
  });

  const 新增角色 = btnMaker("新增角色", btnActionTemplate.Function, {
    elType: "primary",
    icon: "Plus",
    function: async (that, da) => {
      let drawerProps = {
        title: "新增角色",
        queryItemTemplate: 应用角色字段库.getAll(),
        schema: {
          required: ["name"],
        },
        data: {
          appId: data.id,
          name: "",
          description: "",
          rule: "",
          parentId: da?.id ? da?.id : "0",
          permission: "",
          orderNumber: "",
        },
        btnList: [
          btnMaker("提交", btnActionTemplate.Function, {
            function: async (that, data) => {
              let res = await post("/web/app/org/role/insert", data);
              repBackMessageShow(that, res);
            },
          }),
        ],
      } as drawerProps;
      openDrawerFormEasy(that, drawerProps);
    },
  });

  const 编辑角色 = btnMaker("编辑", btnActionTemplate.Function, {
    function: async (that, da) => {
      let drawerProps = {
        title: `编辑角色【${da.name}】`,
        queryItemTemplate: 应用角色字段库.getAll(),
        schema: {
          required: ["name"],
        },
        data: {
          appId: data.id,
          ...da,
        },
        btnList: [
          btnMaker("提交", btnActionTemplate.Function, {
            function: async (that, data) => {
              let res = await post("/web/app/org/role/update", data);
              repBackMessageShow(that, res);
            },
          }),
        ],
      } as drawerProps;
      openDrawerFormEasy(that, drawerProps);
    },
  });

  const 打开角色详情 = async (that, data) => {
    let drawerProps = {
      title: `【${data["name"]}】`,
      queryItemTemplate: 应用角色字段库.getAll(),
      data,
      noEdit: true,
      btnList: [{ ...新增角色, label: '新增下级角色' }, 编辑角色, 删除应用角色],
    } as drawerProps;
    openDrawerFormEasy(that, drawerProps);
  };

  const 新增绑定用户 = btnMaker("绑定用户", btnActionTemplate.Function, {
    elType: "primary",
    icon: "Plus",
    function: async (that4, da) => {
      openDrawerFormEasy(that4, {
        title: `角色【${that4.baseData?.role.name}】绑定用户`,
        queryItemTemplate: [应用用户管理字段库.getByKey("uids")],
        data: {
          roleId: that4.baseData?.role?.id,
        },
        btnList: [
          btnMaker("提交", btnActionTemplate.Function, {
            function: async (that, data) => {
              let res = await post("/web/app/org/role/authUser", data);
              repBackMessageShow(that, res);
            },
          }),
        ],
      });
    },
  });

  const 批量解除绑定 = btnMaker("解除绑定", btnActionTemplate.Function, {
    icon: "Delete",
    elType: "danger",
    isShow: (data) => {
      const { _selectedList } = data;
      return _selectedList && _selectedList.length > 0;
    },
    function: async (that, data) => {
      const { _selectedList } = data;
      console.log(data);
      let res = await post("/web/app/org/role/cancelUser", {
        roleId: that.baseData?.role?.id,
        uids: _selectedList.map((x) => x.id),
      });
      repBackMessageShow(that, res);
    },
  });

  应用用户管理字段库.push(
    tableCellTemplateMaker(
      "操作",
      "asd",
      actionCell([
        btnMaker("解除绑定", btnActionTemplate.Function, {
          function: async (that, data) => {
            let res = await post("/web/app/org/role/cancelUser", {
              roleId: that.baseData?.role?.id,
              uids: [data.id],
            });
            repBackMessageShow(that, res);
          },
        }),
      ])
    )
  );

  return [
    gridCellMaker(
      "mainBoard",
      "菜单列表分层获取",
      {},
      {
        name: "userManage_menuList",
        type: cardComponentType.componentList,
      },
      {
        props: {
          treeDataFunc: async (that, name = "") => {
            let res = await post("/web/app/org/role/list", { appId: data.id });
            return res.data
              ? res.data.map((x) => {
                return {
                  ...x,
                  value: x.id,
                };
              })
              : [];
          },
          searchBtn: 新增角色,
          clickItemDetailFunc: 打开角色详情,
          outputKey: "role",
          defaultProps: {
            label: "name",
            children: "children",
          },
        },
        isSettingTool: false,
      }
    )
      .setSize(
        mainBoardSizeAndPosition().size.width * 0.3,
        mainBoardSizeAndPosition().size.height
      )
      .setPosition(
        mainBoardSizeAndPosition().position.x,
        mainBoardSizeAndPosition().position.y
      ),
    gridCellMaker(
      "mainBoard1",
      "搜索结果列表",
      {},
      {
        name: "userManage_searchTable",
        type: cardComponentType.componentList,
      },
      {
        props: {
          searchItemTemplate: 应用用户管理字段库.getByLabelArr(["姓名"]),
          showItemTemplate: 应用用户管理字段库.getByLabelArr([
            "姓名",
            "部门",
            "操作",
          ]),
          searchFunc: async (query: stringAnyObj, that) => {
            let res = { data: { list: [] } };
            if (that.baseData?.role?.id) {
              res = await post("/web/app/org/role/page/user", {
                ...query,
                roleId: that.baseData?.role?.id,
              });
            }
            return res.data.list ? res.data : { ...res.data, list: [] };
          },
          defaultQuery: {
            showLink: null,
          },
          searchKeyWithBaseData: ["role"],
          btnList: [新增绑定用户, 批量解除绑定],
          autoSearch: false,
        },
        showInGridDesktop: true,
        isSettingTool: false,
      }
    )
      .setSize(
        mainBoardSizeAndPosition().size.width * 0.7,
        mainBoardSizeAndPosition().size.height
      )
      .setPosition(
        mainBoardSizeAndPosition().position.x +
        mainBoardSizeAndPosition().size.width * 0.3,
        mainBoardSizeAndPosition().position.y
      ),
    windowResize,
  ] as gridCellTemplate[];
};

let timeOut = null as any;
const windowResize = windowResizeChecker(async (that, baseData) => {
  if (timeOut) clearTimeout(timeOut);
  timeOut = setTimeout(() => {
    changeCardSize(that, {
      mainBoard: {
        width: mainBoardSizeAndPosition().size.width * 0.3,
        height: mainBoardSizeAndPosition().size.height,
      },
      mainBoard1: {
        width: mainBoardSizeAndPosition().size.width * 0.7,
        height: mainBoardSizeAndPosition().size.height,
      },
    });
    changeCardPosition(that, {
      mainBoard: {
        x: mainBoardSizeAndPosition().position.x,
        y: mainBoardSizeAndPosition().position.y,
      },
      mainBoard1: {
        x:
          mainBoardSizeAndPosition().position.x +
          mainBoardSizeAndPosition().size.width * 0.3,
        y: mainBoardSizeAndPosition().position.y,
      },
    });
  }, 50);
}, "mainBoard_windowResize");
