/*
 * @Date: 2023-04-13 10:36:13
 * @LastEditors: CZH
 * @LastEditTime: 2023-05-15 21:59:48
 * @FilePath: /ConfigForDesktopPage/src/utils/htmlToCanvas/toWord.ts
 */
import { stringAnyObj } from "@/modules/userManage/types";
import { saveAs } from "file-saver";
import { wordMaker } from "../wordModules/index";
import { baseWordTemplate, wordType } from "../wordModules/type/index";
import { wordCellMaker } from "../wordModules/engine/cellTemplate/cell";
import { wordTemplate } from "../wordModules/type/index";
import { download, post } from "../api/requests";

const base = {
  ...baseWordTemplate,
  file: {
    fileName: "生成工具测试文件.doc",
    Author: "czh",
  },
};

export const 无文物_考古调查勘探意见 = (
  地块,
  告知对象,
  考古调查勘探机构,
  发布时间,
  抄送
) => {
  return {
    ...base,
    wordCellList: [
      wordCellMaker(wordType.红头文件标头, "浙江省文物局"),
      wordCellMaker(wordType.文件函号, "（文件函号）"),
      wordCellMaker(
        wordType.正文标题,
        `浙江省文物局关于${地块}地块文物考古调查的意见`
      ),
      wordCellMaker(wordType.告知对象, 告知对象),
      wordCellMaker(
        wordType.正文段落,
        `近期，${考古调查勘探机构}对${地块}地块进行了考古调查、勘探，确认该地块内不涉及各级别的文物保护单位，不存在具有重要保护价值的文物建筑，也没有发现具有重要考古价值的古遗址、古墓葬、古窑址等地下文物遗存。经研究，我局同意${地块}地块的拟收储或出让计划，若在地块开发建设中发现文物，应立即停工，保护现场并报当地文物部门处理。`
      ),
      wordCellMaker(wordType.落款, "浙江省文物局", {
        date: new Date(发布时间).getTime(),
      }),
      wordCellMaker(wordType.分页),
      wordCellMaker(wordType.抄送, `抄送：${抄送}`),
    ],
  };
};

export const 考古调查勘探联系单 = (
  告知对象: string,
  地块名_用分号隔开: string,
  发布时间: string,
  表格数据: {
    utits: { label: string; props: { label: string; value: string }[] }[];
  },
  抄送: string
) => {
  return {
    ...base,
    wordCellList: [
      wordCellMaker(wordType.红头文件标头, "浙江省文物局"),
      wordCellMaker(wordType.正文标题, "考古调查勘探联系单"),
      wordCellMaker(wordType.告知对象, 告知对象),
      wordCellMaker(
        wordType.正文段落,
        `你单位提出的${地块名_用分号隔开}地块考古调查勘探申请我局已收悉，我局意见如下：`
      ),
      wordCellMaker(
        wordType.正文段落,
        `一、《中华人民共和国文物保护法》规定，从事考古调查、勘探、发掘的单位必须具有国家文物局授予的考古发掘资质。目前，我省具有考古发掘资质的单位有浙江省文物考古研究所、杭州市文物考古研究所、宁波市文化遗产管理研究院（具体联系方式详见附件）。`
      ),
      wordCellMaker(
        wordType.正文段落,
        `二、请你单位与符合条件的省内考古发掘资质单位分别进行磋商等竞争的方式，择优确定开展本项目调查勘探的单位。待考古工作结项后，我局将根据中标考古发掘资质单位编制的专项考古调查、勘探报告出具相关意见。`
      ),
      wordCellMaker(
        wordType.正文段落,
        `你单位应协调保障考古工作条件，确保考古调查、勘探工作顺利开展。属地文物部门应协调做好考古调查、勘探工作，并加强监督，切实履行文物管理职责。`
      ),
      wordCellMaker(wordType.换行),
      wordCellMaker(wordType.落款, "浙江省文物局", {
        date: new Date(发布时间).getTime(),
      }),
      wordCellMaker(wordType.分页),
      wordCellMaker(wordType.附件),
      wordCellMaker(wordType.附件标题, "浙江省考古发掘资质单位联系信息表"),
      wordCellMaker(wordType.table表单, "", {
        data: 表格数据,
      }),
      wordCellMaker(wordType.抄送, 抄送),
    ],
  } as wordTemplate;
};

// @ToDo 等待编写
export const 迁移_原址_考古发掘合并_考古调查勘探意见 = (
  地块,
  告知对象,
  考古调查勘探机构,
  考古调查勘探结果
) => {
  return {
    ...base,
    wordCellList: [
      wordCellMaker(wordType.红头文件标头, "浙江省文物局"),
      wordCellMaker(wordType.文件函号, "（文件函号）"),
      wordCellMaker(
        wordType.正文标题,
        `浙江省文物局关于${地块}地块文物考古调查的意见`
      ),
      wordCellMaker(wordType.告知对象, 告知对象),
      wordCellMaker(
        wordType.正文段落,
        `近期，省文物考古研究所对${地块}地块进行了考古调查、勘探，确认该地块涉及${1}`
      ),
    ],
  } as wordTemplate;
};

export const 考古发掘联系单 = (
  地块,
  告知对象,
  考古资质单位名称,
  联系人,
  联系方式,
  发布时间,
  抄送
) => {
  return {
    ...base,
    wordCellList: [
      wordCellMaker(wordType.红头文件标头, "浙江省文物局"),
      wordCellMaker(wordType.正文标题, `考古发掘联系单`),
      wordCellMaker(wordType.告知对象, 告知对象),
      wordCellMaker(
        wordType.正文段落,
        `
      ${考古资质单位名称}单位提出${地块}地块的考古发掘申请已收悉，请你们派员对该地块涉及的地下文物遗存进行考古发掘，并履行相应的审批手续。发掘结束后，请将发掘结果报告我局。联系人：${联系人}，联系方式：${联系方式}。
        `
      ),
      wordCellMaker(wordType.落款, "浙江省文物局", {
        date: new Date(发布时间).getTime(),
      }),
      wordCellMaker(wordType.抄送, `抄送：${抄送}`),
    ],
  };
};

// ToDo 等待编写
export const 迁移_原址_考古发掘合并_考古发掘意见 = (
  地块,
  告知对象,
  考古资质单位名称,
  原址保护内容,
  迁移保护内容,
  发布时间,
  抄送
) => {
  let 正文 = `近期，${考古资质单位名称}对${地块}地块进行了考古发掘,`;
  if (原址保护内容) {
  }
  if (迁移保护内容) {
  }
  return {
    ...base,
    wordCellList: [
      wordCellMaker(wordType.红头文件标头, "浙江省文物局"),
      wordCellMaker(wordType.文件函号, "（文件函号）"),
      wordCellMaker(
        wordType.正文标题,
        `浙江省文物局关于${地块}地块文物考古发掘的意见`
      ),
      wordCellMaker(wordType.告知对象, 告知对象),
      wordCellMaker(wordType.正文段落, 正文),
      wordCellMaker(wordType.落款, "浙江省文物局", {
        date: new Date(发布时间).getTime(),
      }),
      wordCellMaker(wordType.抄送, `抄送：${抄送}`),
    ],
  };
};

export const 无文物省局_考古发掘意见 = (
  地块,
  告知对象,
  考古资质单位名称,
  原址保护内容,
  迁移保护内容,
  发布时间,
  抄送
) => {
  return {
    ...base,
    wordCellList: [
      wordCellMaker(wordType.红头文件标头, "浙江省文物局"),
      wordCellMaker(wordType.文件函号, "（文件函号）"),
      wordCellMaker(
        wordType.正文标题,
        `浙江省文物局关于${地块}地块文物考古发掘的意见`
      ),
      wordCellMaker(wordType.告知对象, 告知对象),
      wordCellMaker(
        wordType.正文段落,
        `近期，${考古资质单位名称}对${地块}地块涉及的地下文物遗存进行了考古发掘，现已清理完毕。经研究，我局同意${地块}地块的拟收储或出让计划，若在地块开发建设中发现文物，应立即停工，保护现场并报当地文物部门处理。`
      ),
      wordCellMaker(wordType.落款, "浙江省文物局", {
        date: new Date(发布时间).getTime(),
      }),
      wordCellMaker(wordType.分页),
      wordCellMaker(wordType.抄送, `抄送：${抄送}`),
    ],
  };
};

export const openDownloadFunc = async (wordTemplate: wordTemplate) => {
  const fileName = encodeURI("asd.doc");
  let res = await post("/docMaker/makeDocByTemplate", {
    fileName: "生成文件",
    wordTemplate,
  });
  const blob = new Blob([res as unknown as any]);
  saveAs(blob, fileName);
};
