/*
 * @Date: 2022-10-10 17:20:54
 * @LastEditors: CZH
 * @LastEditTime: 2022-10-10 17:24:44
 * @FilePath: /configforpagedemo/src/components/basicComponents/cell/info/infoFile/fileType.ts
 */


export enum fileType {
    file = 'file',
    folder = 'folder'
}


export interface fileTemplate {
    name: string,
    type: fileType,
    detail:{[key:string]:any},
}

export const fileActionByFileType = {}