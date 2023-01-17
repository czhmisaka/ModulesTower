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
import * as Icons from "@element-plus/icons-vue";
import { ElIcon } from "element-plus";

import { btnMaker } from "@/modules/userManage/component/searchTable/drawerForm";
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
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { h } from "vue";
import { getIcon } from "@/utils";

const typeToModule = {
  1: "模块",
  2: "目录",
  3: "菜单",
  4: "按钮",
};

const submit = btnMaker("提交", btnActionTemplate.Function, {
  function: async (that, query) => {
    let data = {
      ...query,
      urls: typeof query.urls == "string" ? [query.urls] : query.urls,
    } as stringAnyObj;
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

const showLinkOptions = {
  true: "是",
  false: "否",
};

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

let iconMap = {};
for (let x in Icons) {
  iconMap["EL_" + x] = x;
}

// 页面配置数据
const pageConfigDataTableCellStorage = new SearchCellStorage([
  tableCellTemplateMaker("id", "id", showCell(showType.dataKey)),
  tableCellTemplateMaker(
    "上级",
    "parentName",
    searchCell(formInputType.input, {
      propertiesOption: {
        "ui:options": {
          disabled: true,
        },
      },
    })
  ),
  tableCellTemplateMaker("名称", "name", {
    ...searchCell(formInputType.input),
    ...showCell(showType.dataKey, {
      width: "300px",
    }),
  }),
  tableCellTemplateMaker("图标", "icon", {
    ...searchCell(formInputType.select, {
      inputOptions: iconMap,
    }),
    ...showCell(showType.funcComponent, {
      style: {
        paddingLeft: "4px",
      },
      showFunc: (data, key) => {
        if (data[key] && data[key].indexOf("EL_") == 0)
          return useRenderIcon(data[key]);
      },
    }),
  }),
  tableCellTemplateMaker("排序", "orderNumber", {
    ...searchCell(formInputType.number, {
      propertiesOption: {
        "ui:options": {
          min: 0,
        },
      },
    }),
    ...showCell(showType.dataKey),
  }),
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
    searchCell(formInputType.searchList, {
      funcInputOptionsLoader: async (that) => {
        const routes = await that.$modules.getAllPageRouter();
        let attr = {
          multiple: false,
          remoteMethod: async (data) => {
            return routes.map((x) => {
              return {
                ...x,
                value: x.path,
                label: x.name,
              };
            });
          },
        };
        return attr;
      },
    })
  ),
  tableCellTemplateMaker(
    "接口",
    "urls",
    searchCell(formInputType.searchList, {
      funcInputOptionsLoader: async (that) => {
        let attr = {
          multiple: true,
          remoteMethod: async (data) => {
            let res = await post("/web/usc/url/listAll", {});
            return res.data.map((x) => {
              return {
                ...x,
                value: x.url,
                label: `${x.tags}-${x.description}`,
              };
            });
          },
        };
        return attr;
      },
    })
  ),
  tableCellTemplateMaker("作为菜单展示", "showLink", {
    ...searchCell(formInputType.select, {
      inputOptions: showLinkOptions,
    }),
    ...showCell(showType.func, {
      showFunc: (data, key) => {
        return showLinkOptions[data[key] + ""];
      },
    }),
  }),
  // tableCellTemplateMaker("页面配置", "pageConfigId"),
  // tableCellTemplateMaker("配置参数", "meta"),
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
        btnMaker("新增", btnActionTemplate.Function, {
          icon: "Plus",
          elType: "primary",
          isShow: (data) => {
            return data.type != 4;
          },
          function: async (that, data) => {
            let propsArr = ["parentName", "name", "icon", "meta"];
            if (data.type < 3) {
              propsArr.push("showLink");
              propsArr.push("orderNumber");
            }
            let queryItemTemplate = [
              disableType,
              ...pageConfigDataTableCellStorage.getByKeyArr(propsArr),
            ];
            if (data.type == 2) {
              queryItemTemplate.push(
                pageConfigDataTableCellStorage.getByLabel("URL")
              );
              queryItemTemplate.push(
                pageConfigDataTableCellStorage.getByKey("pageConfigId")
              );
            }
            if (data.type == 3)
              queryItemTemplate.push(
                pageConfigDataTableCellStorage.getByLabel("接口")
              );
            let drawerProps = {
              title: `新增${typeToModule[data.type + 1]}`,
              schema: { required: ["type", "name", "showLink"] },
              queryItemTemplate,
              data: {
                parentName: data.name,
                parentId: data.id,
                type: data.type + 1 + "",
                showLink: "true",
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
            let propsArr = ["name", "icon"];
            if (data.type < 4) {
              propsArr.push("showLink");
              propsArr.push("orderNumber");
            }
            let queryItemTemplate = [
              disableType,
              ...pageConfigDataTableCellStorage.getByKeyArr(propsArr),
            ];
            if (data.type == 3) {
              queryItemTemplate.push(
                pageConfigDataTableCellStorage.getByLabel("URL")
              );
            }
            if (data.type == 4)
              queryItemTemplate.push(
                pageConfigDataTableCellStorage.getByLabel("接口")
              );
            let drawerProps = {
              title: `新增${typeToModule[data.type + 1]}`,
              schema: { required: ["type", "name", "showLink"] },
              queryItemTemplate,
              data: {
                ...data,
                showLink: data.showLink == true ? "true" : "false",
                type: data.type + "",
              },
              btnList: [submit],
            } as drawerProps;
            that.$modules
              .getModuleApi()
              ["userManage_openDrawerForm"](that, drawerProps);
          },
        }),
        deleteBtn,
      ],
      {
        fixed: "right",
      }
    )
  )
);

const SearchTemplate = pageConfigDataTableCellStorage.getByKeyArr(["name"]);

const btnList = [
  btnMaker("新增模块", btnActionTemplate.OpenDrawer, {
    icon: "plus",
    elType: "primary",
    drawerProps: {
      title: "新增",
      schema: {
        required: ["type", "name", "showLink"],
      },
      queryItemTemplate: [
        disableType,
        ...pageConfigDataTableCellStorage.getByKeyArr([
          "name",
          "icon",
          "showLink",
        ]),
      ],
      btnList: [submit],
      data: {
        showLink: "true",
        type: "1",
      },
    },
  }),
];

export const menuManage = async () => {
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
            "parentName",
            "parentId",
            "urls",
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
            showLink: null,
          },
          btnList,
          autoSearch: false,
        },
        isSettingTool: false,
      }
    )
      .setPosition(0, 0)
      .setSize(12, 8),
  ] as gridCellTemplate[];
};
