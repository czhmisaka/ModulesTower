import {
  wordCellMakerFuncTemplate,
  wordObjCellTemplate,
  wordTemplate,
  wordType,
} from "../../type";
import { stringAnyObj } from "../../type/index";
let wordCellTemplateStatic = {} as wordCellMakerFuncTemplate;

const image =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAnAAAAAECAYAAAAOPwJdAAABUWlDQ1BJQ0MgUHJvZmlsZQAAGJV1kD9IQmEUxX9WIohYQ0ODg5BIg0lpYKtKRNAgllBtz5dpoM+PpxHtBY1SU9AQBs1NFk0O7Q1FQ0RbNDRGLSWv+7SyP/R9HM6Pw+FyudCDplSxDygZVTM9nfAvLC75XQ845bsZJqzpFRVPpWalwqf/fC/XOGy/HLVnHTXuvd6d4OLj6VnTCPtif/s/nns5V9HF30QjujKr4AgIp9arymYRg6YsJbxtc77D+zZnO3zc7synk8LnwgN6QVsWvhIOZb/l+W9cKq7pHzvY23tyRmbOdpGPDFNEiBFl/J/eRLuXpIxiA5NV8hSo4icuiaJITngGA50wIeEIY6Kofd/fd+tm5TpMPkNvrZtl9+BkC4ZuulngAPo3oXGhNFP7uqbjpa+yEo102JMA551lPQXBtQutmmW91i2rdSjzb6FpvAOENmIkqKua1AAAAIplWElmTU0AKgAAAAgABAEaAAUAAAABAAAAPgEbAAUAAAABAAAARgEoAAMAAAABAAIAAIdpAAQAAAABAAAATgAAAAAAAACQAAAAAQAAAJAAAAABAAOShgAHAAAAEgAAAHigAgAEAAAAAQAAAnCgAwAEAAAAAQAAAAQAAAAAQVNDSUkAAABTY3JlZW5zaG90GDQN+gAAAAlwSFlzAAAWJQAAFiUBSVIk8AAAAdRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IlhNUCBDb3JlIDYuMC4wIj4KICAgPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6ZXhpZj0iaHR0cDovL25zLmFkb2JlLmNvbS9leGlmLzEuMC8iPgogICAgICAgICA8ZXhpZjpQaXhlbFlEaW1lbnNpb24+NDwvZXhpZjpQaXhlbFlEaW1lbnNpb24+CiAgICAgICAgIDxleGlmOlBpeGVsWERpbWVuc2lvbj42MjQ8L2V4aWY6UGl4ZWxYRGltZW5zaW9uPgogICAgICAgICA8ZXhpZjpVc2VyQ29tbWVudD5TY3JlZW5zaG90PC9leGlmOlVzZXJDb21tZW50PgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4K2bKhpwAAABxpRE9UAAAAAgAAAAAAAAACAAAAKAAAAAIAAAACAAAAb2YKIP0AAAA7SURBVGgF7NaxCQAACAMw3fz/XBcFvxDSC0q6NDtqQggQIECAAAECBN4IpAP3ZitFCRAgQIAAAQInsAAAAP//w+njlQAAADhJREFU7daxCQAACAMw3fz/XBcFvxDSC0q6NDtqQggQIECAAAECBN4IpAP3ZitFCRAgQIAAAQInsPVNCAk049E3AAAAAElFTkSuQmCC";

wordCellTemplateStatic[wordType.红头文件标头] = {
  lineNumber: (cell: wordObjCellTemplate) => {
    const a = (cell.word.length / 7).toFixed() as unknown as number;
    return a * 2 + 3;
  },
  function: (cell, data = {}) => {
    return `<p class=MsoNormal style="line-height:26.0000pt;mso-line-height-rule:exactly;"><span style="mso-spacerun:'yes';font-family:仿宋_GB2312;mso-hansi-font-family:华文中宋;
mso-bidi-font-family:'Times New Roman';color:rgb(255,0,0);mso-bidi-font-weight:bold;
font-size:16.0000pt;mso-font-kerning:1.0000pt;">
				<o:p></o:p>
			</span></p>
		<p class=MsoNormal align=center style="text-align:center;line-height:100%;">
        <b style="mso-bidi-font-weight:normal"><span style="mso-spacerun:'yes';font-family:新宋体;mso-bidi-font-family:'Times New Roman';
line-height:100%;color:rgb(255,0,0);letter-spacing:7.0000pt;padding-left:7pt
mso-ansi-font-weight:bold;font-size:48.0000pt;mso-font-kerning:0.0000pt;">
					<font face="新宋体">${cell.word}</font>
				</span></b></p>
			<img
            style="width:100%;height:100%"
				src="${image}" />
                `;
  },
};

wordCellTemplateStatic[wordType.正文标题] = {
  lineNumber: (cell: wordObjCellTemplate) => {
    const max = 21;
    const word = cell.word;
    let num = 0;
    word.split("").map((x) => {
      const reg = /[^\x00-\xff]/;
      if (reg.test(x)) num++;
      else num += 0.5;
    });
    if (num % 1 == 0.5) num += 0.5;
    return Math.ceil(num / max) + 1;
  },
  function: (cell, data = {}) => {
    return `<p class=MsoNormal style="line-height:26.0000pt;mso-line-height-rule:exactly;"><span style="mso-spacerun:'yes';font-family:仿宋_GB2312;mso-hansi-font-family:华文中宋;
mso-bidi-font-family:'Times New Roman';color:rgb(255,0,0);mso-bidi-font-weight:bold;
font-size:16.0000pt;mso-font-kerning:1.0000pt;">
				<o:p></o:p>
			</span></p>

            <p class=MsoNormal align=center style="word-break:break-all;text-align:center;line-height:25.0000pt;
mso-line-height-rule:exactly;"><span style="mso-spacerun:'yes';font-family:方正小标宋简体;mso-hansi-font-family:Calibri;
mso-bidi-font-family:'Times New Roman';letter-spacing:-0.8500pt;font-size:22.0000pt;
mso-font-kerning:1.0000pt;">
				<font face="方正小标宋简体">${cell.word}</font>
                </span>
                </p>
                	<p class=MsoNormal style="layout-grid-mode:char;line-height:25.0000pt;mso-line-height-rule:exactly;"><span
				style="mso-spacerun:'yes';font-family:仿宋_GB2312;mso-hansi-font-family:宋体;
font-size:16.0000pt;mso-font-kerning:1.0000pt;">&nbsp;</span><span style="mso-spacerun:'yes';font-family:仿宋_GB2312;mso-hansi-font-family:宋体;
font-size:16.0000pt;mso-font-kerning:1.0000pt;">
				<o:p></o:p>
			</span></p>`;
  },
};

wordCellTemplateStatic[wordType.告知对象] = {
  lineNumber: (cell: wordObjCellTemplate) => {
    return 1;
  },
  function: (cell, data = {}) => {
    return `
    	<p class=MsoNormal style="layout-grid-mode:char;line-height:28.0000pt;mso-line-height-rule:exactly;"><span
				style="mso-spacerun:'yes';font-family:仿宋_GB2312;mso-hansi-font-family:宋体;
font-size:16.0000pt;mso-font-kerning:1.0000pt;">
				<font face="仿宋_GB2312">${cell.word}</font>
			</span><span style="mso-spacerun:'yes';font-family:仿宋_GB2312;mso-hansi-font-family:宋体;
font-size:16.0000pt;mso-font-kerning:1.0000pt;">
				<font face="仿宋_GB2312">：</font>
			</span><span style="mso-spacerun:'yes';font-family:仿宋_GB2312;mso-hansi-font-family:宋体;
font-size:16.0000pt;mso-font-kerning:1.0000pt;">
				<o:p></o:p>
			</span></p>
        `;
  },
};

wordCellTemplateStatic[wordType.正文段落] = {
  lineNumber: (cell: wordObjCellTemplate) => {
    const max = 29;
    const word = cell.word;
    let num = 2;
    word.split("").map((x) => {
      const reg = /[^\x00-\xff]/;
      if (reg.test(x)) num++;
      else num += 0.5;
    });
    if (num % 1 == 0.5) num += 0.5;
    return Math.ceil(num / max);
  },
  function: (cell, data = {}) => {
    return `
  <p class=MsoNormal style="text-indent:32.2500pt;line-height:27.0000pt;mso-line-height-rule:exactly;"><span
				style="mso-spacerun:'yes';font-family:仿宋_GB2312;mso-hansi-font-family:宋体;
font-size:16.0000pt;mso-font-kerning:1.0000pt;">
				<font face="仿宋_GB2312">
                ${cell.word}
                </font></span></p>
`;
  },
};

wordCellTemplateStatic[wordType.换行] = {
  lineNumber: (word: wordObjCellTemplate) => {
    return 1;
  },
  function: (cell, data = {}) => {
    return `
<p class=MsoNormal style="text-indent:32.2500pt;line-height:27.0000pt;mso-line-height-rule:exactly;"><span
				style="mso-spacerun:'yes';font-family:仿宋_GB2312;mso-hansi-font-family:Calibri;
mso-bidi-font-family:'Times New Roman';color:rgb(0,0,0);font-size:16.0000pt;
mso-font-kerning:1.0000pt;">
				<o:p>&nbsp;</o:p>
			</span></p>
`;
  },
};

wordCellTemplateStatic[wordType.落款] = {
  lineNumber: (cell: wordObjCellTemplate) => {
    return 2;
  },
  function: (cell, data = {}) => {
    return `
        	<p class=MsoNormal style="text-indent:32.2500pt;line-height:27.0000pt;mso-line-height-rule:exactly;text-align:right"><span
				style="mso-spacerun:'yes';font-family:仿宋_GB2312;mso-hansi-font-family:Calibri;
mso-bidi-font-family:'Times New Roman';font-size:16.0000pt;mso-font-kerning:1.0000pt;">
				<font face="仿宋_GB2312">${cell.word}</font>
			</span><span style="mso-spacerun:'yes';font-family:仿宋_GB2312;mso-hansi-font-family:Calibri;
mso-bidi-font-family:'Times New Roman';font-size:16.0000pt;mso-font-kerning:1.0000pt;">
				<o:p></o:p>
			</span></p>
		<p class=MsoNormal style="text-indent:32.2500pt;line-height:27.0000pt;mso-line-height-rule:exactly;text-align:right"><span
				style="mso-spacerun:'yes';font-family:仿宋_GB2312;mso-hansi-font-family:Calibri;
mso-bidi-font-family:'Times New Roman';font-size:16.0000pt;mso-font-kerning:1.0000pt;">
				<font face="仿宋_GB2312">${
          new Date(cell.date)
            .toLocaleDateString()
            .split("/")
            .map((x, i) => {
              return x + "年月日"[i];
            })
            .join("") || ""
        }</font>
			</span><span style="mso-spacerun:'yes';font-family:仿宋_GB2312;mso-hansi-font-family:Calibri;
mso-bidi-font-family:'Times New Roman';font-size:16.0000pt;mso-font-kerning:1.0000pt;">
				<o:p></o:p>
			</span></p>`;
  },
};

wordCellTemplateStatic[wordType.分页] = {
  lineNumber: (cell: wordObjCellTemplate) => {
    return 1;
  },
  function: (cell, data = {}) => {
    return `<br clear=all style='page-break-before:always' />`;
  },
};

wordCellTemplateStatic[wordType.抄送] = {
  lineNumber: (cell: wordObjCellTemplate) => {
    const max = 29;
    const word = cell.word;
    let num = 0;
    word.split("").map((x) => {
      const reg = /[^\x00-\xff]/;
      if (reg.test(x)) num++;
      else num += 0.5;
    });
    if (num % 1 == 0.5) num += 0.5;
    return Math.ceil(num / max);
  },
  preDealFunc: (
    cell: wordObjCellTemplate,
    cellList: wordObjCellTemplate[],
    word: wordTemplate
  ) => {
    let backCellList = [] as wordObjCellTemplate[];
    let lineNumberCount = 0;
    cellList.map((x) => {
      lineNumberCount =
        wordCellTemplate[x.type].lineNumber(x) * 1 + lineNumberCount * 1;
    });
    const ln_当前页面剩余行数 =
      word.baseWordConfig.lineHeightNumber -
      (lineNumberCount % word.baseWordConfig.lineHeightNumber);
    const ln_抄送需要占据的行数 = wordCellTemplate[cell.type].lineNumber(cell);
    if (ln_抄送需要占据的行数 > ln_当前页面剩余行数 - 2) {
      backCellList.push(wordCellMaker(wordType.分页));
      for (
        let i = 0;
        i < word.baseWordConfig.lineHeightNumber - ln_抄送需要占据的行数;
        i++
      ) {
        backCellList.push(wordCellMaker(wordType.换行));
      }
    } else {
      for (let i = 0; i < ln_当前页面剩余行数 - ln_抄送需要占据的行数; i++) {
        backCellList.push(wordCellMaker(wordType.换行));
      }
    }
    return backCellList;
  },
  function: (cell, data = {}) => {
    return `
  <p class=MsoNormal style="line-height:27.0000pt;mso-line-height-rule:exactly;text-align:center"><span
				style="mso-spacerun:'yes';font-family:仿宋_GB2312;mso-hansi-font-family:宋体;
font-size:16.0000pt;mso-font-kerning:1.0000pt;">
				<font face="仿宋_GB2312">
                ${cell.word}
                </font></span></p>`;
  },
};

export interface table表单_template extends wordObjCellTemplate {
  units: [
    {
      label: string;
      props: [
        {
          label: string;
          value: string;
        }
      ];
    }
  ];
}

function createPropsDetail(label: string, value: string) {
  return `<td width=79 valign=top style="width:79.5000pt;padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ;border-left:1.0000pt solid windowtext;
mso-border-left-alt:0.5000pt solid windowtext;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.5000pt solid windowtext;
border-top:1.0000pt solid windowtext;mso-border-top-alt:0.5000pt solid windowtext;border-bottom:1.0000pt solid windowtext;
mso-border-bottom-alt:0.5000pt solid windowtext;">
						<p class=MsoNormal align=center
							style="text-align:center;line-height:28.0000pt;mso-line-height-rule:exactly;"><span
								style="font-family:黑体;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
								<font face="黑体">${label}</font>
							</span><span class="18"
								style="font-family:'Times New Roman';mso-fareast-font-family:宋体;font-size:10.5000pt;"></span><span
								style="font-family:黑体;font-size:14.0000pt;mso-font-kerning:1.0000pt;">
								<o:p></o:p>
							</span></p>
					</td>
					<td width=238 valign=top style="width:238.5000pt;padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ;border-left:1.0000pt solid windowtext;
mso-border-left-alt:0.5000pt solid windowtext;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.5000pt solid windowtext;
border-top:1.0000pt solid windowtext;mso-border-top-alt:0.5000pt solid windowtext;border-bottom:1.0000pt solid windowtext;
mso-border-bottom-alt:0.5000pt solid windowtext;">
						<p class=MsoNormal style="line-height:28.0000pt;mso-line-height-rule:exactly;"><span
								style="font-family:仿宋_GB2312;font-size:16.0000pt;mso-font-kerning:1.0000pt;">
								<font face="仿宋_GB2312">${value}</font>
					</td>`;
}

wordCellTemplateStatic[wordType.table表单] = {
  lineNumber: (cell: wordObjCellTemplate) => {
    const { units } = cell.data as stringAnyObj;
    let line = 0;
    units.map((x: any) => {
      x.props.map((c: any) => {
        line++;
      });
    });
    return line;
  },
  function: (cell, data = {}) => {
    const formatData = cell.data as table表单_template;
    // 表格内容 // 偷懒了 //@ToDo 使用更优雅的格式
    const content = `
    ${formatData.units
      .map((unit) => {
        const props = unit.props;
        let fuckTableTr = "";
        fuckTableTr += `<tr><td width=106 valign=center rowspan=${
          props.length
        } style="width:106.2000pt;padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt ;border-left:1.0000pt solid windowtext;
mso-border-left-alt:0.5000pt solid windowtext;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.5000pt solid windowtext;
border-top:1.0000pt solid windowtext;mso-border-top-alt:0.5000pt solid windowtext;border-bottom:1.0000pt solid windowtext;
mso-border-bottom-alt:0.5000pt solid windowtext;">
						<p class=MsoNormal align=center
							style="text-align:center;line-height:22.0000pt;mso-line-height-rule:exactly;"><b><span
									style="font-family:宋体;font-weight:bold;font-size:16.0000pt;
mso-font-kerning:1.0000pt;">
									<font face="宋体">${unit.label}</font>
								</span></b><span class="18"
								style="font-family:'Times New Roman';mso-fareast-font-family:宋体;font-size:10.5000pt;"></span><b><span
									style="font-family:宋体;font-weight:bold;font-size:16.0000pt;
mso-font-kerning:1.0000pt;">
									<o:p></o:p>
								</span></b></p>
					</td>${createPropsDetail(props[0].label, props[0].value)}</tr>
          ${props
            .map((x, i) => {
              return i != 0
                ? `<tr>${createPropsDetail(x.label, x.value)}</tr>`
                : "";
            })
            .join("")}`;
        return fuckTableTr;
      })
      .join("")}`;

    // 外框
    const back = `
    	<div align=center>
			<table class=MsoTableGrid border=1 cellspacing=0
				style="border-collapse:collapse;border:none;mso-border-left-alt:0.5000pt solid windowtext;
mso-border-top-alt:0.5000pt solid windowtext;mso-border-right-alt:0.5000pt solid windowtext;mso-border-bottom-alt:0.5000pt solid windowtext;
mso-border-insideh:0.5000pt solid windowtext;mso-border-insidev:0.5000pt solid windowtext;mso-padding-alt:0.0000pt 5.4000pt 0.0000pt 5.4000pt ;">
${content}
</table>
		</div>
    `;
    return back;
  },
};

wordCellTemplateStatic[wordType.附件] = {
  lineNumber: (cell: wordObjCellTemplate) => {
    return 1;
  },
  function: (cell, data = {}) => {
    return `<p class=MsoNormal style="margin-left:63.9500pt;mso-para-margin-left:1.5200gd;text-indent:-48.0000pt;
mso-char-indent-count:-3.0000;line-height:28.0000pt;mso-line-height-rule:exactly;"><span style="mso-spacerun:'yes';font-family:黑体;font-size:16.0000pt;
mso-font-kerning:1.0000pt;">
				<font face="黑体">附件</font>
			</span><span style="mso-spacerun:'yes';font-family:黑体;font-size:16.0000pt;
mso-font-kerning:1.0000pt;">
				<o:p></o:p>
			</span></p>`;
  },
};

wordCellTemplateStatic[wordType.附件标题] = {
  lineNumber: (cell: wordObjCellTemplate) => {
    return 2;
  },
  function: (cell, data = {}) => {
    return `
    <p class=MsoNormal align=center style="text-align:center;line-height:28.0000pt;mso-line-height-rule:exactly;">
			<span style="mso-spacerun:'yes';font-family:方正小标宋简体;font-size:18.0000pt;
mso-font-kerning:1.0000pt;">
				<font face="方正小标宋简体">${cell.word}</font>
			</span><span style="mso-spacerun:'yes';font-family:方正小标宋简体;font-size:18.0000pt;
mso-font-kerning:1.0000pt;">
			</span>
		</p>
    <p class=MsoNormal align=center style="margin-left:69.9500pt;mso-para-margin-left:1.5200gd;text-indent:-54.0000pt;
mso-char-indent-count:-3.0000;text-align:center;line-height:28.0000pt;
mso-line-height-rule:exactly;"><span style="mso-spacerun:'yes';font-family:方正小标宋简体;font-size:18.0000pt;
mso-font-kerning:1.0000pt;">&nbsp;</span><span style="mso-spacerun:'yes';font-family:方正小标宋简体;font-size:18.0000pt;
mso-font-kerning:1.0000pt;">
				<o:p></o:p>
			</span></p>`;
  },
};

wordCellTemplateStatic[wordType.文件函号] = {
  lineNumber: (cell: wordObjCellTemplate) => {
    return 1;
  },
  function: (cell, data = {}) => {
    return `<p class=MsoNormal style="text-align:right;mso-char-indent-count:20.0000;line-height:26.0000pt;
mso-line-height-rule:exactly;"><span style="mso-spacerun:'yes';font-family:仿宋_GB2312;mso-hansi-font-family:宋体;
mso-bidi-font-family:'Times New Roman';color:rgb(0,0,0);mso-bidi-font-weight:bold;
font-size:16.0000pt;mso-font-kerning:1.0000pt;"><span class="msoIns">
						<font face="仿宋_GB2312">${cell.word}</font></span></span></p>`;
  },
};

export const wordCellTemplate = wordCellTemplateStatic;

// 节点文本生成工具
export const wordCellMaker = (
  type: wordType,
  word: string = "",
  options: stringAnyObj = {}
) => {
  return {
    type,
    word,
    ...options,
  } as wordObjCellTemplate;
};
