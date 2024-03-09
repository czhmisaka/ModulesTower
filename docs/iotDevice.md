<!--
 * @Date: 2024-03-01 16:08:53
 * @LastEditors: CZH
 * @LastEditTime: 2024-03-06 21:01:28
 * @FilePath: /ConfigForDesktopPage/docs/iotDevice.md
-->




# 嵌入式设备对接文档

## 文档阅读前须知
1. 由于作者自学嵌入式，水平实在不咋地，Demo开发环境如下：
   1. 硬件平台：esp32系列
   2. 软件平台：MicroPython
2. 阅读本文档需要掌握一定程度的前端开发，和Mqtt接入的知识。
3. esp32设备开发需要烧录等信息此文不再赘述。
4. 本项目目前还在不断的开发中，本文档中所用环境随时可能更新（有问题可以联系作者）。

## 如何注册iot设备
### 接口
1. 请求地址：/admin/iot/iot/registerIotJSON
2. 参数参考 
```microPython
myProfile = {
    'name':"测试用esp32",
    "nameEn":"esp32En",
    "description":"esp32",
    "service":[{
        type:'sendMsg',
        sendKey:'$|mainTopic|/report'
    }],
    "gridCell":[{
        'data': {
            'props':{
                'label': 'LED_1'
            }
        },
        'preKey':"led1",
        'type':'switchCard',
        'gridInfo': {'width': 1,'height': 1,'x': 4,'y': 3},
    },
    {
        'data': {
            'props':{
                'label': 'LED_2'
            }
        },
        'preKey':"led2",
        'type':'switchCard',
        'gridInfo': {'width': 1,'height': 1,'x': 5,'y': 3},
    },
    {
        'data':{
             'props':{
                'label': '系统信息',
                'PropsLabel':{
                    'CPU':'CPU频率',
                    "RAM":'可用内存',
                }
            }
        },
        'type':'infoCard',
        'getKey':'$|mainTopic|/report',
        'gridInfo': {'width': 3,'height': 1,'x': 4,'y': 0},
    },]
}

```



## 案例
### 温湿度监控案例 （硬件：Esp32c3 + aht20&bmp280 模块）


#### 硬件连接示意

#### 代码
```microPython
```


## 如何开发前后端
### 后端开发
这里后端开发用的是 cool-admin-midway套件，非常好用，强烈推荐
