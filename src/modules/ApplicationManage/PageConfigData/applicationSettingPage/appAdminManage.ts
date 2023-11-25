/*
 * @Date: 2023-10-19 17:09:58
 * @LastEditors: CZH
 * @LastEditTime: 2023-10-30 18:00:51
 * @FilePath: /lcdp_fe_setup/src/modules/ApplicationManage/PageConfigData/applicationSettingPage/appAdminManage.ts
 */
import {
  cardComponentType,
  gridCellMaker,
  gridCellTemplate,
} from "@/components/basicComponents/grid/module/dataTemplate";
import {
  SearchCellStorage,
  actionCell,
  searchCell,
  tableCellTemplateMaker,
} from "@/modules/userManage/component/searchTable/searchTable";
import { ApplicationInfoTemplate } from "../../types";
import {
  allProcessDobuleCheckBtnMaker,
  btnMaker,
  dobuleCheckBtnMaker,
  openDrawerFormEasy,
  repBackMessageShow,
} from "@/modules/userManage/component/searchTable/drawerForm";
import {
  btnActionTemplate,
  drawerProps,
  formInputType,
} from "@/modules/userManage/types";
import { getXpx, getYpx, mainBoardSizeAndPosition, wholeScreen } from "../main";
import { post } from "@/utils/api/requests";
import {
  changeCardPosition,
  changeCardSize,
} from "@/components/basicComponents/grid/module/cardApi";
import { windowResizeChecker } from "@/modules/userManage/component/eventCenter/eventCenter";

const 管理员字段库 = new SearchCellStorage([
  tableCellTemplateMaker("姓名", "name"),
  tableCellTemplateMaker("部门", "wholeUnitNames"),
  tableCellTemplateMaker(
    "选择用户",
    "uids",
    searchCell(formInputType.searchList, {
      funcInputOptionsLoader: async (that) => {
        const remoteMethod = async (query: string) => {
          let res = await post("/web/usc/user/page", {
            name: query,
          });
          let data = [];
          if (res?.data?.list)
            data = res.data.list.map((x) => {
              return {
                value: x.id + "",
                label: x.name,
              };
            });
          return data;
        };
        return {
          "remote-method": remoteMethod,
        };
      },
    })
  ),
]);

export const appAdminManageTemplate = async (app: ApplicationInfoTemplate) => {
  const 新增管理员 = btnMaker("新增管理员", btnActionTemplate.Function, {
    icon: "Plus",
    elType: "primary",
    function: async (that, data) => {
      let drawerProps = {
        title: "新增管理员",
        queryItemTemplate: 管理员字段库.getByKeyArr(["uids"]),
        btnList: [
          btnMaker("提交", btnActionTemplate.Function, {
            function: async (that, data) => {
              let res = await post("/web/app/admin/insert", {
                ...data,
                appId: app.id,
              });
              repBackMessageShow(that, res);
            },
          }),
        ],
      } as drawerProps;
      openDrawerFormEasy(that, drawerProps);
    },
  });
  const 移除管理员 = allProcessDobuleCheckBtnMaker(
    "移除",
    "移除管理员",
    (that, data) => `确认移除管理员【${data.name}-${data.wholeUnitNames}】吗?`,
    async (that, data) => await post("/web/app/admin/delete", { id: data.id })
  );
  管理员字段库.push(
    tableCellTemplateMaker(
      "操作",
      "asd",
      actionCell([移除管理员], {
        fixed: "right",
        width: "200px",
      })
    )
  );
  const 批量移除管理员 = btnMaker("批量移除", btnActionTemplate.Function, {
    icon: "Remove",
    elType: "danger",
    isShow: (data) => {
      return data["_selectedList"]?.length > 0;
    },
    function: async (that, data) => {
      const { selectedList } = that;
      if (
        await dobuleCheckBtnMaker(
          `批量移除管理员【${selectedList.map((x) => x.name).join("】、【")}】`,
          `批量移除管理员`
        ).catch((x) => false)
      ) {
        let res = await post("/web/app/admin/deleteBatch", {
          ids: selectedList.map((x) => x.id),
        });
        repBackMessageShow(that, res);
      }
    },
  });
  return [
    gridCellMaker(
      "mainBoard",
      "应用管理员",
      {},
      {
        name: "userManage_searchTable",
        type: cardComponentType.componentList,
      },
      {
        props: {
          searchItemTemplate: [],
          showItemTemplate: 管理员字段库.getByKeyArr([
            "name",
            "wholeUnitNames",
            "asd",
          ]),
          searchFunc: async (query) => {
            let res = await post("/web/app/admin/page", {
              ...query,
              appId: app.id,
            });
            return res.data.list ? res.data : { ...res.data, list: [] };
          },
          defaultQuery: {},
          autoSearch: true,
          btnList: [新增管理员, 批量移除管理员],
        },
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
    ,
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
