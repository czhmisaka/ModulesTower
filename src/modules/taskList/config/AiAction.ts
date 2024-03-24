/*
 * @Date: 2024-03-24 01:46:19
 * @LastEditors: CZH
 * @LastEditTime: 2024-03-24 02:59:28
 * @FilePath: /ConfigForDesktopPage/src/modules/taskList/config/AiAction.ts
 */

export const preWord = `
你是一个聪明的工具小管家，能够充分理解用户说的话，并判断用户需要使用哪个工具。
现有工具如下：

查询待办：id=1；参数列表：标题（别名为title），时间（别名为time），数量（别名为pageSize）。
发送邮件：id=2；参数列表：标题（别名为title，必填），内容（别名为content），发送人（别名为send），接收人（别名为receive，必填），抄送人（别名为copy）。
计算器：id=3。
统一搜索：id=4；参数列表：关键词（别名为keyword）。
通讯录：id=5；参数列表：姓名（别名为userName，必填），部门（别名为unitName）。
前往XXXX:id=6；参数列表：页面名称（别名为pageName,必填,可选项：知识库，智能问答，智能写作，管理后台/组织架构/部门与成员管理,管理后台/组织架构/成员字段管理,管理后台/组织架构/角色管理,管理后台/系统监控/操作日志,管理后台/系统监控/定时任务,管理后台/系统监控/服务监控,管理后台/系统监控/接口开发,管理后台/系统监控/Swagger,管理后台/系统设置/菜单管理,管理后台/系统设置/字典管理,管理后台/系统设置/管理员管理,开放平台/集成应用/新增,开放平台/集成应用/查询,开放平台/低代码应用/新增,开放平台/应用分组/新增,开放平台/应用分组/编辑,开放平台/应用分组/删除,测试模块/123/123,测试模块/dfsdf/qweq） 
打开xxx应用:id=7；参数列表：应用列表名称（别名为appName,必填,可选项：xxxx,xxxx,xxxxxx）

Skill：
如果在已有工具中找不到合适的工具，使用自己的话回答。
如果在已有工具中找到合适的工具，判断是否缺少必填参数，如果有提供使用补充；如果不缺少参数则以json格式返回工具的id和参数的别名。
回复精确简短。

Examples:
"查询一下最近10条待办" =>{"id":1,"pageSize":10}
"发一份邮件"=>发送邮件缺少必填信息标题和接收人，请提供相关信息


下面请你理解以下内容，并回答问题：
`;

interface keyWordCellTemplate {
  // 接口用
  key: string;
  // 用户提示用
  label: string;
  // 可选项
  range?: string[];
  // 是否必填
  required?: boolean;
}

// 单一事件节点
interface actionCellTemplate {
  actionType: string;
  // 触发词
  trigger: string[];
  // 关键词
  keyWord: keyWordCellTemplate[];
  // 案例
  example: string;
  // 对应行为
  action?: (that, data) => any | void;
}
const actionCellMaker = (
  actionType: string,
  trigger: string[],
  keyWord: keyWordCellTemplate[],
  example: string,
  action = (that, data) => {}
) => {
  return {
    actionType,
    trigger,
    keyWord,
    example,
    action,
  } as actionCellTemplate;
};

export const action = [
  actionCellMaker(
    "search",
    ["查询xxyy", "搜索xxyy", "检索xxyy"],
    [
      {
        key: "func",
        label: "查询方式",
        range: ["设备", "分组", "事件"],
      },
      {
        key: "key",
        label: "关键词",
      },
    ],
    `"查询温控设备"=>{actionType:'search','func':'设备', 'key':'温控'}`
  ),
  actionCellMaker(
    "go",
    ["前往xx", "去xx"],
    [
      {
        key: "pageName",
        label: "页面名称",
        range: [
          "moduleTower_事件列表",
          "moduleTower_分组列表",
          "moduleTower_设备列表",
        ],
      },
    ],
    `"前往分组"=>{ actionType: "go", pageName: "moduleTower_分组列表"}
    "前往设备"=>{ actionType: "go", pageName: "moduleTower_设备列表"}`,
    (that, data) => {
      const pageName = data.pageName;
      that.$router.push({
        path: "/" + pageName,
      });
    }
  ),
  actionCellMaker(
    "openApp",
    ["打开xx", "去xx"],
    [
      {
        key: "appName",
        label: "应用名称",
        range: ["百度", "文档", "娱乐中心"],
      },
    ],
    '"打开娱乐"=>{ actionType: "openApp", appName: "娱乐中心" }',
    (that, data) => {
      const pageName = data.appName;
      const app = {
        百度: "https://www.baidu.com",
        文档: "http://guild.czht.top",
        娱乐中心: "https://www.4399.com",
      };
      window.open(app[pageName]);
    }
  ),
];

export const useAbleWord = `
你是一个聪明的工具小管家，能够充分理解用户说的话，并判断用户需要使用哪个工具。
现有工具如下：
${action
  .map((x) => {
    return `${x.trigger.join(",")};参数列表: ${x.keyWord
      .map((x) => {
        return `${x.label}（别名为${x.key} ${
          x.range ? "可选项：" + x.range.join(",") : ""
        })`;
      })
      .join(",")}`;
  })
  .join("。\n")}

Skill：
如果在已有工具中找不到合适的工具，使用自己的话回答。
如果在已有工具中找到合适的工具，判断是否缺少必填参数，如果有提供使用补充；如果不缺少参数则以json格式返回工具的id和参数的别名。
回复精确简短。

Examples:
${action.map((x) => x.example).join("\n")}

下面请你理解以下内容，并回答问题：
`;

console.log(useAbleWord);
