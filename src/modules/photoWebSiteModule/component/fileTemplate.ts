/*
 * @Date: 2022-10-26 10:16:01
 * @LastEditors: CZH
 * @LastEditTime: 2022-10-26 10:17:57
 * @FilePath: /configforpagedemo/src/modules/minio/component/fileTemplate.ts
 */






export enum fileType {
    file = 'file',
    folder = 'folder'
}


/**
 * @name: MinioFileTemplate
 * @description: minio 文件对象
 * @authors: CZH
 * @Date: 2022-10-26 10:16:58
 */
export interface MinioFileTemplate {
    name: string,
    type: fileType,
    info: { [key: string]: any },
    detail: { [key: string]: any },
}