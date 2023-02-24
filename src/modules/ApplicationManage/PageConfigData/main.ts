/*
 * @Date: 2022-04-28 22:29:05
 * @LastEditors: CZH
 * @LastEditTime: 2023-02-21 12:22:23
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
        let source = nodes.filter((x) => x.type == c)[0].id;
        back.push({
          target,
          source,
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

  let nodes = nodeTypeList.map((x, id) => {
    return {
      id,
      name: x + "-" + (id % 4),
      type: x,
      description: "asdasd",
      val: x != NTT.问题编号 ? id % 6 : 20,
      bgColor:
        fuckConnectLinkRule
          .map((c, i) => {
            return c.c.indexOf(x) != -1 ? getRandomColor(i + 10) : false;
          })
          .filter(Boolean)[0] || getRandomColor(2),
    };
  });

  let links = fuckLinkCreate(nodes, fuckConnectLinkRule);

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
          title: "1",
          chartOptions: {
            nodes: nodes,
            links: links,
          },
        },
      }
    ).setSize(3, 4),
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
          chartOptions: {
            nodes: nodes,
            links: links,
          },
        },
      }
    )
      .setSize(9, 8)
      .setPosition(3, 0),
  ] as gridCellTemplate[];
};
