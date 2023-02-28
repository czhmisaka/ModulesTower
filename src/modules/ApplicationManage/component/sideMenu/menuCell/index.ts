import * as Icons from "@element-plus/icons-vue";
import { stringAnyObj } from "@/modules/userManage/types";

type iconType = keyof typeof Icons;

enum menuCellActionTemplate {
  Function = "Function",
  RouterPush = "RouterPush",
}

interface menuCellOptions {
  function: (that: stringAnyObj, data?: stringAnyObj) => void;
}

export interface menuCellTemplate {
  icon: iconType;
  title: string;
  type: menuCellActionTemplate;
  options?: {
    [key: string]: any;
  };
}

export const menuCellMaker = (
  title,
  type: menuCellActionTemplate,
  options: stringAnyObj
): menuCellTemplate => {
  let back = {
    title,
    type,
    options,
  } as menuCellTemplate;
  return back;
};

export default {};
