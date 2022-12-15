/*
 * @Date: 2022-04-28 22:29:05
 * @LastEditors: CZH
 * @LastEditTime: 2022-12-09 17:32:53
 * @FilePath: /configforpagedemo/src/modules/userManage/PageConfigData/departmenet.ts
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
import { post, get } from "@/utils/api/requests";
import {
  SearchCellStorage,
  tableCellTemplateMaker,
  DateCell,
  searchCell,
  actionCell,
  showCell,
} from "@/modules/userManage/component/searchTable/searchTable";
import {
  btnActionTemplate,
  formInputType,
  showType,
  stringAnyObj,
} from "@/modules/userManage/types";
import { btnMaker } from "@/modules/userManage/component/searchTable/drawerForm";
import { ElMessage, ElMessageBox } from "element-plus";
import { refreshDesktop } from "@/components/basicComponents/grid/module/cardApi";

export const department = async () => {
  const submit = btnMaker("提交", btnActionTemplate.Function, {
    icon: "Position",
    elType: "primary",
    function: async (that: stringAnyObj, data: stringAnyObj) => {
      let res = await post(
        "/web/usc/unit/" + (data.id ? "update" : "insert"),
        data
      );
      ElMessage[res.message == "成功" ? "success" : "error"](res.message);
      if (res.message == "成功" && that.close) that.close();
    },
  });

  // 部门数据
  const UnitTableCellStorage = new SearchCellStorage([
    tableCellTemplateMaker("ID", "id"),
    tableCellTemplateMaker("创建者ID", "createUserId"),
    tableCellTemplateMaker(
      "创建时间",
      "createTime",
      DateCell({
        width: "200px",
      })
    ),
    tableCellTemplateMaker("更新者", "updateUserId"),
    tableCellTemplateMaker(
      "更新时间",
      "updateTime",
      DateCell({
        width: "200px",
      })
    ),
    tableCellTemplateMaker("排序", "orderNumber"),
    tableCellTemplateMaker("是否置顶", "top"),
    tableCellTemplateMaker("删除", "deleted"),
    tableCellTemplateMaker(
      "部门名称",
      "name",
      showCell(showType.func, { fixed: "left", width: "200px" })
    ),
    tableCellTemplateMaker("简介", "description"),
    tableCellTemplateMaker(
      "上级部门ID",
      "parentId",
      searchCell(formInputType.select, {
        funcInputOptionsLoader: async (that) => {
          let data = {};
          let res = await post("/web/usc/unit/list", {});
          res.data.map((x) => {
            data[x.id] = x.name;
          });
          return data;
        },
      })
    ),
    tableCellTemplateMaker("所有上级部门ID", "parentIds"),
    tableCellTemplateMaker("上级部门", "parentNames"),
    tableCellTemplateMaker("所属行政区划ID", "regionId"),
    tableCellTemplateMaker("浙政钉Code", "zzdCode"),
  ]);

  const userTableSearchTemplate = [
    ...UnitTableCellStorage.getByKeyArr(["name"]),
  ];

  const btnList = [
    btnMaker("新增部门", btnActionTemplate.Function, {
      icon: "Plus",
      elType: "primary",
      function: async (that, data) => {
        let drawerProps = {
          title: "新增部门",
          schema: {
            required: ["name", "description"],
          },
          queryItemTemplate: UnitTableCellStorage.getByKeyArr([
            "name",
            "description",
          ]),
          btnList: [submit],
          data: {
            parentId: that.baseData?.unit?.id || "",
          },
        };
        that.$modules
          .getModuleApi()
          ["userManage_openDrawerForm"](that, drawerProps);
      },
    }),
  ];

  UnitTableCellStorage.push(
    tableCellTemplateMaker(
      "操作",
      "actionaction",
      actionCell(
        [
          btnMaker("新增部门", btnActionTemplate.Function, {
            icon: "Plus",
            elType: "primary",
            function: async (that, data) => {
              let drawerProps = {
                title: "新增部门",
                schema: {
                  required: ["name", "description"],
                },
                queryItemTemplate: UnitTableCellStorage.getByKeyArr([
                  "name",
                  "description",
                ]),
                btnList: [submit],
                data: {
                  parentId: data.id,
                },
              };
              that.$modules
                .getModuleApi()
                ["userManage_openDrawerForm"](that, drawerProps);
            },
          }),
          btnMaker("删除", btnActionTemplate.Function, {
            icon: "Delete",
            elType: "danger",
            function: async (that, data) => {
              if (data.children && data.children.length > 0)
                return ElMessage.warning("【无法删除】：存在子部门");
              ElMessageBox({
                title: "确认删除【" + data.name + "】吗？",
                type: "warning",
                callback: async (action) => {
                  if (action == "confirm") {
                    let res = await post("/web/usc/unit/delete", {
                      id: data.id,
                    });
                    if (res.message == "成功") {
                      ElMessage.success(res.message);
                      if (that.close) that.close();
                      else refreshDesktop(that);
                    } else ElMessage.error(res.message);
                  }
                },
              });
            },
          }),
          btnMaker("编辑", btnActionTemplate.Function, {
            icon: "Edit",
            elType: "primary",
            function: async (that, data) => {
              let drawerProps = {
                title: `编辑部门`,
                schema: { required: ["name"] },
                queryItemTemplate: UnitTableCellStorage.getByKeyArr([
                  "name",
                  "description",
                ]),
                data,
                btnList: [submit],
              };
              that.$modules
                .getModuleApi()
                ["userManage_openDrawerForm"](that, drawerProps);
            },
          }),
        ],
        {
          fixed: "right",
        }
      )
    )
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
          searchItemTemplate: userTableSearchTemplate,
          showItemTemplate: UnitTableCellStorage.getAll([
            "id",
            "createUserId",
            "updateUserId",
            "parentIds",
            "parentId",
            "regionId",
            "deleted",
          ]),
          searchFunc: async (query: stringAnyObj, that: stringAnyObj) => {
            if (!query) query = {};
            let res = await post("/web/usc/unit/list", {
              ...query,
              parentId: that.baseData?.unit?.id,
            });
            return res && res.data ? res.data : [];
          },
          searchKeyWithBaseData: ["unit"],
          btnList,
          autoSearch: false,
        },
        isSettingTool: false,
      }
    )
      .setPosition(3, 0)
      .setSize(9, 8),
  ] as gridCellTemplate[];
};
