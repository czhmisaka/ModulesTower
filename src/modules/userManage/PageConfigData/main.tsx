/*
 * @Date: 2022-04-28 22:29:05
 * @LastEditors: CZH
 * @LastEditTime: 2023-02-14 15:02:27
 * @FilePath: /configforpagedemo/src/modules/userManage/PageConfigData/main.tsx
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
} from "@/modules/userManage/component/searchTable/searchTable";
import {
  btnActionTemplate,
  stringAnyObj,
  formInputType,
  drawerProps,
} from "@/modules/userManage/types";
import { ElMessage, ElMessageBox } from "element-plus";
import { userInfoCard } from '@/modules/userManage/PageConfigData/user/userInfo';
import { openDrawerFormEasy } from '../component/searchTable/drawerForm';

import { departmentDrawerprops, 新增部门 } from './departmenet'

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
  tableCellTemplateMaker('部门信息', 'unitNames'),
  tableCellTemplateMaker('职务', 'jobName'),
  tableCellTemplateMaker("排序", "orderNumber"),
]);

const searchTable = new SearchCellStorage([
  ...userTableCellStorage.getByKeyArr(["name", "mobile", "roleId"]),
  tableCellTemplateMaker(
    "搜索子部门",
    "searchChildrenFlag",
    searchCell(formInputType.select, {
      inputOptions: {
        "true": "包含下级部门",
        "false": "仅搜索本部门"
      }
    })
  ),
  tableCellTemplateMaker(
    "部门",
    "unitId",
    searchCell(formInputType.searchList, {
      funcInputOptionsLoader: async (that) => {
        let attr = {
          multiple: false,
        };
        attr["remoteMethod"] = async (query) => {
          let res = await post("/web/usc/unit/list", {
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
    })
  ),
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
]);


/**
  * @name: 打开新增弹窗
  * @description: waitForWriting
  * @authors: CZH
  * @Date: 2022-12-09 17:50:58
  */
const addNewModel = btnMaker("新增", btnActionTemplate.Function, {
  function: async (that, data) => {
    let drawerProps = {
      title: "创建新用户",
      queryItemTemplate: userTableCellStorage.getByKeyArr([
        "name",
        "gender",
        "icon",
        "description",
        "mail",
        "mobile",
        "birthday",
        "idCard",
        "unitIds",
      ]),
      btnList: [
        btnMaker("提交", btnActionTemplate.Function, {
          icon: "Position",
          function: async (that, data) => {
            let res = await post(
              "/web/usc/user/" + (data.id ? "update" : "insert"),
              data
            );
            ElMessage[res.message == "成功" ? "success" : "error"](
              res.message
            );
            if (res.message == "成功" && that.close) that.close();
          },
          premission: [
            '/web/usc/user/update',
            '/web/usc/user/insert'
          ],
        }),
      ],
      data: {}
    };
    that.$modules
      .getModuleApi()
    ["userManage_openDrawerForm"](that, drawerProps);
  },
  premission: ["admin"],
  icon: "Plus",
  elType: "primary",
});

/**
  * @name: 打开编辑弹窗
  * @description: waitForWriting
  * @authors: CZH
  * @Date: 2022-12-09 17:50:58
  */
const editUserModel = btnMaker("编辑", btnActionTemplate.Function, {
  function: async (that, data) => {
    data.gender = data.gender + ''
    let drawerProps = {
      title: "用户编辑",
      queryItemTemplate: userTableCellStorage.getByKeyArr([
        "name",
        "gender",
        "icon",
        "description",
        "mail",
        "mobile",
        "birthday",
        "idCard",
      ]),
      btnList: [
        btnMaker("提交", btnActionTemplate.Function, {
          icon: "Position",
          function: async (that, data) => {
            let res = await post(
              "/web/usc/user/" + (data.id ? "update" : "insert"),
              data
            );
            ElMessage[res.message == "成功" ? "success" : "error"](
              res.message
            );
            if (res.message == "成功" && that.close) that.close();
          },
          premission: [
            '/web/usc/user/update',
            '/web/usc/user/insert'
          ],
        }),
      ],
      data
    };
    that.$modules
      .getModuleApi()
    ["userManage_openDrawerForm"](that, drawerProps);
  },
  icon: "Setting",
});

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
        tableCellTemplateMaker('', 'checkBtn', searchCell(formInputType.botton, {
          funcInputOptionsLoader: async (that) => {
            let attr = {
              buttonName: '新增角色',
              callBack: async (data) => {
                let res = await post('/web/usc/role/authUser', { roleId: data.roleId, uids: [data.id] })
                ElMessage[res.message == '成功' ? 'success' : 'err'](res.message)
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
});

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
        tableCellTemplateMaker('', 'checkBtn', searchCell(formInputType.botton, {
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
        }))
      ],
      data: { ...res.data },
      btnList: [closeBtn],
    };
    that.$modules
      .getModuleApi()
    ["userManage_openDrawerForm"](that, drawerProps);
  },
});





/**
 * @name: mainDesktop
 * @description: 基于部门的用户管理
 * @authors: CZH
 * @Date: 2022-12-14 11:14:32
 */
export const mainDesktop = async () => {
  // 批量删除按钮
  const selectedDeleteBtn = btnMaker("删除成员", btnActionTemplate.Function, {
    isShow: (data) => !data.searchChildrenFlag,
    function: async (that, data) => {
      if (!that.selectedList || that.selectedList.length == 0)
        return ElMessage.warning("未选中需要删除的用户");
      let userList = that.selectedList;
      let { unit } = that.baseData;
      ElMessageBox({
        title: "删除部门成员",
        type: "warning",
        confirmButtonText: "确认删除",
        message: `即将删除部门【${unit.name}】下的成员：${userList
          .map((x) => x.name)
          .join(" ")}`,
        callback: async (action) => {
          if (action == "confirm") {
            let res = await post("/web/usc/unit/deleteUser", {
              id: unit.id,
              uids: userList.map((x) => x.id),
            });
            if (res.message && res.message == "成功") ElMessage.success("成功");
            if (that.close) that.close();
            else refreshDesktop(that);
          }
        },
      });
    },
    icon: "Delete",
    elType: "danger",
  });

  const btnList = [addNewModel, selectedDeleteBtn];

  const 打开用户信息弹窗 = btnMaker('用户信息', btnActionTemplate.Function, {
    elType: 'primary',
    function: async (that, data) => {
      let drawProps = {
        title: '',
        size: 70,
        gridDesktop: true,
        gridDesktopConfig: {
          desktopData: async () => await userInfoCard(data),
          gridColNum: 12,
        },
      } as drawerProps
      openDrawerFormEasy(that, drawProps)
    }
  })

  const tableAction = tableCellTemplateMaker(
    "操作",
    "actionBtnList",
    //[unitBindBtn, roleBindBtn, editUserModel]
    actionCell([editUserModel, 打开用户信息弹窗], {
      fixed: "right",
      noDetail: true
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
          treeDataFuncByLevel: async (node, resolve) => {
            let res = await post("/web/usc/unit/list", {
              parentId: node.data.id,
            });
            let data = res.data.map((x) => {
              return {
                ...x,
                isLeaf: !x.hasLeaf,
                value: x.id,
              };
            });
            resolve(data);
          },
          clickItemDetailFunc: (that, data) => {
            departmentDrawerprops(that, data)
          },
          searchBtn: 新增部门,
          outputKey: "unit",
          defaultProps: {
            label: "name",
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
            '姓名', '手机号', '部门信息', '职务'
          ]), tableAction],
          searchFunc: async (query: stringAnyObj, that: stringAnyObj) => {
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
          btnList,
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
            let res = await post("/web/usc/user/page/org", {
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
