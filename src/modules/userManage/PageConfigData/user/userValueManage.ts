/*
 * @Date: 2023-02-14 16:00:45
 * @LastEditors: CZH
 * @LastEditTime: 2023-02-14 16:11:08
 * @FilePath: /configforpagedemo/src/modules/userManage/PageConfigData/user/userValueManage.ts
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

const 用户字段存储库 = new SearchCellStorage([]);
