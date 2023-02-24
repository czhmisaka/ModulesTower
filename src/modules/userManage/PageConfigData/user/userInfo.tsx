/*
 * @Date: 2022-04-28 22:29:05
 * @LastEditors: CZH
 * @LastEditTime: 2023-02-24 14:38:41
 * @FilePath: /configforpagedemo/src/modules/userManage/PageConfigData/user/userInfo.tsx
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
  btnMaker,
  closeBtn,
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
} from "@/modules/userManage/component/searchTable/searchTable";
import {
  btnActionTemplate,
  stringAnyObj,
  formInputType,
  drawerProps,
  showType,
  tableCellTemplate
} from "@/modules/userManage/types";
import { dateEquals, ElMessage, ElMessageBox } from "element-plus";
import { setSize } from '@/components/basicComponents/grid/module/util';
import { dobuleCheckBtnMaker } from '../../component/searchTable/drawerForm';
import { repBackMessageShow } from '@/modules/userManage/component/searchTable/drawerForm';
import { tableCellOptions } from '../../types';
import { openDrawerFormEasy } from '../../component/searchTable/drawerForm';
import { userFieldList, userFieldStorage } from "./userValueManage";
import { userTableCellStorage } from "../main";

// 角色管理
const roleManage = [
  tableCellTemplateMaker('角色', 'name'),
  tableCellTemplateMaker('描述', 'description'),
]

const 新增角色 = btnMaker('新增', btnActionTemplate.Function, {
  elType: 'primary',
  function: async (that, data) => {
    let drawerProps = {
      title: '新增角色',
      queryItemTemplate: [
        tableCellTemplateMaker('角色', 'roleId', searchCell(formInputType.searchList, {
          funcInputOptionsLoader: async (that) => {
            let attr = {
              multiple: false,
            };
            attr["remoteMethod"] = async (query) => {
              let res = await post("/web/usc/role/list", {
                name: query,
              });
              return res.data.map((x) => {
                return {
                  value: x.id + "",
                  label: x.name,
                };
              });
            };
            return attr;
          },
        }))
      ],
      data: {
        uids: that.query.uids
      },
      btnList: [
        btnMaker('提交', btnActionTemplate.Function, {
          elType: 'primary',
          function: async (that, data) => {
            let res = await post('/web/usc/role/authUser', data);
            repBackMessageShow(that, res)
          }
        })
      ]
    } as drawerProps;
    openDrawerFormEasy(that, drawerProps)
  }
}, [], '')

const 删除角色 = btnMaker('删除', btnActionTemplate.Function, {
  function: async (that, data) => {
    let res = await dobuleCheckBtnMaker('删除角色', '').catch(x => { })
    if (res) {
      let res = await post('/web/usc/role/cancelUser', data);
      repBackMessageShow(that, res)
    }
  }
}, [], '')

roleManage.push(
  tableCellTemplateMaker(
    "操作",
    "actionBtnList",
    actionCell([删除角色], {
      fixed: "right",
      noDetail: true
    })
  )
)




// 用户角色按钮列表
const roleBindBtnList = [新增角色]

const 部门 = tableCellTemplateMaker(
  "部门",
  "unitId",
  {
    ...searchCell(formInputType.treeSelectRemote, {
      funcInputOptionsLoader: async (that) => {
        let attr = {
          props: {
            label: "name",
            isLeaf: "isLeaf",
          },
          nodeKey: "id",
          multiple: false,
          showCheckbox: false
        };
        attr["load"] = async (node, resolve) => {
          let res = await post("/web/usc/unit/list", {
            parentId: node.data.id,
          });
          return resolve(
            res.data.map((x) => {
              return {
                ...x,
                isLeaf: !x.hasLeaf,
                value: x.id,
              };
            })
          );
        };
        return attr;
      },
    }),
    ...showCell(showType.func, {
      showFunc: (data, key) => {
        return data['name']
      }
    })
  }
)

const 部门无法编辑 = tableCellTemplateMaker('部门 ', 'name', searchCell(formInputType.input, {
  propertiesOption: {
    "ui:options": {
      disabled: true,
    },
  }
}))

// 部门管理列表
let departmentManage = new SearchCellStorage([
  部门,
  部门无法编辑,
  tableCellTemplateMaker('职务', 'jobName', remoteDictSelectSearchCell('lcdp_user_job')),
  tableCellTemplateMaker('办公地址', 'officeAddress'),
])

const 删除部门按钮 = btnMaker('删除', btnActionTemplate.Function, {
  elType: 'danger',
  icon: 'Delete',
  function: async (that, data) => {
    dobuleCheckBtnMaker('删除部门', `确定要解除和【${data.name}】部门的绑定关系吗`).then(async () => {
      let res = await post('/web/usc/unit/deleteUser', {
        id: data.id,
        uids: data.uids
      })
      repBackMessageShow(that, res)
    })
  }
}, ['/web/usc/unit/deleteUser'], '用户信息-删除部门按钮')

const 提交部门编辑或者新增 = btnMaker('提交', btnActionTemplate.Function, {
  function: async (that, data) => {
    let api = '/web/usc/unit/insertUserBatch';
    if (data.id)
      api = api.replace('insertUserBatch', 'updateUser')
    else
      data = [data]
    let res = await post(api, data)
    repBackMessageShow(that, res)
  }
})

const editDrawProps = {
  title: '',
  btnList: [提交部门编辑或者新增],
  data: {},
  queryItemTemplate: departmentManage.getByLabelArr(['部门', '职务', '办公地址'])
} as drawerProps;

const 编辑部门按钮 = btnMaker('编辑', btnActionTemplate.Function, {
  elType: 'primary',
  function: async (that, data) => {
    openDrawerFormEasy(that, {
      queryItemTemplate: departmentManage.getByKeyArr(['name', 'jobName', 'officeAddress']),
      data,
      title: '编辑部门'
    })
  }
}, ['/web/usc/unit/updateUser'], '编辑用户和部门绑定关系的按钮')
const 新增部门按钮 = btnMaker('新增', btnActionTemplate.Function, {
  elType: 'primary',
  function: async (that, data) => {
    console.log(that, data, 'qwe')
    openDrawerFormEasy(that, {
      ...editDrawProps, title: '新增绑定部门', data: {
        uid: that.query.uids[0]
      },
    })
  }
}, ['/web/usc/unit/insertUserBatch'], '新增用户和部门绑定关系的按钮')



departmentManage.push(
  tableCellTemplateMaker(
    "操作",
    "actionBtnList",
    actionCell([删除部门按钮, 编辑部门按钮], {
      fixed: "right",
      noDetail: true
    })
  )
)

// 部门管理按钮列表
const departmentManageBtnList = [新增部门按钮]


export const userInfoCardBtnList = [删除部门按钮, 新增部门按钮, 编辑部门按钮]



// 提交用户信息
const submitUserInfo = btnMaker("提交", btnActionTemplate.Function, {
  icon: "Position",
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
 * @name: userManage
 * @description: 用户管理界面
 * @authors: CZH
 * @Date: 2022-12-14 08:30:00
 */
export const userInfoCard = async (userInfo) => {
  if (!userInfo.id) ElMessage.error('用户id不存在')
  let res = await post('/web/usc/user/select', { id: userInfo.id })
  let num = 0;

  let userInfoWithExt = async () => {
    num++;
    if (num > 3) res = await post('/web/usc/user/select', { id: userInfo.id })
    return {
      ...res.data,
      ...JSON.parse(res.data.ext)
    }
  }
  const userTemplate = [...userTableCellStorage.getByKeyArr([
    "name",
    "icon",
    "mobile"
  ]),
  ... await (await userFieldStorage()).getAll()
  ]

  /**
  * @name: 打开编辑弹窗p-=
  * @description: waitForWriting
  * @authors: CZH
  * @Date: 2022-12-09 17:50:58
  */
  const editUserModel = btnMaker("编辑", btnActionTemplate.Function, {
    function: async (that, data) => {
      let drawerProps = {
        title: "用户编辑",
        queryItemTemplate: userTemplate,
        btnList: [
          submitUserInfo
        ],
        data: {
          ...(JSON.parse(data.ext)),
          ...data,
        }
      };
      that.$modules
        .getModuleApi()
      ["userManage_openDrawerForm"](that, drawerProps);
    },
    elType: 'primary',
    icon: "Setting",
  });
  return [
    gridCellMaker(
      "userInfo",
      "用户信息卡片",
      {},
      {
        name: "userManage_userInfoCard",
        type: cardComponentType.componentList,
      },
      {
        props: {
          showTemplate: userTemplate,
          userInfo: userInfoWithExt,
          btnList: [editUserModel]
        },
        isSettingTool: false,
      }
    )
      .setPosition(0, 0)
      .setSize(4, 2),
    gridCellMaker(
      "userInfo1",
      "用户信息卡片",
      {},
      {
        name: "userManage_userInfoCard",
        type: cardComponentType.componentList,
      },
      {
        props: {
          showTemplate: userTemplate,
          userInfo: userInfoWithExt,
          btnList: [editUserModel]
        },
        isSettingTool: false,
      }
    )
      .setPosition(4, 0)
      .setSize(2, 1),
    gridCellMaker(
      'departmentBindManager', "角色部门管理列表", {}, {
      name: 'userManage_searchTable',
      type: cardComponentType.componentList
    }, {
      props: {
        showItemTemplate: departmentManage.getAll(),
        autoSearch: true,
        defaultQuery: { uids: [userInfo.id] },
        searchFunc: async (query: stringAnyObj, that: stringAnyObj) => {
          num++;
          if (num > 3) res = await post('/web/usc/user/select', { id: userInfo.id })
          return res.data.units.map(x => {
            return {
              ...x,
              id: x.extInfo.id,
              jobName: x.extInfo.jobName,
              officeAddress: x.extInfo.officeAddress,
              uids: [userInfo.id]
            }
          })
        },
        btnList: departmentManageBtnList,
      },
      isSettingTool: false,
    }).setSize(6, 4).setPosition(0, 2),

    gridCellMaker(
      'roleBindManager', "角色权限管理列表", {}, {
      name: 'userManage_searchTable',
      type: cardComponentType.componentList
    }, {
      props: {
        showItemTemplate: roleManage,
        autoSearch: true,
        defaultQuery: { uids: [userInfo.id] },
        searchFunc: async (query: stringAnyObj, that: stringAnyObj) => {
          num++;
          if (num > 3) res = await post('/web/usc/user/select', { id: userInfo.id })
          return res.data.roles.map(x => {
            return {
              ...x,
              roleId: x.id,
              uids: [userInfo.id]
            }
          })
        },
        btnList: roleBindBtnList
      },
      isSettingTool: false,
    }).setSize(6, 4).setPosition(0, 6)
  ] as gridCellTemplate[];
};