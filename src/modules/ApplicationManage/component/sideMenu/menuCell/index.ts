import * as Icons from "@element-plus/icons-vue";
import { stringAnyObj } from "@/modules/userManage/types";

type iconType = keyof typeof Icons;

enum menuCellActionTemplate {
  Function = "Function",
  RouterPush = "RouterPush",
}

interface menuCellOptions {
  function?: (that: stringAnyObj, data?: stringAnyObj) => void;
  router?: {
    path: string;
    [key: string]: any;
  };
}

export interface menuCellTemplate {
  icon: iconType;
  title: string;
  type: menuCellActionTemplate;
  options?: menuCellOptions;
}

export const menuCellMaker = (
  icon: iconType,
  title,
  type: menuCellActionTemplate,
  options: stringAnyObj
): menuCellTemplate => {
  let back = {
    icon,
    title,
    type,
    options,
  } as menuCellTemplate;
  return back;
};

export default {};
