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
interface fuckRule {
  p: string;
  c: string[];
}
function fuckLinkCreate(nodes) {
  let back = [];
  back = [
    {
      target: "49f472b81d874df7a8505297f685a080",
      source: "04d6924f3e23444aa75de1d8b5bbb90d",
    },
    {
      target: "04d6924f3e23444aa75de1d8b5bbb90d",
      source: "49f472b81d874df7a8505297f685a080",
    },
  ];
//   nodes.map(item=>{

//   })
//   rules.map((rule) => {
//     let target = nodes.filter((x) => x.id == rule.p)[0]?.id;
//     // console.log(target,'target')
//     rule.c.map((c) => {
//       // console.log(nodes.filter((x) => x.id == c),'filter');
//       nodes
//         .filter((x) => x.id == c)
//         .map((c) => {
//           let source = c.id;
//           back.push({
//             target,
//             source,
//           });
//         });
//     });
//   });
  // console.log(back,'back')
  return back;
}

 export const getForceGraphInfo = (data) => {
   let nodess = data.map((x, id) => {
     return {
       id: x.id,
    //    name: x.value,
    //    type: x.type,
    //    description: "asdasd",
    //    val: x.type != NTT.问题编号 ? id % 6 : 20,
       //    color: getFuckUIColor(x.level),
       //    linkColor: getLinkUIColor(x.level),
       //    imgNode: getNodeImg(x.level),
       //    size: getNodeSize(x.level),
       // mass: getNodeSize(x.type) - 20,
       // bgColor:
       //   tagConnectLinkRule
       //     .map((c, i) => {
       //       return c.c.indexOf(x.type) != -1 ? getRandomColor(i + 10) : false;
       //     })
       //     .filter(Boolean)[0] || getRandomColor(2),
     };
   });
//    const tagConnectLinkRuleList = getLinkInfo(data);
//    const trueData = toRepeat(nodess);
   let links = fuckLinkCreate(nodess);
   console.log(links,'pppp')
   return {
     nodes: nodess,
     links,
   };
 };
export const threemainDesktop = async () => {
    //  function getFuckNodeAndLinkForFuckNothing(index) {
    //    let nodess = nodes[index].map((x, id) => {
    //      return {
    //        id,
    //        name: x.value,
    //        type: x.type,
    //        description: "asdasd",
    //     //    val: x.type != NTT.问题编号 ? id % 6 : 20,
    //     //    bgColor: getFuckUIColor(x.type),
    //        // bgColor:
    //        //   tagConnectLinkRule
    //        //     .map((c, i) => {
    //        //       return c.c.indexOf(x.type) != -1 ? getRandomColor(i + 10) : false;
    //        //     })
    //        //     .filter(Boolean)[0] || getRandomColor(2),
    //      };
    //    });

    //    let links = fuckLinkCreate(nodess, tagConnectLinkRule);
    //    return {
    //      nodes: nodess,
    //      links,
    //    };
    //  }
     const N = 80;
     const array = [
    //     {
    //      type: "问题领域",
    //      value: "党的建设",
    //      level: 1,
    //      id: "49f472b81d874df7a8505297f685a080",
    //      pid: "p49f472b81d874df7a8505297f685a080",
    //      otherInfo: null,
    //    },
       {
         type: "问题领域",
         value: "党的建设",
         level: 1,
         id: "49f472b81d874df7a8505297f685a080",
         pid: "p49f472b81d874df7a8505297f685a080",
         otherInfo: null,
       },
       {
         type: "问题类型",
         value: "党的制度执行不严格",
         level: 2,
         id: "04d6924f3e23444aa75de1d8b5bbb90d",
         pid: "49f472b81d874df7a8505297f685a080",
         otherInfo: null,
       },
    //    {
    //      type: "问题编号",
    //      value: "ZJZSWT2023A0011",
    //      level: 3,
    //      id: "692d8513592c4acbaa2429fca58439e2",
    //      pid: "04d6924f3e23444aa75de1d8b5bbb90d",
    //      otherInfo: null,
    //    },
    //    {
    //      type: "问题编号",
    //      value: "ZJZSWT2023A0011",
    //      level: 3,
    //      id: "692d8513592c4acbaa2429fca58439e2",
    //      pid: "04d6924f3e23444aa75de1d8b5bbb90d",
    //      otherInfo: null,
    //    },
     ];
    
    return [
      gridCellMaker(
        "3dForceGraph",
        "3dForceGraph",
        {},
        {
          name: "Graph_3dForceGraph",
          type: cardComponentType.componentList,
        },
        {
          props: {
            title: "2",
            chartOptions: getForceGraphInfo(array),
          },
        }
      )
        .setSize(12, 8)
        .setPosition(0, 0),
    ];
}