import { btnMaker } from "@/modules/userManage/component/searchTable/drawerForm";
import { btnActionTemplate } from "@/modules/userManage/types";

export const 收藏按钮 = btnMaker("收藏", btnActionTemplate.OpenDrawer, {
  title: "选择收藏夹",
});

export const InfoCardBtnList = [];
