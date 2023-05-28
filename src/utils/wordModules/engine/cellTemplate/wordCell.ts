/*
 * @Date: 2023-05-04 16:34:26
 * @LastEditors: CZH
 * @LastEditTime: 2023-05-08 15:49:22
 * @FilePath: /html-docx-js-node-sample/src/wordModules/engine/cellTemplate/wordCell.ts
 */
import {
  wordObjCellTemplate,
  wordType,
  wordTemplate,
  wordCellMakerFuncTemplate,
} from "../../type";
import { stringAnyObj } from "../../type/index";
import { wordCellMaker, wordCellTemplate } from "./cell";
import { headersMaker } from "./header";

export const dealWordCell = (word: wordTemplate) => {
  const { wordCellList } = word;
  // 添加标头
  let wordContext =
    headersMaker(word) +
    `<body style="tab-interval:21pt;text-justify-trim:punctuation;">
	<!--StartFragment-->
	<div class="Section0" style="layout-grid:15.6000pt;">`;

  // 不同配置节点
  wordCellList.map((x) => {
    wordContext += wordCellTemplate[x.type].function(x, word.baseData);
  });

  wordContext += `
  	</div><!--EndFragment--></body>
</html>`;

  return wordContext;
};

export const checkWordCell = (word: wordTemplate) => {
  let wordCellList = word.wordCellList;
  let afterDealWordCellList = [] as wordObjCellTemplate[];
  const limitNumber = 10000;
  let wordCellTemplateList = [];
  for (let i = 0; i < wordCellList.length; i++) {
    if (wordCellList.length > limitNumber) {
      wordCellList.push(wordCellMaker(wordType.正文段落, "超出字数限制"));
      break;
    }
    const nowCell = wordCellList[i];
    const nowWordTemplate = wordCellTemplate[nowCell.type];
    wordCellTemplateList.push(nowWordTemplate);
    if (nowWordTemplate.preDealFunc) {
      const back = nowWordTemplate.preDealFunc(
        nowCell,
        afterDealWordCellList,
        word
      );
      if (back && back.length && back.length > 0) {
        back.map((x) => {
          afterDealWordCellList.push(x);
        });
      }
    }
    afterDealWordCellList.push(nowCell);
  }
  word.wordCellList = afterDealWordCellList;
  return word;
};
