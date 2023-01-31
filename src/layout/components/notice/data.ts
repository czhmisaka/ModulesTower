/*
 * @Date: 2023-01-30 12:55:07
 * @LastEditors: CZH
 * @LastEditTime: 2023-01-31 21:12:58
 * @FilePath: /configforpagedemo/src/layout/components/notice/data.ts
 */
export interface ListItem {
  avatar: string;
  title: string;
  datetime: string;
  type: string;
  description: string;
  status?: "" | "success" | "warning" | "info" | "danger";
  extra?: string;
}

export interface TabItem {
  key: string;
  name: string;
  list: ListItem[];
}

export const noticesData: TabItem[] = [
  // {
  //   key: "1",
  //   name: "通知",
  //   list: [
  //     {
  //       avatar:
  //         "https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png",
  //       title: "你收到了 12 份新周报",
  //       datetime: "一年前",
  //       description: "",
  //       type: "1",
  //     },
  //   ],
  // },
];
