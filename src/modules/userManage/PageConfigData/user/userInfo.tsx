/*
 * @Date: 2022-04-28 22:29:05
 * @LastEditors: CZH
 * @LastEditTime: 2023-02-13 19:48:03
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
} from "@/modules/userManage/component/searchTable/searchTable";
import {
  btnActionTemplate,
  stringAnyObj,
  formInputType,
  drawerProps,
} from "@/modules/userManage/types";
import { ElMessage, ElMessageBox } from "element-plus";
import { setSize } from '@/components/basicComponents/grid/module/util';
import { dobuleCheckBtnMaker } from '../../component/searchTable/drawerForm';
import { repBackMessageShow } from '@/modules/userManage/component/searchTable/drawerForm';
import { tableCellOptions } from '../../types';
import { openDrawerFormEasy } from '../../component/searchTable/drawerForm';

// 性别
const gender = {
  1: "男",
  2: "女",
};

const userTableCellStorage = new SearchCellStorage([
  tableCellTemplateMaker("姓名", "name"),
  tableCellTemplateMaker("性别", "gender", staticSelectCell(gender)),
  tableCellTemplateMaker("icon", "icon"),
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
  tableCellTemplateMaker(
    "部门",
    "unitIds",
    searchCell(formInputType.treeSelectRemote, {
      funcInputOptionsLoader: async (that) => {
        let attr = {
          props: {
            label: "name",
            isLeaf: "isLeaf",
          },
          nodeKey: "id",
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
    })
  ),
  tableCellTemplateMaker("部门信息", "unitNames"),
  tableCellTemplateMaker("职务", "jobName"),
  tableCellTemplateMaker("排序", "orderNumber"),
]);




// 角色管理
const roleManage = [
  tableCellTemplateMaker('角色', 'name'),
  tableCellTemplateMaker('描述', 'description'),
]
// 用户角色按钮列表
const roleBindBtnList = []

// 部门管理列表
let departmentManage = new SearchCellStorage([
  tableCellTemplateMaker('部门', 'unitId',),
  tableCellTemplateMaker('职务', 'jobName', remoteDictSelectSearchCell('sys_user_job')),
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
    let res = await post(api, data)
    repBackMessageShow(that, res)
  }
})

const editDrawProps = {
  title: '',
  schema: {
    required: []
  },
  btnList: [提交部门编辑或者新增],
  data: {},
  queryItemTemplate: departmentManage.getByLabelArr(['部门', '职务', '办公地址'])
} as drawerProps;
console.log(editDrawProps.queryItemTemplate, JSON.parse(JSON.stringify(departmentManage.getAll())), 'asd')

const 编辑部门按钮 = btnMaker('编辑', btnActionTemplate.Function, {
  elType: 'primary',
  function: async (that, data) => {
    openDrawerFormEasy(that, {
      ...editDrawProps, data
    })
  }
}, ['/web/usc/unit/updateUser'], '编辑用户和部门绑定关系的按钮')
const 新增部门按钮 = btnMaker('新增', btnActionTemplate.OpenDrawer, {
  elType: 'primary',
  drawerProps: editDrawProps
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
/**
 * @name: userManage
 * @description: 用户管理界面
 * @authors: CZH
 * @Date: 2022-12-14 08:30:00
 */
export const userInfoCard = async (userInfo) => {
  if (!userInfo.id) ElMessage.error('用户id不存在')
  let res = await post('/web/usc/user/select', { id: userInfo.id })
  let num = 0
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
          userInfo
        },
        isSettingTool: false,
      }
    )
      .setPosition(0, 0)
      .setSize(12, 4),
    gridCellMaker(
      'departmentBindManager', "角色部门管理列表", {}, {
      name: 'userManage_searchTable',
      type: cardComponentType.componentList
    }, {
      props: {
        showItemTemplate: departmentManage.getAll(),
        autoSearch: true,
        searchFunc: async (query: stringAnyObj, that: stringAnyObj) => {
          num++;
          if (num > 2) res = await post('/web/usc/user/select', { id: userInfo.id })
          return res.data.units.map(x => {
            return {
              ...x,
              unitId: x.extInfo.id,
              jobName: x.extInfo.jobName,
              officeAddress: x.extInfo.officeAddress,
              uids: [res.data.id]
            }
          })
        },
        btnList: departmentManageBtnList,
      },
      isSettingTool: false,
    }).setSize(12, 5).setPosition(0, 4),

    gridCellMaker(
      'roleBindManager', "角色权限管理列表", {}, {
      name: 'userManage_searchTable',
      type: cardComponentType.componentList
    }, {
      props: {
        showItemTemplate: roleManage,
        autoSearch: true,
        searchFunc: async (query: stringAnyObj, that: stringAnyObj) => {
          num++;
          if (num > 2) res = await post('/web/usc/user/select', { id: userInfo.id })
          return res.data.roles
        },
        btnList: roleBindBtnList
      },
      isSettingTool: false,
    }).setSize(12, 5).setPosition(0, 9)
  ] as gridCellTemplate[];
};