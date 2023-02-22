/*
 * @Date: 2022-04-28 22:29:05
 * @LastEditors: CZH
 * @LastEditTime: 2023-02-22 20:24:14
 * @FilePath: /configforpagedemo/src/modules/Graph/PageConfigData/main.ts
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

import { nodes } from "./Data";

export const mainDesktop = async () => {
  enum NTT {
    问题编号 = "问题编号",
    问题描述 = "问题描述",
    问题类型 = "问题类型",
    问题领域 = "问题领域",
    制度名称 = "制度名称",
    制度条例 = "制度条例",
    规则 = "规则",
    标签 = "标签",
    问题来源 = "问题来源",
    问题状态 = "问题状态",
    问题时间 = "问题时间",
    涉及人员 = "涉及人员",
    人员分类 = "人员分类",
    处理依据 = "处理依据",
    具体结果 = "具体结果",
    处理结果 = "处理结果",
    问题涉及单位 = "问题涉及单位",
    问题发现人员 = "问题发现人员",
    人才信息 = "人才信息",
    发现问题数量 = "发现问题数量",
    发现线索数量 = "发现线索数量",
  }
  const nodeTypeList = [
    NTT.问题编号,
    NTT.问题描述,
    NTT.问题类型,
    NTT.问题领域,
    NTT.制度名称,
    NTT.制度条例,
    NTT.规则,
    NTT.标签,
    NTT.问题来源,
    NTT.问题状态,
    NTT.问题时间,
    NTT.涉及人员,
    NTT.人员分类,
    NTT.处理依据,
    NTT.具体结果,
    NTT.处理结果,
    NTT.问题涉及单位,
    NTT.问题发现人员,
    NTT.人才信息,
    NTT.发现问题数量,
    NTT.发现线索数量,
  ];

  function ToCreateFuckLinkRule(p: NTT, c: NTT[]) {
    return {
      p,
      c,
    };
  }

  interface fuckRule {
    p: string;
    c: string[];
  }

  const fuckConnectLinkRule = [
    ToCreateFuckLinkRule(NTT.问题编号, [NTT.问题描述]),
    ToCreateFuckLinkRule(NTT.问题描述, [
      NTT.问题领域,
      NTT.制度名称,
      NTT.问题涉及单位,
      NTT.标签,
      NTT.问题状态,
      NTT.涉及人员,
      NTT.问题发现人员,
      NTT.问题来源,
      NTT.问题时间,
    ]),
    ToCreateFuckLinkRule(NTT.涉及人员, [
      NTT.人员分类,
      NTT.处理依据,
      NTT.处理结果,
      NTT.具体结果,
    ]),
    ToCreateFuckLinkRule(NTT.制度名称, [NTT.制度条例]),
    ToCreateFuckLinkRule(NTT.制度条例, [NTT.规则]),
    ToCreateFuckLinkRule(NTT.问题发现人员, [
      NTT.人才信息,
      NTT.发现线索数量,
      NTT.发现问题数量,
    ]),
    ToCreateFuckLinkRule(NTT.问题领域, [NTT.问题类型]),
  ] as fuckRule[];

  function fuckLinkCreate(nodes, rules: fuckRule[]) {
    let back = [];
    rules.map((rule) => {
      let target = nodes.filter((x) => x.type == rule.p)[0].id;
      rule.c.map((c) => {
        nodes
          .filter((x) => x.type == c)
          .map((c) => {
            let source = c.id;
            back.push({
              target,
              source,
            });
          });
      });
    });
    return back;
  }

  function getRandomColor(main): string {
    let fuck = 1 / main;
    return (
      "#" + (((Math.random() * fuck + 1 - fuck) * 0xffffff) << 0).toString(16)
    );
  }

  function getFuckUIColor(type): string {
    const back = {
      编号: "#f00",
      描述: "rgb(250,94,194)",
      发现: "rgb(148,215,246)",
      问题: "rgb(144,167,115)",
      涉及: "rgb(144,167,115)",
      制度: "rgb(167,119,115)",
      规则: "rgb(166,148,246)",
      标签: "rgb(255,189,23)",
      人才: "rgb(148,215,246)",
    };

    console.log(
      type,
      back[Object.keys(back).filter((x) => type.indexOf(x) > -1)[0] || "1"] ||
        "#333"
    );
    return (
      back[Object.keys(back).filter((x) => type.indexOf(x) > -1)[0] || "1"] ||
      "rgb(246,199,148)"
    );
  }

  function getFuckNodeAndLinkForFuckNothing(index) {
    let nodess = nodes[index].map((x, id) => {
      return {
        id,
        name: x.value,
        type: x.type,
        description: "asdasd",
        val: x.type != NTT.问题编号 ? id % 6 : 20,
        bgColor: getFuckUIColor(x.type),
        // bgColor:
        //   fuckConnectLinkRule
        //     .map((c, i) => {
        //       return c.c.indexOf(x.type) != -1 ? getRandomColor(i + 10) : false;
        //     })
        //     .filter(Boolean)[0] || getRandomColor(2),
      };
    });

    let links = fuckLinkCreate(nodess, fuckConnectLinkRule);
    return {
      nodes: nodess,
      links,
    };
  }

  return [
    gridCellMaker(
      "forceGraph",
      "forceGraph",
      {},
      {
        name: "Graph_forceGraph",
        type: cardComponentType.componentList,
      },
      {
        props: {
          title: "2",
          chartOptions: getFuckNodeAndLinkForFuckNothing(0),
        },
      }
    )
      .setSize(9, 7)
      .setPosition(3, 1),
    gridCellMaker(
      "a",
      "a",
      {},
      {
        type: cardComponentType.componentList,
        name: "icon",
      },
      {
        isSettingTool: true,
        props: {
          name: "Link",
          onClickFunc: (content: any) => {
            const { context } = content;
            changeCardProperties(context, {
              forceGraph: {
                chartOptions: getFuckNodeAndLinkForFuckNothing(0),
              },
            });
          },
        },
      }
    )
      .setPosition(0, 0)
      .setSize(1, 1),
    gridCellMaker(
      "a",
      "a",
      {},
      {
        type: cardComponentType.componentList,
        name: "icon",
      },
      {
        isSettingTool: true,
        props: {
          name: "Link",
          onClickFunc: (content: any) => {
            const { context } = content;
            changeCardProperties(context, {
              forceGraph: {
                chartOptions: getFuckNodeAndLinkForFuckNothing(1),
              },
            });
          },
        },
      }
    )
      .setPosition(1, 0)
      .setSize(1, 1),
    gridCellMaker(
      "a",
      "a",
      {},
      {
        type: cardComponentType.componentList,
        name: "icon",
      },
      {
        isSettingTool: true,
        props: {
          name: "Link",
          onClickFunc: (content: any) => {
            const { context } = content;
            changeCardProperties(context, {
              forceGraph: {
                chartOptions: getFuckNodeAndLinkForFuckNothing(2),
              },
            });
          },
        },
      }
    )
      .setPosition(2, 0)
      .setSize(1, 1),
  ] as gridCellTemplate[];
};
