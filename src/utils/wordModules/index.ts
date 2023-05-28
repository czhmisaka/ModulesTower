/*
 * @Date: 2023-04-26 18:31:45
 * @LastEditors: CZH
 * @LastEditTime: 2023-05-09 15:33:15
 * @FilePath: /html-docx-js-node-sample/src/wordModules/index.ts
 */

import { wordCellMaker } from "./engine/cellTemplate/cell";
import { checkWordCell, dealWordCell } from "./engine/cellTemplate/wordCell";
import { baseWordTemplate, wordTemplate, wordType } from "./type/index";

export const wordMaker = (word: wordTemplate) => {
  word = checkWordCell(word);
  return dealWordCell(word);
};

function labelValueMaker(label: string, value: string) {
  return {
    label,
    value,
  };
}

export const testFile = () => {
  const fileDataTest2 = {
    ...baseWordTemplate,
    file: {
      fileName: "生成工具测试文件.doc",
      Author: "czh",
    },
    wordCellList: [
      wordCellMaker(wordType.红头文件标头, "杭州发改委通知"),
      wordCellMaker(
        wordType.正文标题,
        "浙江省文物局关于对国能缙云80MW多能互补光伏发电项目进行考古调查勘探的复函"
      ),
      wordCellMaker(wordType.告知对象, "国能（浙江缙云）能源有限公司"),
      wordCellMaker(
        wordType.正文段落,
        "你单位提出的占地五万平方米以上的国能缙云80MW多能互补光伏发电项目，在划定勘察设计红线前的考古调查、勘探申请。我局意见如下："
      ),
      ...["一", "二", "三"].map((x) => {
        return wordCellMaker(
          wordType.正文段落,
          x +
            "、《中华人民共和啊实打实大师大师的阿斯顿个发is度回复i哦啊速滑发i哦啊u说迪欧啊是活动空间 i哦啊说的话法律框架阿斯顿好疯狂国文物保护法》规定，从事考古调查、勘探、发掘的单位必须具有国家文物局授予的考古发掘资质。目前，我省具有考古发掘资质的单位有浙江省文物考古研究所、杭州市文物考古研究所、宁波市文化遗产管理研究院（具体联系方式详见附件）。"
        );
      }),
      wordCellMaker(
        wordType.正文段落,
        "你单位应协调保障考古工作条件，确保考古调查、勘探工作顺利开展。属地文物部门应协调做好考古调查、勘探工作，并加强监督，切实履行文物管理职责。"
      ),
      wordCellMaker(wordType.换行),
      wordCellMaker(
        wordType.正文段落,
        "附件：浙江省考古发掘资质单位联系信息表"
      ),
      wordCellMaker(wordType.换行),
      wordCellMaker(wordType.落款, "浙江省文物局", {
        date: new Date().getTime(),
      }),
      wordCellMaker(wordType.抄送, "抄送：省文物考古研究所"),
      wordCellMaker(wordType.分页),
      wordCellMaker(wordType.附件),
      wordCellMaker(wordType.附件标题, "浙江省考古发掘资质单位联系信息表"),
      wordCellMaker(wordType.table表单, "", {
        data: {
          units: [
            {
              label: "浙江省文物考古研究所啊实打实的",
              props: [
                labelValueMaker("地址", "杭州市西湖区教工路71号"),
                labelValueMaker("联系人", "项目管理部 田健"),
                labelValueMaker("联系电话", "15049949636"),
              ],
            },
            {
              label: "杭州市文物考古研究所",
              props: [
                labelValueMaker("地址", "杭州市西湖区教工路71号"),
                labelValueMaker("联系人", "项目管理部 田健"),
                labelValueMaker("联系电话", "15049949636"),
                labelValueMaker("电子邮箱", "709794736@qq.com"),
              ],
            },
            {
              label: "宁波市文化遗产管理研究院",
              props: [
                labelValueMaker("地址", "杭州市西湖区教工路71号"),
                labelValueMaker("联系人", "项目管理部 田健"),
                labelValueMaker("联系电话", "15049949636"),
              ],
            },
          ],
        },
      }),
    ],
    baseData: {},
  } as wordTemplate;
  const word = wordMaker(fileDataTest2);
  return word;
};
