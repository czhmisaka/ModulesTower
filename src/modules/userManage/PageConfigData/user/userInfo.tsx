/*
 * @Date: 2022-04-28 22:29:05
 * @LastEditors: CZH
 * @LastEditTime: 2023-02-13 09:37:57
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
} from "@/modules/userManage/component/searchTable/searchTable";
import {
  btnActionTemplate,
  stringAnyObj,
  formInputType,
} from "@/modules/userManage/types";
import { ElMessage, ElMessageBox } from "element-plus";

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



/**
 * @name: userManage
 * @description: 用户管理界面
 * @authors: CZH
 * @Date: 2022-12-14 08:30:00
 */
export const userManageCard = async () => {

  return [
  ] as gridCellTemplate[];
};
