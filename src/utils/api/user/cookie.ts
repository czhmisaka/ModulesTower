/*
 * @Date: 2022-01-26 19:13:42
 * @LastEditors: CZH
 * @LastEditTime: 2022-10-09 14:35:30
 * @FilePath: /o2oaweb/src/utils/cookie.ts
 */



//写Cookie
export function addCookie(objName: string, objValue: string, objHours: number) {
    var str = objName + "=" + objValue + ";path=" + window.location.pathname; //编码
    document.cookie = str
}

//读Cookie
export function getCookie(objName: string) {//获取指定名称的cookie的值
    var arrStr = document.cookie.split("; ");
    for (var i = 0; i < arrStr.length; i++) {
        var temp = arrStr[i].split("=");
        if (temp[0] == objName) {
            // if (objName == "x-token") {
            //     return temp[1] ? decodeURI(temp[1]) + ':' + (new Date().getTime() / 1000).toFixed(0) : ''
            // }
            return decodeURI(temp[1]);
        } //解码
    }
    return "";
}
// 删除cookie
export function clearCookie(name: string) {
    addCookie(name, "", -1);
}


// 获取 token 不加密
export function getTokenCookie(objName: string) {
    var arrStr = document.cookie.split("; ");
    for (var i = 0; i < arrStr.length; i++) {
        var temp = arrStr[i].split("=");
        if (temp[0] == objName) {
            return decodeURI(temp[1]);
        } //解码
    }
    return "";
}