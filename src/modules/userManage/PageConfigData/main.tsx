/*
 * @Date: 2022-04-28 22:29:05
 * @LastEditors: CZH
 * @LastEditTime: 2023-11-22 10:43:50
 * @FilePath: /lcdp_fe_setup/src/modules/userManage/PageConfigData/main.tsx
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
  refreshDesktop,
  setData,
} from "@/components/basicComponents/grid/module/cardApi/index";
import { post, get } from "@/utils/api/requests";
import {
  allProcessDobuleCheckBtnMaker,
  btnMaker,
  closeBtn,
  dobuleCheckBtnMaker,
  roleBtnMaker,
} from "@/modules/userManage/component/searchTable/drawerForm";
import {
  SearchCellStorage,
  tableCellTemplateMaker,
  DateCell,
  searchCell,
  staticSelectCell,
  actionCell,
  remoteDictSelectSearchCell,
  showCell,
  gridDesktopCell,
} from "@/modules/userManage/component/searchTable/searchTable";
import {
  btnActionTemplate,
  stringAnyObj,
  formInputType,
  drawerProps,
  showType,
  gridDesktopPropsTemplate,
} from "@/modules/userManage/types";
import { ElMessage, ElMessageBox } from "element-plus";
import { userInfoCard } from '@/modules/userManage/PageConfigData/user/userInfo';
import { openDrawerFormEasy } from '../component/searchTable/drawerForm';

import { departmentBtnList, departmentDrawerprops, departmentPropsBtnList, 新增部门, 新增部门_不带入上级, 选择上级部门 } from './departmenet'
import { userFieldStorage } from "./user/userValueManage";
import { repBackMessageShow } from '@/modules/userManage/component/searchTable/drawerForm';
import { tableCellTemplate } from '../types';
import { base } from ".";

// 性别
const gender = {
  1: "男",
  2: "女",
};


export const 选择部门_多选 = tableCellTemplateMaker("部门", "unitIds", {
  ...searchCell(formInputType.treeSelectRemote, {
    funcInputOptionsLoader: async (that) => {
      let parentList = that.baseData?.unit?.parentIds ? that.baseData?.unit?.parentIds.split(',') || []
        : [];
      let attr = {
        props: {
          label: "name",
          isLeaf: "isLeaf",
          children: "children",
          value: "id",
        },
        nodeKey: "id",
      };
      let res = await post("/web/usc/unit/list", {});
      let back = res.data.map((x) => {
        return {
          ...x,
          isLeaf: !x.hasLeaf,
          value: x.id,
        };
      });
      async function checkChild(fuckNodeData) {
        let children = [];
        if (parentList.length > 0) {
          if (parentList.indexOf(fuckNodeData.id + "") > -1) {
            let res = await post("/web/usc/unit/list", {
              parentId: fuckNodeData.id,
            });
            for (let x = 0; x < res.data.length; x++) {
              children.push(
                await checkChild({
                  ...res.data[x],
                  isLeaf: !res.data[x].hasLeaf,
                  value: res.data[x].id,
                })
              );
            }
          }
        }
        let back = {
          ...fuckNodeData,
          children,
        };
        return back;
      }
      for (let x = 0; x < back.length; x++) {
        back[x] = await checkChild(back[x]);
      }
      attr["data"] = back;
      attr["load"] = async (node, resolve) => {
        let res = await post("/web/usc/unit/list", {
          parentId: node.data.id,
        });
        let back = res.data.map((x) => {
          return {
            ...x,
            isLeaf: !x.hasLeaf,
            value: x.id,
          };
        });
        return resolve(back);
      };
      return attr;
    },
  })
}) as tableCellTemplate

export const userTableCellStorage = new SearchCellStorage([
  tableCellTemplateMaker("姓名", "name"),
  tableCellTemplateMaker("性别", "gender", remoteDictSelectSearchCell('lcdp_user_gender')),
  tableCellTemplateMaker("头像", "icon", searchCell(formInputType.uploadImage)),
  tableCellTemplateMaker("简介", "description"),
  tableCellTemplateMaker("管理员", "adminFlag"),
  tableCellTemplateMaker("邮箱", "mail"),
  tableCellTemplateMaker("手机号", "mobile"),
  tableCellTemplateMaker(
    "生日",
    "birthday",
    DateCell({
      width: "200px",
    })
  ),
  tableCellTemplateMaker("身份证信息", "idCard"),
  tableCellTemplateMaker("浙政钉code", "zzdCode"),
  tableCellTemplateMaker("id", "id"),
  tableCellTemplateMaker("创建者id", "createUserId"),
  tableCellTemplateMaker(
    "创建时间",
    "createTime",
    DateCell({
      width: "200px",
    })
  ),
  tableCellTemplateMaker("修改者id", "updateUserId"),
  tableCellTemplateMaker(
    "最近修改时间",
    "updateTime",
    DateCell({
      width: "200px",
    })
  ),
  选择部门_多选,
  tableCellTemplateMaker('部门信息', 'unitNames', showCell(showType.func, {
    showFunc: (d, k, i) => i ? d['wholeUnitNames'] : d[k]
  })),
  tableCellTemplateMaker('职务', 'jobCode'),
  tableCellTemplateMaker("排序", "orderNumber"),
]);
// 搜索内容
const searchTable = new SearchCellStorage([
  ...userTableCellStorage.getByKeyArr(["name", "mobile"]),
]);



// 提交用户信息
const submitUserInfo = btnMaker("提交", btnActionTemplate.Function, {
  function: async (that, data) => {
    let ext = {}
    let queryItemTemplate = (await userFieldStorage()).getAll()
    queryItemTemplate.map((cell: tableCellTemplate) => {
      ext[cell.key] = data[cell.key]
    })
    let res = await post(
      "/web/usc/user/" + (data.id ? "update" : "insert"),
      {
        ...data,
        ext: JSON.stringify(ext)
      }
    );
    repBackMessageShow(that, res)
  },
  premission: [
    '/web/usc/user/update',
    '/web/usc/user/insert'
  ],
})

/**
  * @name: 打开新增弹窗
  * @description: waitForWriting
  * @authors: CZH
  * @Date: 2022-12-09 17:50:58
  */
const addNewModel = btnMaker("新增", btnActionTemplate.Function, {
  function: async (that, data) => {
    const unitIds = that.baseData.unit.id ? [that.baseData.unit.id] : []
    let drawerProps = {
      title: "创建新用户",
      schema: {
        required: ["name", "mobile", "unitIds"],
      },
      queryItemTemplate: [...userTableCellStorage.getByKeyArr([
        "name",
        'gender',
        'mobile',
        "icon",
        'unitIds'
      ]),
      ... (await userFieldStorage()).getAll()
      ],
      btnList: [
        submitUserInfo
      ],
      data: {
        unitIds: unitIds
      }
    };
    that.$modules
      .getModuleApi()
    ["userManage_openDrawerForm"](that, drawerProps);
  },
  premission: ["admin"],
  icon: "Plus",
  elType: "primary",
}, ["/web/usc/user/insert"], "创建新用户");

const editUserModel = btnMaker("编辑", btnActionTemplate.Function, {
  function: async (that, data) => {
    data.gender = data.gender + ''
    let drawerProps = {
      title: "用户编辑",
      size: 70,
      schema: {
        required: ['name', 'mobile']
      },
      queryItemTemplate: [...userTableCellStorage.getByKeyArr([
        "name",
        "icon",
        'gender',
        "mobile"
      ]),
      ... await (await userFieldStorage()).getAll(),
      tableCellTemplateMaker('', 'department', gridDesktopCell(async () => {
        return {
          gridColNum: 6,
          cusStyle: {
            wholeScreen: true,
            maxRows: 4,
            margin: 6,
          },
          componentLists: that.$modules.getAllComponents(),
          desktopData: async () => await userInfoCard(data),
          preBaseData: data,
        } as gridDesktopPropsTemplate;
      }, {
        style: {
          height: '40vh',
          maxHeight: '40vh',
          marginLeft: '-120px',
          width: 'calc(100% + 120px)'
        }
      }))
      ],
      btnList: [
        submitUserInfo
      ],
      data: {
        ...(JSON.parse(data.ext)),
        ...data,
      }
    } as drawerProps;
    openDrawerFormEasy(that, drawerProps)
  },
}, ["/web/usc/user/update"], "编辑用户");



// const 删除用户 = btnMaker('删除', btnActionTemplate.Function, {
//   function: async (that, data) => {
//     if (await dobuleCheckBtnMaker('删除用户', '').catch(x => false)) {
//       let res = await post('/web/usc/user/delete', {
//         id: data.id
//       })
//       repBackMessageShow(that, res)
//     }
//   }
// })

const 删除用户 = allProcessDobuleCheckBtnMaker('删除', '删除用户', (that, data) => `确认删除【${data['name']}】`, async (that, data) => await post('/web/usc/user/delete', {
  id: data.id
}))


/**
 * @name: roleBindBtn
 * @description: 角色绑定权限按钮
 * @authors: CZH
 * @Date: 2022-12-13 11:13:51
 */
const roleBindBtn = btnMaker("用户角色管理", btnActionTemplate.Function, {
  icon: "Connection",
  elType: "primary",
  function: async (that, user) => {
    let res = await post('/web/usc/user/select', { id: user.id })
    let drawerProps = {
      title: "用户角色管理",
      queryItemTemplate: [
        tableCellTemplateMaker(
          "用户角色",
          "roles",
          searchCell(formInputType.indexListForSwitch, {
            funcInputOptionsLoader: async (that) => {
              let attr = {
                customRender: (data, that) => {
                  return <el-card style='margin-bottom:6px;box-shadow:1px 1px 2px rgba(0,0,0,0.01)' bodyStyle={{
                    width: '100%',
                    padding: '6px',
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}>
                    <el-tag>{data.name}</el-tag>
                    <el-button size='small' type='danger' onClick={async () => {
                      let res1 = await post('/web/usc/role/cancelUser', { roleId: data.id, uids: [that.formData.id] })
                      ElMessage[res1.message == '成功' ? 'success' : 'err'](res1.message)
                      console.log('22222222222')
                      let user = await post('/web/usc/user/select', { id: res.data.id })
                      that.formData = user.data
                    }}>删除角色</el-button>
                  </el-card>
                }
              };
              return attr;
            },
          })
        ),
        searchTable.getByKey("roleId", {
          label: '新增角色'
        }),
        tableCellTemplateMaker('', 'checkBtn', searchCell(formInputType.button, {
          funcInputOptionsLoader: async (that) => {
            let attr = {
              buttonName: '新增角色',
              callBack: async (data) => {
                let res = await post('/web/usc/role/authUser', { roleId: data.roleId, uids: [data.id] })
                ElMessage[res.message == '成功' ? 'success' : 'err'](res.message)
                console.log(3333333333)
                let user = await post('/web/usc/user/select', { id: data.id })
                that.formData = user.data
              }
            }
            return attr
          }
        }))
      ],
      data: { ...res.data },
      btnList: [closeBtn],
    };
    that.$modules
      .getModuleApi()
    ["userManage_openDrawerForm"](that, drawerProps);
  },
}, ["/web/usc/role/cancelUser", "/web/usc/role/authUser"], "'取消角色绑定','新增角色绑定'");

/**
 * @name: unitBindBtn
 * @description: 用户部门管理按钮
 * @authors: CZH
 * @Date: 2022-12-14 11:05:55
 */
const unitBindBtn = btnMaker("用户部门管理", btnActionTemplate.Function, {
  icon: "OfficeBuilding",
  elType: "primary",
  function: async (that, user) => {
    let res = await post('/web/usc/user/select', { id: user.id })
    let drawerProps = {
      title: "用户部门管理",
      queryItemTemplate: [
        tableCellTemplateMaker(
          "用户部门",
          "units",
          searchCell(formInputType.indexListForSwitch, {
            funcInputOptionsLoader: async (that) => {
              let attr = {
                customRender: (data, that) => {
                  return <el-card style='margin-bottom:6px;box-shadow:1px 1px 2px rgba(0,0,0,0.01)' bodyStyle={{
                    width: '100%',
                    padding: '6px',
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}>
                    <el-tag>{data.name}</el-tag>
                    <el-button size='small' type='danger' onClick={async () => {
                      let res1 = await post('/web/usc/unit/deleteUser', { id: data.id, uids: [that.formData.id] })
                      ElMessage[res1.message == '成功' ? 'success' : 'err'](res1.message)
                      console.log('5555555')
                      let user = await post('/web/usc/user/select', { id: res.data.id })
                      that.formData = user.data
                    }}>退出部门</el-button>
                  </el-card>
                }
              };
              return attr;
            },
          })
        ),
        searchTable.getByKey("unitId", {
          label: '新增部门'
        }),
        tableCellTemplateMaker('', 'checkBtn', searchCell(formInputType.button, {
          funcInputOptionsLoader: async (that) => {
            let attr = {
              buttonName: '新增部门',
              callBack: async (data) => {
                let res = await post('/web/usc/unit/insertUserBatch', [{ id: data.unitId, uids: [data.id] }])
                ElMessage[res.message == '成功' ? 'success' : 'err'](res.message)
                let user = await post('/web/usc/user/select', { id: data.id })
                that.formData = user.data
              }
            }
            return attr
          }
        }
        ))
      ],
      data: { ...res.data },
      btnList: [closeBtn],
    };
    that.$modules
      .getModuleApi()
    ["userManage_openDrawerForm"](that, drawerProps);
  },
}, ["/web/usc/unit/deleteUser", "/web/usc/unit/insertUserBatch"], "'删除部门','新增部门'");

// 批量删除按钮
const 批量删除用户按钮 = btnMaker("批量删除", btnActionTemplate.Function, {
  isShow: (data) => {
    return data['_selectedList'] && data['_selectedList'].length > 0;
  },
  function: async (that, data) => {
    if (!that.selectedList || that.selectedList.length == 0)
      return ElMessage.warning("未选中需要删除的用户");
    let userList = that.selectedList;
    let { unit } = that.baseData;
    if (await dobuleCheckBtnMaker("删除部门成员", `即将删除部门【${unit.name}】下的成员：${userList
      .map((x) => x.name)
      .join(" ")}`).catch(() => false)) {
      let res = await post("/web/usc/user/deleteBatch", {
        unitId: unit.id,
        uids: userList.map((x) => x.id),
      });
      if (res.message && res.message == "成功") ElMessage.success("成功");
      if (that.close) that.close();
      else refreshDesktop(that);
    }
  },
  icon: "Delete",
  elType: "danger",
}, ["/web/usc/user/deleteBatch"],
  "批量删除用户按钮"
);

const 打开用户信息弹窗 = btnMaker('用户信息', btnActionTemplate.Function, {
  elType: 'primary',
  function: async (that, data) => {
    let drawProps = {
      title: '',
      size: 60,
      gridDesktop: true,
      gridDesktopConfig: {
        desktopData: async () => await userInfoCard(data),
        gridColNum: 6,
        preBaseData: data,
      },
    } as drawerProps
    openDrawerFormEasy(that, drawProps)
  }
}, [], "打开用户信息弹窗按钮")
const mainDesktop_btnList = [addNewModel, 批量删除用户按钮];

export const mainDesktop_licenseKeyBtnList = [
  editUserModel,
  删除用户,
  roleBtnMaker(["/web/usc/unit/list"], '部门分级查询接口'),
  roleBtnMaker(['/web/usc/unit/list/user/unit'], '模糊查询部门和人员'),
  ...departmentPropsBtnList,
]

/**
 * @name: mainDesktop
 * @description: 基于部门的用户管理
 * @authors: CZH
 * @Date: 2022-12-14 11:14:32
 */
export const mainDesktop = async () => {
  const tableAction = tableCellTemplateMaker(
    "操作",
    "actionBtnList",
    actionCell([
      // 打开用户信息弹窗
      editUserModel,
      删除用户
    ], {
      fixed: "right",
    })
  );
  return [
    gridCellMaker(
      "MenuList",
      "菜单列表分层获取",
      {},
      {
        name: "userManage_menuListRemote",
        type: cardComponentType.componentList,
      },
      {
        props: {
          treeDataFuncByLevel: async (node, resolve, searchData) => {
            const id = node.data ? node.data.id : ''
            let res = await post("/web/usc/unit/list", {
              parentId: id,
            });
            let data = res.data.map((x) => {
              return {
                ...x,
                isLeaf: !x.hasLeaf,
                value: x.id,
                label: `${x.name}(${x.memberNumber}人)`
              };
            });
            resolve(data);
          },
          searchFuncPlaceHolder: "搜索成员和部门",
          searchFuncByName: async (searchData) => {
            let res = await post("/web/usc/unit/list/user/unit", {
              name: searchData,
            });
            let units = res.data.units || [];
            let users = res.data.users || []
            units = units.map(x => {
              return {
                ...x,
                isLeaf: !x.hasLeaf,
                value: x.id,
                label: x.name + (x.memberNumber > 0 ? '(' + x.memberNumber + ')' : '')
              };
            })
            users = users.map(x => {
              return {
                ...x,
                isLeaf: !x.hasLeaf,
                value: x.id,
                label: x.name
              };
            })
            let back = []
            if (units && units.length > 0) {
              back.push({
                label: '部门',
                // icon: 'OfficeBuilding',
                data: units,
                detail: [],
                btn: btnMaker('', btnActionTemplate.Function, {
                  icon: 'More',
                  function: async (that, data) => {
                    departmentDrawerprops(that, data)
                  }
                })
              })
            }
            if (users && users.length > 0) {
              back.push({
                label: '用户',
                data: users,
                // icon: 'UserFilled',
                btn: {
                  ...editUserModel,
                  elType: 'info',
                  label: "",
                  icon: 'More',
                }
              })
            }
            return back
          },
          clickItemDetailFunc: (that, data) => {
            departmentDrawerprops(that, data)
          },
          searchBtn: 新增部门,
          outputKey: "unit",
          defaultProps: {
            label: "label",
            children: "children",
            isLeaf: "isLeaf",
          },
        },
        isSettingTool: false,
      }
    )
      .setPosition(0, 0)
      .setSize(3, 8),
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
          searchItemTemplate: searchTable.getAll(["unitId"]),
          showItemTemplate: [...userTableCellStorage.getByLabelArr([
            '姓名', '手机号', '部门信息', '性别'
          ]), tableAction],
          searchFunc: async (query: stringAnyObj, that: stringAnyObj) => {
            if (!that.baseData?.unit?.id) {
              return []
            }
            let res = await post("/web/usc/user/page/unit", {
              ...query,
              unitId: that.baseData?.unit?.id,
            });
            if (!res.data["list"]) res.data["list"] = [];
            if (!res.data["data"]) res.data["data"] = res.data["list"];
            return res.data;
          },
          autoSearch: false,
          searchKeyWithBaseData: ["unit"],
          defaultQuery: {
            searchChildrenFlag: 'false'
          },
          btnList: mainDesktop_btnList,
        },
        isSettingTool: false,
      }
    )
      .setPosition(3, 0)
      .setSize(9, 8),
  ] as gridCellTemplate[];
};

/**
 * @name: userManage
 * @description: 用户管理界面
 * @authors: CZH
 * @Date: 2022-12-14 08:30:00
 */
export const userManage = async () => {
  const tableAction = tableCellTemplateMaker(
    "操作",
    "actionBtnList",
    actionCell([unitBindBtn, roleBindBtn, editUserModel], {
      fixed: "right",
    })
  );
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
          searchItemTemplate: searchTable.getAll(),
          showItemTemplate: [
            ...userTableCellStorage.getAll(["unitId"]),
            tableAction,
          ],
          searchFunc: async (query: stringAnyObj, that: stringAnyObj) => {
            let res = await post("/web/usc/user/page", {
              ...query,
            });
            if (!res.data["list"]) res.data["list"] = [];
            if (!res.data["data"]) res.data["data"] = res.data["list"];
            return res.data;
          },
          autoSearch: false,
          searchKeyWithBaseData: ["unit"],
          btnList: [addNewModel],
        },
        isSettingTool: false,
      }
    )
      .setPosition(0, 0)
      .setSize(12, 8),
  ] as gridCellTemplate[];
};
export const userManageBtnList = [
  unitBindBtn, roleBindBtn, editUserModel, roleBtnMaker(['/web/usc/user/page'], '搜索用户')
]