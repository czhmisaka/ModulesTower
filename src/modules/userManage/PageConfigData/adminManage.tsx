/*
 * @Date: 2022-04-28 22:29:05
 * @LastEditors: CZH
 * @LastEditTime: 2023-02-01 11:13:12
 * @FilePath: /configforpagedemo/src/modules/userManage/PageConfigData/adminManage.tsx
 */

import {
  gridCellMaker,
  gridSizeMaker,
  cardComponentType,
  cardOnChangeType,
  gridCellTemplate,
} from "@/components/basicComponents/grid/module/dataTemplate";
import { post, get } from "@/utils/api/requests";
import {
  SearchCellStorage,
  tableCellTemplateMaker,
  searchCell,
  showCell,
  DateCell,
  actionCell
} from "@/modules/userManage/component/searchTable/searchTable";
import { btnActionTemplate, formInputType, showType, stringAnyObj } from "@/modules/userManage/types";
import { btnMaker, } from "../component/searchTable/drawerForm";
import { ElMessage, ElMessageBox } from "element-plus";
import { refreshDesktop } from "@/components/basicComponents/grid/module/cardApi";

export const adminManage = async () => {
  const 管理员判断参数 = {
    true: '是',
    false: '否'
  }

  // 管理员列表
  const 管理员列表 = new SearchCellStorage([
    tableCellTemplateMaker('用户名', 'name'),
    tableCellTemplateMaker('联系方式', 'mobile'),
    tableCellTemplateMaker('管理员', 'adminFlag', {
      ...searchCell(formInputType.select, {
        inputOptions: 管理员判断参数,
      }), ...showCell(showType.func, {
        showFunc: (data, key) => 管理员判断参数[data[key] + '']
      })
    }),
  ]);

  const 新增管理员 = btnMaker('提交', btnActionTemplate.Function, {
    icon: 'plus',
    elType: 'primary',
    function: async (that, data) => {
      if (!data.id) ElMessage.error('请选择用户')
      let res = await post('/web/usc/user/edit/admin', { id: data.id, adminFlag: true })
      if (res["message"] == "成功") {
        that.$message.success(res["message"]);
        setTimeout(() => {
          that.close();
        }, 500);
      } else {
        that.$message.danger(res["message"]);
      }
    }
  })

  const 新增管理员弹窗 = btnMaker('新增管理员', btnActionTemplate.OpenDrawer, {
    icon: 'plus',
    elType: 'primary',
    drawerProps: {
      title: '新增管理员',
      queryItemTemplate: [tableCellTemplateMaker('用户', 'id', searchCell(formInputType.searchList, {
        inputOptions: {
          multiple: false,
          remoteMethod: async (query) => {
            let res = await post('/web/usc/user/page/org', { name: query, pageSize: 20, pageNumber: 0 })
            return res.data.list.map(x => {
              return {
                value: x.id + '',
                label: x.name + '-' + x.unitNames
              }
            })
          }
        }
      }))],
      btnList: [新增管理员]
    }
  })

  const 取消管理员权限 = btnMaker('取消管理员权限',
    btnActionTemplate.Function, {
    icon: "delete",
    elType: "danger",
    function: async (that, data) => {
      ElMessageBox({
        type: "warning",
        title: `解除用户【${data.name}】的管理员权限吗`,
        callback: async (action) => {
          if (action == "confirm") {
            let res = await post("/web/usc/user/edit/admin", {
              id: data.id,
              adminFlag: false
            });
            if (res.message == "成功") {
              ElMessage.success(res.message);
              if (that.close) that.close();
              else refreshDesktop(that);
            } else ElMessage.error(res.message);
          }
        }
      })
    }
  })

  const 搜索区域操作栏 = [新增管理员弹窗];
  const 列表右侧操作栏 = tableCellTemplateMaker('操作', 'action', actionCell([取消管理员权限], {
    fixed: "right",
  }))

  管理员列表.push(列表右侧操作栏)

  return [
    gridCellMaker(
      "searchTable",
      "管理权限编辑",
      {},
      {
        name: "userManage_searchTable",
        type: cardComponentType.componentList,
      },
      {
        props: {
          defaultQuery: {},
          autoSearch: false,
          btnList: 搜索区域操作栏,
          showItemTemplate: 管理员列表.getAll(),
          searchFunc: async (query: stringAnyObj) => {
            let res = await post("/web/usc/user/page/admin", { ...query });
            return res && res.data ? res.data : [];
          },
        },
        isSettingTool: false,
      }
    )
      .setPosition(0, 0)
      .setSize(12, 8),
  ] as gridCellTemplate[];
};
