/*
 * @Date: 2022-11-09 17:19:16
 * @LastEditors: CZH
 * @LastEditTime: 2022-11-25 11:22:59
 * @FilePath: /configforpagedemo/mock/userManage.ts
 */
// 模拟后端动态生成路由
import { MockMethod } from "vite-plugin-mock";

export enum fakeDataType {
  string = "string",
  number = "number",
  dataString = "dataString",
  longText = "longText",
  boolean = 'boolean',
  mail = 'mail',
  mobile = 'mobile'
}

/**
 * @name: fakerDataMaker
 * @description: 假数据生成函数
 * @authors: CZH
 * @Date: 2022-11-10 15:52:00
 */
export const fakerDataMaker = (obj: { [key: string]: fakeDataType }) => {
  let backData = {} as { [key: string]: any }
  for (let x in obj) {
    switch (obj[x]) {

      case fakeDataType.number:
        backData[x] = Math.floor(Math.random() * 1000000);
        break;

      case fakeDataType.dataString:
        backData[x] = new Date(Math.random() * new Date().getTime()).getTime() + '';
        break;

      case fakeDataType.string:
        backData[x] = randomString(Math.floor(Math.random() * 20 + 1))
        break;

      case fakeDataType.longText:
        backData[x] = randomString(400)
        break;

      case fakeDataType.boolean:
        backData[x] = Math.random() > 0.5
        break;

      case fakeDataType.mail:
        backData[x] = `${randomEnglishString(Math.random() * 30)}@${randomEnglishString(Math.random() * 10)}.fake`
        break;

      case fakeDataType.mobile:
        backData[x] = randomNumber(13)
        break;


    }
  }
  return backData;
}

export const unitlistMaker = (numbers) => {
  let template = {
    id: fakeDataType.number,
    createUserId: fakeDataType.number,
    createTime: fakeDataType.dataString,
    updateUserId: fakeDataType.number,
    updateTime: fakeDataType.dataString,
    orderNumber: fakeDataType.number,
    top: fakeDataType.string,
    deleted: fakeDataType.string,
    name: fakeDataType.string,
    description: fakeDataType.string,
    parentId: fakeDataType.number,
    parentIds: fakeDataType.string,
    parentNames: fakeDataType.string,
    regionId: fakeDataType.number,
    zzdCode: fakeDataType.number,
  }
  let unitList = []
  for (let i = 0; i < numbers; i++) {
    unitList.push(fakerDataMaker(template))
  }
  unitList.map((x, i) => {
    if (i > 0 && i % 2 == 0)
      unitList[i].parentId = unitList[i - 1].id
  })
  return unitList;
}


export const userListMaker = (number) => {
  let template = {
    name: fakeDataType.string,
    gender: fakeDataType.number,
    icon: fakeDataType.longText,
    description: fakeDataType.longText,
    adminFlag: fakeDataType.boolean,
    mobile: fakeDataType.mobile,
    idCard:fakeDataType.mobile,
    zzdCode:fakeDataType.number
  }
  let unitList = []
  for (let i = 0; i < number; i++) {
    unitList.push(fakerDataMaker(template))
  }
  return unitList;
}






function randomNum(min, max) {
  return Math.floor(Math.random() * (min - max) + max)
}

// 解码Unicode
function solveUnicode(str) {
  //Unicode显示方式是\u4e00
  str = "\\u" + str
  str = str.replace(/\\/g, "%");
  //转换中文
  str = unescape(str);
  //将其他受影响的转换回原来
  str = str.replace(/%/g, "\\");
  return str;
}
//生成随机汉字包括生僻字
function randomName(length) {
  let name = ""
  for (let i = 0; i < length; i++) {
    let unicodeNum = ""
    unicodeNum = randomNum(0x4e00, 0x9fa5).toString(16)
    name += solveUnicode(unicodeNum)
  }
  return name
}
//随机自定义长度包含中文字的字符串
function randomString(length) {
  var str = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  str += randomName(24)
  var result = '';
  for (var i = length; i > 0; --i)
    result += str[Math.floor(Math.random() * str.length)];
  return result;
}

function randomEnglishString(length) {
  let str = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += str[Math.floor(Math.random() * str.length)]
  }
  return result
}


function randomNumber(length) {
  let str = '1234567890'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += str[Math.floor(Math.random() * str.length)]
  }
  return result
}
