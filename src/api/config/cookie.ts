/*
 * @Date: 2022-04-05 01:23:25
 * @LastEditors: CZH
 * @LastEditTime: 2022-04-05 09:45:12
 * @FilePath: /configforpagedemo/src/api/config/cookie.ts
 */



//写Cookie
export function addCookie(objName: string, objValue: string) {
    let str = objName + "=" + escape(objValue) + ";path=" + window.location.pathname; //编码
    document.cookie = str
}

//读Cookie
export function getCookie(objName: string) {//获取指定名称的cookie的值
    let arrStr = document.cookie.split("; ");
    for (let i = 0; i < arrStr.length; i++) {
        let  temp = arrStr[i].split("=");
        if (temp[0] == objName) return unescape(temp[1]);  //解码
    }
    return "";
}
// 删除cookie
export function clearCookie(name: string) {
    addCookie(name, "", -1);
}  