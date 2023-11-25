/*
 * @Date: 2022-04-28 22:29:05
 * @LastEditors: CZH
 * @LastEditTime: 2023-11-13 16:36:57
 * @FilePath: /lcdp_fe_setup/src/modules/ApplicationManage/PageConfigData/applicationSettingPage/appMenuManage.ts
 */

import {
  changeVisible,
  changeCardSize,
  changeCardPosition,
  changeCardProperties,
} from "@/components/basicComponents/grid/module/cardApi/index";
import { ApplicationInfoTemplate, stringAnyObj } from "../../types";
import { mainBoardSizeAndPosition } from "../main";
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

import {
  btnMaker,
  dobuleCheckBtnMaker,
  roleBtnMaker,
} from "@/modules/userManage/component/searchTable/drawerForm";
import {
  SearchCellStorage,
  tableCellTemplateMaker,
  showCell,
  searchCell,
  actionCell,
  customComponentMakerForSearchCell,
  staticSelectCell,
} from "@/modules/userManage/component/searchTable/searchTable";
import {
  showType,
  formInputType,
  btnActionTemplate,
  drawerProps,
  btnCellTemplate,
} from "@/modules/userManage/types";
import { ElMessage, ElMessageBox } from "element-plus";
import { refreshDesktop } from "@/components/basicComponents/grid/module/cardApi";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { useModuleHook } from "@/store/modules/module";

import { repBackMessageShow } from "@/modules/userManage/component/searchTable/drawerForm";
import { getModuleFromView, timeChecker } from "@/router/util";
import iconPicker from "@/modules/userManage/component/searchTable/inputElementComponent/iconPicker.vue";
import { timeConsole } from "@/main";

const typeToModule = {
  // 1: "模块",
  2: "目录",
  3: "菜单",
  4: "按钮",
};

const showLinkOptions = {
  true: "是",
  false: "否",
};

// 使用svg的icon
const fuck = import.meta.glob("@/assets/svg/icon/*.svg");
import { deepClone } from "@/components/basicComponents/grid/module/cardApi/deepClone";
import { message } from "@pureadmin/components";
import { windowResizeChecker } from "@/modules/userManage/component/eventCenter/eventCenter";

let iconMap = {};
for (let x in Icons) {
  iconMap["EL_" + x] = x;
}

for (let key in fuck) {
  let name = key.split("/icon/")[1];
  iconMap["SVG_" + "./" + name] = name;
}

let dataList = [];

export const 图标 = tableCellTemplateMaker("图标", "icon", {
  ...customComponentMakerForSearchCell({
    isLocalComponent: true,
    component: iconPicker,
  }),
  ...showCell(showType.funcComponent, {
    style: {
      paddingLeft: "4px",
      display: "inline-block",
      width: "40px",
    },
    showFunc: (data, key) => {
      if (data[key] && data[key][0] == "{")
        return useRenderIcon(JSON.parse(data[key]));
      else if (data[key]) return useRenderIcon(data[key]);
    },
  }),
});

export const appMenuManage = async (appData: ApplicationInfoTemplate = {}) => {
  const getData = async () => {
    let res = await post("/web/app/org/menu/list", {
      appId: appData.id,
    });
    if (!res.data) {
      res.data = [];
    }
    function toArray(itemList) {
      let arr = [];
      itemList.map((x) => {
        let hasChildren = (x.children && x.children.length) > 0;
        const children = x.children;
        delete x.children;
        arr.push({
          ...x,
          hasChildren,
        });
        if (hasChildren)
          toArray(children).map((x) => {
            arr.push(x);
          });
      });
      return arr;
    }
    dataList = toArray(deepClone(res.data));
    return res.data.map((x) => {
      let key = (x.children && x.children.length) > 0;
      delete x.children;
      return {
        ...x,
        hasChildren: key,
      };
    });
  };

  const submit = btnMaker("提交", btnActionTemplate.Function, {
    function: async (that, query) => {
      let data = {
        ...query,
        urls: typeof query.urls == "string" ? [query.urls] : query.urls,
      } as stringAnyObj;
      let res = await post(
        `/web/app/org/menu/${data.id ? "update" : "insert"}`,
        data
      );
      repBackMessageShow(that, res);
    },
  });

  // 页面配置数据
  const pageConfigDataTableCellStorage = new SearchCellStorage([
    tableCellTemplateMaker("id", "id", showCell(showType.dataKey)),
    tableCellTemplateMaker("权限标识", "permission"),
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
      ...searchCell(formInputType.input, {
        "err:required": "请输入名称",
      }),
      ...showCell(showType.func, {
        width: "300px",
        showFunc: (data, key) => {
          return data["key"]
            ? data["name"] + "【" + data["key"] + "】"
            : data["name"];
        },
      }),
    }),
    图标,
    tableCellTemplateMaker("排序", "orderNumber", {
      ...searchCell(formInputType.number, {
        propertiesOption: {
          "ui:options": {
            min: 0,
          },
        },
      }),
    }),
    tableCellTemplateMaker("类型", "type", {
      ...showCell(showType.func, {
        showFunc: (data, key) => typeToModule[data[key]],
      }),
      ...searchCell(formInputType.select, {
        inputOptions: typeToModule,
        onChangeFunc: (that, data) => {},
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
            type: "string",
            remoteMethod: async (data) => {
              return [...routes, { path: data, name: data }].map((x) => {
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
              let res = await post("/web/app/org/url/listAll", {});
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
      ...searchCell(formInputType.radio, {
        inputOptions: [
          { label: "是", value: "true" },
          { label: "否", value: "false" },
        ],
      }),
      ...showCell(showType.func, {
        showFunc: (data, key) => {
          return showLinkOptions[data[key] + ""];
        },
      }),
    }),
    tableCellTemplateMaker("权限标识", "key", searchCell(formInputType.input)),
    tableCellTemplateMaker("key", "key", searchCell(formInputType.input)),
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

  const 新增下级时用的节点类型 = tableCellTemplateMaker(
    "类型",
    "type",
    staticSelectCell(
      {
        2: "目录",
        3: "菜单",
      },
      {
        onChangeFunc: async (that, data) => {
          let propsArr = [
            "parentName",
            "name",
            "icon",
            "meta",
            "orderNumber",
            "permission",
          ];
          if (data["type"] == 2) {
            return [
              新增下级时用的节点类型,
              ...pageConfigDataTableCellStorage.getByKeyArr(propsArr),
            ];
          } else if (data["type"] == 3) {
            return [
              新增下级时用的节点类型,
              ...pageConfigDataTableCellStorage.getByKeyArr(propsArr),
              pageConfigDataTableCellStorage.getByLabel("URL"),
              pageConfigDataTableCellStorage.getByKey("pageConfigId"),
            ];
          }
        },
      }
    )
  );

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

  const 编辑按钮 = btnMaker(
    "编辑",
    btnActionTemplate.Function,
    {
      icon: "Edit",
      elType: "success",
      function: async (that, d) => {
        let data = deepClone(d);
        let propsArr = ["name", "icon", "permission"];
        if (data.type < 4) {
          data["urls"] = data.urls ? data.urls[0] : "";
          propsArr.push("showLink");
          propsArr.push("orderNumber");
        }
        let queryItemTemplate = [
          disableType,
          ...pageConfigDataTableCellStorage.getByKeyArr(propsArr),
        ];
        let requiredList = ["type", "name", "showLink"];
        if (data.type == 3) {
          requiredList = ["type", "name", "showLink", "icon"];
          queryItemTemplate.push(
            pageConfigDataTableCellStorage.getByLabel("URL")
          );
        }
        if (data.type == 4) {
          requiredList = ["type", "name", "showLink"];
          queryItemTemplate.push(
            pageConfigDataTableCellStorage.getByLabel("接口")
          );
          queryItemTemplate.push(
            pageConfigDataTableCellStorage.getByLabel("按钮key")
          );
        }
        let drawerProps = {
          title: `编辑${typeToModule[data.type]}【${data.name}】`,
          schema: { required: requiredList },
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
    },
    ["/web/app/org/menu/update"],
    "编辑按钮"
  );

  const 新增按钮 = btnMaker(
    "新增下级",
    btnActionTemplate.Function,
    {
      icon: "Plus",
      elType: "primary",
      isShow: (data) => {
        return data.type != 4;
      },
      function: async (that, data) => {
        let propsArr = [
          "parentName",
          "name",
          "icon",
          "meta",
          "orderNumber",
          "permission",
        ];
        if (data.type < 3) {
          propsArr.push("showLink");
        }
        let queryItemTemplate = [];
        if (data.type == 1 || data.type == 2)
          queryItemTemplate = [新增下级时用的节点类型];
        else queryItemTemplate = [disableType];
        queryItemTemplate = [
          ...queryItemTemplate,
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
        if (data.type == 3) {
          queryItemTemplate.push(
            pageConfigDataTableCellStorage.getByLabel("接口")
          );
          queryItemTemplate.push(
            pageConfigDataTableCellStorage.getByLabel("按钮key")
          );
        }
        let drawerProps = {
          title: `新增${typeToModule[data.type * 1 + 1]}`,
          schema: {
            required: ["type", "name", "showLink", "url", "key"],
          },
          queryItemTemplate,
          data: {
            parentName: data.name,
            parentId: data.id,
            type: data.type * 1 + 1 + "",
            showLink: "true",
            appId: appData.id,
          },
          btnList: [submit],
        } as drawerProps;
        that.$modules
          .getModuleApi()
          ["userManage_openDrawerForm"](that, drawerProps);
      },
    },
    ["/web/app/org/menu/insert"],
    "目录/菜单/按钮新增按钮"
  );

  const 新增菜单按钮 = btnMaker(
    "新增菜单",
    btnActionTemplate.OpenDrawer,
    {
      icon: "Plus",
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
            "orderNumber",
          ]),
        ],
        btnList: [submit],
        data: {
          showLink: "true",
          type: "3",
          appId: appData.id,
        },
      },
    },
    ["/web/app/org/menu/insert"],
    "新增菜单按钮"
  );

  const 新增目录按钮 = btnMaker(
    "新增目录",
    btnActionTemplate.OpenDrawer,
    {
      icon: "Plus",
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
            "orderNumber",
          ]),
        ],
        btnList: [submit],
        data: {
          showLink: "true",
          type: "2",
          appId: appData.id,
        },
      },
    },
    ["/web/app/org/menu/insert"],
    "新增目录按钮"
  );

  const 删除按钮 = btnMaker(
    "删除",
    btnActionTemplate.Function,
    {
      icon: "Delete",
      elType: "danger",
      isShow: (data) => !data.children || data.children.length == 0,
      function: async (that, data) => {
        if (data.children && data.children.length > 0)
          return ElMessage.warning("【无法删除】：存在子节点");
        if (
          await dobuleCheckBtnMaker(
            "删除",
            "确认删除【" + data.name + "】吗？",
            { type: "warning" }
          ).catch((x) => {
            return false;
          })
        ) {
          let res = await post("/web/app/org/menu/delete", {
            id: data.id,
          });
          await getData();
          repBackMessageShow(that, res);
        }
      },
    },
    ["/web/app/org/menu/delete"],
    "删除按钮"
  );

  pageConfigDataTableCellStorage.push(
    tableCellTemplateMaker(
      "操作",
      "actionaction",
      actionCell([新增按钮, 编辑按钮, 删除按钮], {
        fixed: "right",
      })
    )
  );

  return [
    gridCellMaker(
      "mainBoard",
      "搜索结果列表",
      {},
      {
        name: "userManage_searchTable",
        type: cardComponentType.componentList,
      },
      {
        props: {
          // searchItemTemplate: SearchTemplate,
          searchItemTemplate: [],
          showItemTemplate: pageConfigDataTableCellStorage.getByLabelArr([
            "名称",
            "类型",
            "图标",
            "接口",
            "作为菜单展示",
            "操作",
          ]),
          load(row, treeNode, resolve: (date) => void) {
            resolve(dataList.filter((x) => x.parentId == row.id));
          },
          searchFunc: async (query: stringAnyObj) => {
            let res = await getData();
            return res;
          },
          defaultQuery: {
            showLink: null,
          },
          btnList: [新增目录按钮, 新增菜单按钮],
          autoSearch: false,
        },
        showInGridDesktop: true,
        isSettingTool: false,
      }
    )
      .setSize(
        mainBoardSizeAndPosition().size.width,
        mainBoardSizeAndPosition().size.height
      )
      .setPosition(
        mainBoardSizeAndPosition().position.x,
        mainBoardSizeAndPosition().position.y
      ),
    windowResize,
  ] as gridCellTemplate[];
};

let timeOut = null as any;
const windowResize = windowResizeChecker(async (that, baseData) => {
  if (timeOut) clearTimeout(timeOut);
  timeOut = setTimeout(() => {
    changeCardSize(that, {
      mainBoard: {
        width: mainBoardSizeAndPosition().size.width,
        height: mainBoardSizeAndPosition().size.height,
      },
    });
    changeCardPosition(that, {
      mainBoard: {
        x: mainBoardSizeAndPosition().position.x,
        y: mainBoardSizeAndPosition().position.y,
      },
    });
  }, 50);
}, "mainBoard_windowResize");
