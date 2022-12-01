/*
 * @Date: 2022-04-28 22:29:05
 * @LastEditors: CZH
 * @LastEditTime: 2022-12-01 16:40:24
 * @FilePath: /configforpagedemo/src/modules/userManage/PageConfigData/menuManage.ts
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
  DataCell,
  tableCellTemplate,
  searchCell,
  formInputType,
  stringAnyObj,
  showCell,
  showType,
  actionCell,
} from "@/modules/userManage/component/searchTable/searchTable";
import {
  btnMaker,
  btnActionTemplate,
} from "@/modules/userManage/component/searchTable/drawerForm";
import { bounds } from "@ctrl/tinycolor";

export const menuManage = async () => {
  // 页面配置数据
  const pageConfigDataTableCellStorage = new SearchCellStorage([
    tableCellTemplateMaker("id", "id", showCell(showType.dataKey)),
    tableCellTemplateMaker("父级ID", "parentId"),
    tableCellTemplateMaker("名称", "name", searchCell(formInputType.input)),
    tableCellTemplateMaker("图标", "icon"),
    tableCellTemplateMaker(
      "类型",
      "type",
      searchCell(formInputType.select, {
        inputOptions: {
          1: "模块",
          2: "目录",
          3: "菜单",
          4: "按钮",
        },
      })
    ),
    tableCellTemplateMaker(
      "URL",
      "urls",
      searchCell(formInputType.inputList, {
        inputOptions: {
          1: "模块",
          2: "目录",
          3: "菜单",
          4: "按钮",
        },
      })
    ),
    tableCellTemplateMaker(
      "作为菜单展示",
      "showLink",
      searchCell(formInputType.radio)
    ),
    tableCellTemplateMaker("页面配置", "pageConfigId"),
    tableCellTemplateMaker("配置参数", "meta"),
    tableCellTemplateMaker(
      "子节点",
      "children",
      showCell(showType.func, {
        showFunc: (data: stringAnyObj, key: string) =>
          data && data[key] && data[key].length > 0
            ? data[key]
                .map((x) => {
                  return "【" + x.name + "】";
                })
                .join(" ")
            : "",
      })
    ),
    tableCellTemplateMaker(
      "操作",
      "actionaction",
      actionCell([btnMaker("删除", btnActionTemplate.Function, {})])
    ),
  ]);

  const SearchTemplate = pageConfigDataTableCellStorage.getByKeyArr([
    "name",
    "showLink",
  ]);

  const btnList = [
    btnMaker("新增菜单", btnActionTemplate.OpenDrawer, {
      icon: "plus",
      elType: "primary",
      drawerProps: {
        title: "新增",
        schema: {
          required: ["type", "name", "showLink"],
        },
        queryItemTemplate: [
          pageConfigDataTableCellStorage.getByKey(
            "parentId",
            searchCell(formInputType.select, {
              funcInputOptionsLoader: async () => {
                function getAllChildren(node) {
                  let list = [node];
                  if (node.children && node.children.length > 0)
                    node.children.map((child) => {
                      list = list.concat(getAllChildren(child));
                    });
                  list
                    .map((x) => {
                      delete x.children;
                      return x.type < 4 ? x : null;
                    })
                    .filter(Boolean);
                  return list;
                }
                let back = {};
                let res = await post("/web/usc/menu/list", {});
                let list = [];
                if (res.data) {
                  res.data.map((x) => {
                    list = list.concat(getAllChildren(x));
                  });
                }
                console.log(list, "asdasd");
                list.map((x) => {
                  back[x.id] = x.name;
                });
                return back;
              },
            })
          ),
          ...pageConfigDataTableCellStorage.getByKeyArr([
            "type",
            "name",
            "icon",
            "urls",
            "showLink",
            "pageConfigId",
            "meta",
          ]),
        ],
        btnList: [
          btnMaker("提交", btnActionTemplate.Function, {
            function: async (that) => {
              const { formData } = that;
              console.log(formData, "asdasda");
              let res = await post("/web/usc/menu/insert", formData);
              if (res["message"] == "成功") {
                that.$message.success(res["message"]);
                setTimeout(()=>{
                  close
                },1000)
              } else {
                that.$message.danger(res["message"]);
              }
            },
          }),
        ],
        data: {
          showLink: true,
        },
      },
    }),
  ];

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
          searchItemTemplate: SearchTemplate,
          showItemTemplate: pageConfigDataTableCellStorage.getAll(),
          searchFunc: async (query: stringAnyObj) => {
            if (!query) query = {};
            let res = await post("/web/usc/menu/list", { ...query });
            if (!res.data) {
              res.data = [];
            }
            return res.data.map((x) => {
              return {
                ...x,
              };
            });
          },
          searchKeyWithBaseData: ["outputKey"],
          defaultQuery: {
            showLink: true,
          },
          btnList,
        },
        autoSearch: true,
        isSettingTool: false,
      }
    )
      .setPosition(0, 0)
      .setSize(12, 8),
  ] as gridCellTemplate[];
};
