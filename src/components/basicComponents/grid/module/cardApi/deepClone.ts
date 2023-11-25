/*
 * @Date: 2022-08-08 15:31:08
 * @LastEditors: CZH
 * @LastEditTime: 2023-08-11 17:27:32
 * @FilePath: /lcdp_fe_setup/src/components/basicComponents/grid/module/cardApi/deepClone.ts
 */
// 判断类型
function getType(target: any) {
  return Object.prototype.toString.call(target).slice(8, -1);
}

// 判断是否是原始类型
function isRefrenceType(target: any) {
  let type = typeof target;
  return target !== null && (type === "object" || type === "function");
}

// 获取原型上的方法
function getInit(target: any) {
  let ClassNames = target.constructor;
  return new ClassNames();
}
//引用类型
const mapTag = "Map";
const setTag = "Set";
const arrayTag = "Array";
const objectTag = "Object";
const AsyncFunction = "AsyncFunction";

//非引用类型
const errorTag = "Error";
const numberTag = "Number";
const dateTag = "Date";
const regexpTag = "RegExp";
const stringTag = "String";
const symbolTag = "Symbol";
const bufferTag = "Uint8Array";

let deepTag = [mapTag, setTag, arrayTag, objectTag];

export function deepClone(target: any, map = new WeakMap()) {
  let type = getType(target);
  let isRefrence = isRefrenceType(target);
  if (!isRefrence) {
    //如果是非引用类型 直接返回
    return target;
  }
  let cloneTarget: any;
  if (deepTag.includes(type)) {
    //如果是引用类型 获取其原型
    cloneTarget = getInit(target);
  }

  if (map.get(target)) {
    //防止存在循环引用
    return map.get(target);
  }
  map.set(target, cloneTarget);

  if (type === mapTag) {
    target.forEach((value: any, key: any) => {
      cloneTarget.set(key, deepClone(value, map));
    });
    return cloneTarget;
  }

  if (type === setTag) {
    target.forEach((value: any) => {
      cloneTarget.add(deepClone(value, map));
    });
    return cloneTarget;
  }

  if (type === arrayTag) {
    target.forEach((value: any, key: any) => {
      cloneTarget[key] = deepClone(value, map);
    });
    return cloneTarget;
  }

  if (type === objectTag) {
    let array = Object.keys(target);
    array.forEach((i, v) => {
      cloneTarget[i] = deepClone(target[i], map);
    });
    return cloneTarget;
  }
}
