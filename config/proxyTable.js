/*
 * @Date: 2022-04-05 09:56:17
 * @LastEditors: CZH
 * @LastEditTime: 2022-04-05 14:43:15
 * @FilePath: /configforpagedemo/config/proxyTable.js
 */



const proxyTemplate_dev = {
    name: 'dev',
    target: 'http://localhost:8000/',
    changeOrigin: true,
    ws: true,
    pathRewrite: {

    }
}

const proxyTemplate_prod = {
    name: 'dev',
    target: 'http://localhost:8000/',
    changeOrigin: true,
    ws: true,
    pathRewrite: {

    }
}

const proxyMap = { proxyTemplate_dev, proxyTemplate_prod }

/**
 * @name: proxyObjCreate
 * @description: 创建代理对象
 * @authors: CZH
 * @Date: 2022-04-05 14:20:54
 * @param {Array} proxyList
 * @param {string} env
 */
function proxyObjCreate(proxyList = [], env = 'dev') {
    let proxy = {}
    let proxyTemplate = {}
    for (let x in proxyMap) {
        if (x.split('_')[1] == env) {
            proxyTemplate = proxyMap[x]
        }
    }
    proxyList.map(x => {
        proxy[x] = proxyTemplate
    })
    return proxy
}

module.exports = proxyObjCreate