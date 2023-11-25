/*
 * @Date: 2022-04-28 22:29:05
 * @LastEditors: CZH
 * @LastEditTime: 2023-07-27 16:18:21
 * @FilePath: /lcdp_fe_setup/src/modules/userManage/PageConfigData/workteam.tsx
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
  showCell,
  remoteDictSelectSearchCell,
} from "@/modules/userManage/component/searchTable/searchTable";
import {
  btnActionTemplate,
  stringAnyObj,
  formInputType,
  drawerProps,
  showType
} from "@/modules/userManage/types";
import { ElMessage, ElMessageBox } from "element-plus";
import { userInfoCard } from '@/modules/userManage/PageConfigData/user/userInfo';
import { openDrawerFormEasy } from '../component/searchTable/drawerForm';

// import { departmentDrawerprops, 新增部门 } from './departmenet'
import { userFieldStorage } from "./user/userValueManage";
import { repBackMessageShow } from '@/modules/userManage/component/searchTable/drawerForm';
import { tableCellTemplate } from '../types';

// 性别
const gender = {
  1: "男",
  2: "女",
};
// 用户数据
export const userTableCellStorage = new SearchCellStorage([
  tableCellTemplateMaker("姓名", "userName"),
  tableCellTemplateMaker("手机号", "mobile"),
  tableCellTemplateMaker("角色", "rule"),
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
                isLeaf: x.children ? false : true,
                value: x.id + '',
              };
            })
          );
        };
        return attr;
      },
    })
  ),
  tableCellTemplateMaker('部门信息', 'belongUnitNames'),
  tableCellTemplateMaker('职务', 'roleTypeName'),
  tableCellTemplateMaker("排序", "orderNumber"),
]);
// 工作组数据
export const workteamListCellStorage = new SearchCellStorage([
  tableCellTemplateMaker("名称", "name", {
    schema: {
      required: ["name"],
    },
  }),
  tableCellTemplateMaker("上级工作组", "parentId", searchCell(formInputType.treeSelect, {
    funcInputOptionsLoader: async (that) => {
      let attr = {
        props: {
          label: "name",
          isLeaf: "isLeaf",
        },
        showCheckbox: false,
        multiple: false,
        type: 'number',
        nodeKey: "id",
      };
      let res = await post("/web/usc/work/group/list", {});
      function mapp(res) {
        res["value"] = res.id + '';
        if (res.children && res.children.length > 0)
          res.children.map((x) => {
            return mapp(x);
          });
        return res;
      }
      let resData = res.data.map((x) => {
        return mapp(x);
      });
      return {
        ...attr,
        data: resData,
      };

      // attr["load"] = async (node, resolve) => {
      //   let res = await post("/web/usc/work/group/list", {
      //     parentId: node.data.id,
      //   });
      //   return resolve(
      //     res.data.map((x) => {
      //       return {
      //         ...x,
      //         isLeaf: !x.children,
      //         value: (x.id + ''),
      //       };
      //     })
      //   );
      // // };
      // return attr;
    },
    ...showCell(showType.func, {
      showFunc: (data, key) => {
        console.log(data, 'datakey')
        return 'eeee'
      },
    }),
  })),

])
// 搜索内容
const searchTable = new SearchCellStorage([
  ...userTableCellStorage.getByKeyArr(["name", "mobile"]),
  // tableCellTemplateMaker(
  //   "搜索子部门",
  //   "searchChildrenFlag",
  //   searchCell(formInputType.select, {
  //     inputOptions: {
  //       "true": "包含下级部门",
  //       "false": "仅搜索本部门"
  //     }
  //   })
  // ),
  tableCellTemplateMaker(
    "部门",
    "unitId",
    searchCell(formInputType.searchList, {
      funcInputOptionsLoader: async (that) => {
        let attr = {
          multiple: false,
          type: 'string'
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
        type: 'string'
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
// 提交用户信息
const submitWorkInfo = btnMaker("提交", btnActionTemplate.Function, {
  function: async (that, data) => {
    let ext = {}
    let queryItemTemplate = (await userFieldStorage()).getAll()
    queryItemTemplate.map((cell: tableCellTemplate) => {
      ext[cell.key] = data[cell.key]
    })
    let res = await post(
      "/web/usc/work/group/edit",
      {
        ...data,
        ext: JSON.stringify(ext)
      }
    );
    repBackMessageShow(that, res)
  },
  premission: [
    '/web/usc/work/group/edit',
  ],
})
const 编辑工作组 = btnMaker(
  "编辑",
  btnActionTemplate.Function,
  {
    icon: "Edit",
    elType: "primary",
    function: async (that, data) => {
      data.parentId = data.parentId == 0 ? null : data.parentId;
      let drawerProps = {
        title: `编辑工作组`,
        schema: { required: ["name"] },
        queryItemTemplate: workteamListCellStorage.getByKeyArr([
          "name",
          "parentId",
        ]),
        data,
        btnList: [submitWorkInfo],
      };
      that.$modules
        .getModuleApi()
      ["userManage_openDrawerForm"](that, drawerProps);
    },
  },
  ["/web/usc/unit/update"],
  "编辑工作组按钮"
);
const 删除工作组 = btnMaker('删除', btnActionTemplate.Function, {
  elType: 'danger',
  isShow: (data) => data.roleType != 1,
  function: async (that, data) => {
    const workteam = that.baseData.workteam
    console.log(data)
    ElMessageBox({
      title: "删除工作组",
      type: "warning",
      confirmButtonText: "确认删除",
      message: `即将删除工作组【${workteam.name}】`,
      callback: async (action) => {
        if (action == "confirm") {
          let res = await post("/web/usc/work/group/delete/" + workteam.id, {});
          if (res.message && res.message == "成功") ElMessage.success("成功");
          if (that.close) that.close();
          else refreshDesktop(that);
        }
      },
    });
  },
}, ["/web/usc/work/group/delete/"],
  "移除工作组成员")

export const 新增工作组 = btnMaker(
  "新增工作组",
  btnActionTemplate.Function,
  {
    elType: "primary",
    function: async (that, data) => {
      console.log(that.baseData, 'oooo')
      let drawerProps = {
        title: "新增工作组",
        schema: {
          required: ["name"],
        },
        queryItemTemplate: workteamListCellStorage.getByKeyArr([
          "name",
          "parentId",
        ]),
        btnList: [submitWorkInfo],
        data: {

        },
      };
      that.$modules
        .getModuleApi()
      ["userManage_openDrawerForm"](that, drawerProps);
    },
  },
  ["/web/usc/work/group/edit"],
  "新增工作组按钮"
);


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
        ...data
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
const addNewModel = btnMaker("添加成员", btnActionTemplate.Function, {
  function: async (that, data) => {
    let drawerProps = {
      title: "创建新用户",
      schema: {
        required: ["name", "mobile", "unitIds"],
      },
      queryItemTemplate: [...userTableCellStorage.getByKeyArr([
        "name",
        'mobile',
        "icon",
        'unitIds'
      ]),
      ... (await userFieldStorage()).getAll()
      ],
      btnList: [
        submitUserInfo
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
}, ["/web/usc/user/insert"], "创建新用户");




/**
 * @name: roleBindBtn
 * @description: 角色绑定权限按钮
 * @authors: CZH
 * @Date: 2022-12-13 11:13:51
 */


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
          label: '新增工作组'
        }),
        tableCellTemplateMaker('', 'checkBtn', searchCell(formInputType.botton, {
          funcInputOptionsLoader: async (that) => {
            let attr = {
              buttonName: '新增工作组',
              callBack: async (data) => {
                console.log(data, ';return')
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
}, ["/web/usc/unit/deleteUser", "/web/usc/unit/insertUserBatch"], "'删除部门',");





/**
 * @name: workteamManage
 * @description: 基于部门的用户管理
 * @authors: ljh
 * @Date: 2022-12-14 11:14:32
 */
export const workteamManage = async () => {
  // 批量删除按钮
  const selectedDeleteBtn = btnMaker("批量删除", btnActionTemplate.Function, {
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
  }, ["/web/usc/unit/deleteUser"],
    "批量删除成员按钮"
  );

  const btnList = [addNewModel, selectedDeleteBtn];

  const 设为组长 = btnMaker('设为组长', btnActionTemplate.Function, {
    elType: 'primary',
    isShow: (data) => data.roleType != 1,
    function: async (that, data) => {
      const workteam = that.baseData.workteam
      console.log(data)
      ElMessageBox({
        title: "设置组长",
        type: "warning",
        confirmButtonText: "确认设置",
        message: `即将设置【${workteam.name}】下的成员：${data.userName}为组长`,
        callback: async (action) => {
          if (action == "confirm") {
            let res = await post("/web/usc/work/group/setLeader/" + workteam.id, {});
            if (res.message && res.message == "成功") ElMessage.success("成功");
            if (that.close) that.close();
            else refreshDesktop(that);
          }
        },
      });
    },
  }, ["/web/usc/work/group/setLeader"],
    "设为组长")
  const 移除成员 = btnMaker('移除', btnActionTemplate.Function, {
    elType: 'primary',
    isShow: (data) => data.roleType != 1,
    function: async (that, data) => {
      const workteam = that.baseData.workteam
      console.log(data)
      ElMessageBox({
        title: "移除工作组成员",
        type: "warning",
        confirmButtonText: "确认移除",
        message: `即将移除工作组【${workteam.name}】下的成员：${data.userName}`,
        callback: async (action) => {
          if (action == "confirm") {
            let res = await post("/web/usc/work/group/relation/delete/" + workteam.id, {});
            if (res.message && res.message == "成功") ElMessage.success("成功");
            if (that.close) that.close();
            else refreshDesktop(that);
          }
        },
      });
    },
  }, ["/web/usc/work/group/relation/delete"],
    "移除工作组成员")

  const tableAction = tableCellTemplateMaker(
    "操作",
    "actionBtnList",
    actionCell([设为组长, 移除成员], {
      fixed: "right",
      noDetail: true
    })
  );
  const workteamDetailModel = {
    title: "工作组详情",
    queryItemTemplate: workteamListCellStorage.getByLabelArr([
      "名称",
    ]),
    btnList: [编辑工作组, 删除工作组],
    noEdit: true,
  };
  return [
    // children需要调接口获得
    // gridCellMaker(
    //   "MenuList",
    //   "菜单列表分层获取",
    //   {},
    //   {
    //     name: "userManage_menuListRemote",
    //     type: cardComponentType.componentList,
    //   },
    //   {
    //     props: {
    //       treeDataFuncByLevel: async (node, resolve,searchData) => {
    //         // console.log(node,'ppp')
    //         // const list = node.data;
    //         const id = node.data?node.data.id:''
    //         let res = await post("/web/usc/work/group/list", {
    //           name: searchData||'',
    //           parentId: id,
    //         });
    //         let data = res.data.map((x) => {
    //           return {
    //             ...x,
    //             isLeaf: x.children?false:true,
    //             value: x.id,
    //             name: x.name+(x.userNumber>0?'('+x.userNumber+')':'')
    //           };
    //         });
    //         resolve(data);
    //       },
    //       clickItemDetailFunc: (that, data,type) => {
    //         if(type=='user'){

    //         }else {
    //           // departmentDrawerprops(that, data)
    //         }

    //       },
    //       searchBtn: 新增工作组,
    //       outputKey: "workteam",
    //       defaultProps: {
    //         label: "name",
    //         children: "children",
    //         isLeaf: "isLeaf",
    //       },
    //     },
    //     isSettingTool: false,
    //   }
    // )
    //   .setPosition(0, 0)
    //   .setSize(4, 8),  
    // 工作组列表  
    gridCellMaker(
      "MenuList",
      "菜单列表分层获取",
      {},
      {
        name: "userManage_menuList",
        type: cardComponentType.componentList,
      },
      {
        props: {
          treeDataFunc: async (that, name = "") => {
            let reqdata = {};
            if (name != "") reqdata["name"] = name;
            let res = await post("/web/usc/work/group/list", reqdata);
            let data = res.data;
            data.forEach((x) => {
              if (Array.isArray(x.children)) {
                getSon(x.children)
              }
              x.isLeaf = x.children ? false : true,
                x.value = x.id,
                x.name = x.name,
                x.title = x.name + (x.userNumber > 0 ? '(' + x.userNumber + ')' : '')
            });
            function getSon(list) {
              // console.log(list,'x.children')
              // console.log(Array.isArray(list))
              if (Array.isArray(list)) {
                list.forEach((x) => {
                  if (Array.isArray(x.children)) {
                    console.log(x.children, 'ooo')
                    getSon(x.children)
                  }
                  x.isLeaf = x.children ? false : true,
                    x.value = x.id,
                    x.name = x.name,
                    x.title = x.name + (x.userNumber > 0 ? '(' + x.userNumber + ')' : '')
                })
              }

            }
            console.log(data, 'ppp')
            setData(that, { workteam: data });
            return data;
          },
          outputKey: "workteam",
          defaultProps: {
            label: "title",
            children: "children",
          },
          searchBtn: 新增工作组,
          clickItemDetailFunc: (that, data) => {
            that.$modules.getModuleApi()["userManage_openDrawerForm"](that, {
              ...workteamDetailModel,
              data,
            });
          },
        },
        isSettingTool: false,
      }
    )
      .setPosition(0, 0)
      .setSize(3, 8),
    // 用户列表
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
            '姓名', '部门信息', '职务'
          ]), tableAction],
          searchFunc: async (query: stringAnyObj, that: stringAnyObj) => {
            console.log(that.baseData, 'oooo')
            if (!that.baseData?.workteam?.id) {
              return;
            }
            let res = await post("/web/usc/work/group/page/user", {
              ...query,
              workGroupId: that.baseData?.workteam?.id,
            });
            if (!res.data["list"]) res.data["list"] = [];
            if (!res.data["data"]) res.data["data"] = res.data["list"];
            return res.data;
          },
          autoSearch: false,
          searchKeyWithBaseData: ["workteam"],
          defaultQuery: {
            searchChildrenFlag: 'false'
          },
          btnList,
        },
        isSettingTool: false,
      }
    )
      .setPosition(3, 0)
      .setSize(8, 8),
  ] as gridCellTemplate[];
};

