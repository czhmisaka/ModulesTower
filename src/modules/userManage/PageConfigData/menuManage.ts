/*
 *                                                     __----~~~~~~~~~~~------___
 *                                    .  .   ~~//====......          __--~ ~~
 *                    -.            \_|//     |||\\  ~~~~~~::::... /~
 *                 ___-==_       _-~o~  \/    |||  \\            _/~~-
 *         __---~~~.==~||\=_    -_--~/_-~|-   |\\   \\        _/~
 *     _-~~     .=~    |  \\-_    '-~7  /-   /  ||    \      /
 *   .~       .~       |   \\ -_    /  /-   /   ||      \   /
 *  /  ____  /         |     \\ ~-_/  /|- _/   .||       \ /
 *  |~~    ~~|--~~~~--_ \     ~==-/   | \~--===~~        .\
 *           '         ~-|      /|    |-~\~~       __--~~
 *                       |-~~-_/ |    |   ~\_   _-~            /\
 *                            /  \     \__   \/~                \__
 *                        _--~ _/ | .-~~____--~-/                  ~~==.
 *                       ((->/~   '.|||' -_|    ~~-/ ,              . _||
 *                                  -_     ~\      ~~---l__i__i__i--~~_/
 *                                  _-~-__   ~)  \--______________--~~
 *                                //.-~~~-~_--~- |-------~~~~~~~~
 *                                       //.-~~~--\
 *                       ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *
 *                               神兽保佑            永无BUG
 */

/*
 * @Date: 2022-04-28 22:29:05
 * @LastEditors: CZH
 * @LastEditTime: 2022-12-14 17:02:09
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
import * as Icons from '@element-plus/icons-vue'

console.log(Icons,'asd')

import { bounds } from "@ctrl/tinycolor";
import { btnMaker } from "../component/searchTable/drawerForm";
import {
  SearchCellStorage,
  tableCellTemplateMaker,
  showCell,
  searchCell,
  actionCell,
} from "@/modules/userManage/component/searchTable/searchTable";
import {
  showType,
  formInputType,
  stringAnyObj,
  btnActionTemplate,
  drawerProps,
} from "@/modules/userManage/types";
import { ElMessage, ElMessageBox } from "element-plus";
import { refreshDesktop } from "@/components/basicComponents/grid/module/cardApi";

export const menuManage = async () => {
  const typeToModule = {
    1: "模块",
    2: "目录",
    3: "菜单",
    4: "按钮",
  };

  const submit = btnMaker("提交", btnActionTemplate.Function, {
    function: async (that, data) => {
      let res = await post(
        `/web/usc/menu/${data.id ? "update" : "insert"}`,
        data
      );
      if (res["message"] == "成功") {
        that.$message.success(res["message"]);
        setTimeout(() => {
          that.close();
        }, 500);
      } else {
        that.$message.danger(res["message"]);
      }
    },
  });

  const deleteBtn = btnMaker("删除", btnActionTemplate.Function, {
    icon: "Delete",
    elType: "danger",
    isShow: (data) => !data.children || data.children.length == 0,
    function: async (that, data) => {
      if (data.children && data.children.length > 0)
        return ElMessage.warning("【无法删除】：存在子节点");
      ElMessageBox({
        title: "确认删除【" + data.name + "】吗？",
        type: "warning",
        callback: async (action) => {
          if (action == "confirm") {
            let res = await post("/web/usc/menu/delete", {
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
  });

  // 页面配置数据
  const pageConfigDataTableCellStorage = new SearchCellStorage([
    tableCellTemplateMaker("id", "id", showCell(showType.dataKey)),
    tableCellTemplateMaker("父级ID", "parentId"),
    tableCellTemplateMaker("名称", "name", {
      ...searchCell(formInputType.input),
      ...showCell(showType.dataKey, {
        width: "300px",
      }),
    }),
    tableCellTemplateMaker("图标", "icon"),
    tableCellTemplateMaker("类型", "type", {
      ...showCell(showType.func, {
        showFunc: (data, key) => typeToModule[data[key]],
      }),
      ...searchCell(formInputType.select, {
        inputOptions: typeToModule,
      }),
    }),
    tableCellTemplateMaker(
      "URL",
      "urls",
      searchCell(formInputType.inputList, {
        inputOptions: {},
        propertiesOption: {
          "ui:options": {
            placeholder: "选择或者输入自定义URL",
          },
        },
      })
    ),
    tableCellTemplateMaker(
      "路由",
      "urls",
      searchCell(formInputType.searchList, {
        funcInputOptionsLoader: async (that) => {
          let attr = {};
          return attr;
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
  ]);

  const disableType = pageConfigDataTableCellStorage.getByKey(
    "type",
    searchCell(formInputType.select, {
      inputOptions: typeToModule,
      propertiesOption: {
        "ui:options": {
          disabled: true,
        },
      },
    })
  );

  pageConfigDataTableCellStorage.push(
    tableCellTemplateMaker(
      "操作",
      "actionaction",
      actionCell(
        [
          deleteBtn,
          btnMaker("新增", btnActionTemplate.Function, {
            icon: "Plus",
            elType: "primary",
            isShow: (data) => {
              return data.type != 4;
            },
            function: async (that, data) => {
              let propsArr = ["name", "icon", "urls", "pageConfigId", "meta"];
              if (data.type < 3) propsArr.push("showLink");
              let drawerProps = {
                title: `新增${typeToModule[data.type + 1]}`,
                schema: { required: ["type", "name", "showLink"] },
                queryItemTemplate: [
                  disableType,
                  ...pageConfigDataTableCellStorage.getByKeyArr(propsArr),
                ],
                data: {
                  parentId: data.id,
                  type: data.type + 1 + "",
                  showLink: true,
                },
                btnList: [submit],
              } as drawerProps;
              that.$modules
                .getModuleApi()
                ["userManage_openDrawerForm"](that, drawerProps);
            },
          }),
          btnMaker("编辑", btnActionTemplate.Function, {
            icon: "Edit",
            elType: "success",
            function: async (that, data) => {
              let propsArr = [
                "name",
                "icon",
                "urls",
                "pageConfigId",
                "meta",
                "showLink",
              ];
              let drawerProps = {
                title: `新增${typeToModule[data.type + 1]}`,
                schema: { required: ["type", "name", "showLink"] },
                queryItemTemplate: [
                  disableType,
                  ...pageConfigDataTableCellStorage.getByKeyArr(propsArr),
                ],
                data: {
                  ...data,
                  type: data.type + "",
                },
                btnList: [submit],
              } as drawerProps;
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
        btnList: [submit],
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
          showItemTemplate: pageConfigDataTableCellStorage.getAll([
            "id",
            "parentId",
          ]),
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
          defaultQuery: {
            showLink: true,
          },
          btnList,
          autoSearch: true,
        },
        isSettingTool: false,
      }
    )
      .setPosition(0, 0)
      .setSize(12, 8),
  ] as gridCellTemplate[];
};
