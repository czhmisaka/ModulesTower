<template>
    <div class="taskDetail">
        <div class="serverBasicInfo">
            <div class="serverInfoCard" v-for="(item, index) in basicList" :key="index + 'item'">
                <div class="serverTitle">{{ item.title }}</div>
                <div class="serverInfo" v-for="(list, i) in item.basicInfoList" :key="i + 'list'">
                    <div class="leftTitle">{{ list.name }}</div>
                    <div class="rightContent">{{ this[item.obj][list.key] }}</div>
                </div>
            </div>
        </div>
        <div class="JVMBasic">
            <div class="JVMTitle">JVM</div>
            <div class="JVMContent">
                <div class="JVMItem" v-for="(item, index) in JVMList" :key="index + 'jvm'">

                    <div class="JVMLabel">{{ item.title }}</div>
                    <div class="JVMValue">{{ JVMInfo[item.key] }}</div>

                </div>
            </div>
        </div>
        <div class="JVMBasic">
            <div class="JVMTitle">磁盘信息</div>
            <div class="tableList">
                <el-table :data="tableData" :border="true">
                    <el-table-column v-for="(item, index) in columns" :key="index + 'columns'" :prop="item.props"
                        :label="item.title">
                    </el-table-column>

                </el-table>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {
    componentInfo,
    inputType,
    propInfo,
    gridSizeMaker,
} from "@/components/basicComponents/grid/module/dataTemplate";
import { post, get } from "@/utils/api/requests";
export default defineComponent({
    componentInfo: {
        labelNameCN: "监控任务详情页面",
        key: "taskDetail",
        description:
            "",
        gridInfo: {
            middle: gridSizeMaker(9, 8),
        },
    } as componentInfo,
    propsDetail: {

    } as propInfo,
    baseProps: {

    },
    name: 'taskDetail',
    data() {
        return {
            columns: [{
                title: '盘符路径',
                props: 'dirName'
            }, {
                title: '文件系统',
                props: 'sysTypeName'
            }, {
                title: '盘符类型',
                props: 'typeName'
            }, {
                title: '总大小(byte)',
                props: 'total'
            }, {
                title: '可用大小(byte)',
                props: 'free'
            }, {
                title: '已用大小(byte)',
                props: 'used'
            }, {
                title: '已用百分比',
                props: 'usage'
            }],
            sys: {},
            mem: {},
            cpu: {},
            basicList: [
                {
                    title: "服务器信息",
                    obj: 'sys',
                    basicInfoList: [
                        {
                            name: '服务器名称：',
                            key: 'computerName'
                        },
                        {
                            name: '服务器IP：',
                            key: 'computerIp'
                        },
                        {
                            name: '操作系统：',
                            key: 'osName'
                        },
                        {
                            name: '系统架构：',
                            key: 'osArch'
                        },
                    ]
                },
                {
                    title: '内存',
                    obj: 'mem',
                    basicInfoList: [
                        {
                            name: '总内存(byte)：',
                            key: 'total'
                        },
                        {
                            name: '已用内存(byte)：',
                            key: 'used'
                        },
                        {
                            name: '剩余内存(byte)：',
                            key: 'free'
                        },
                        {
                            name: '使用率：',
                            key: 'usage'
                        },
                    ]
                },
                {
                    title: 'CPU',
                    obj: 'cpu',
                    basicInfoList: [
                        {
                            name: '核心数：',
                            key: 'cpuNum'
                        },
                        {
                            name: '用户使用率：',
                            key: 'used'
                        },
                        {
                            name: '系统使用率：',
                            key: 'sys'
                        },
                        {
                            name: '当前空闲率：',
                            key: 'free'
                        },
                    ]
                }
            ],
            tableData: [],
            JVMList: [{
                title: 'Java名称',
                key: 'name'
            }, {
                title: 'Java版本',
                key: 'version'
            }, {
                title: '启动时间',
                key: 'startTime'
            }, {
                title: '运行时长',
                key: 'runTime'
            }, {
                title: '总内存(byte)',
                key: 'total'
            }, {
                title: '已用内存(byte)',
                key: 'used'
            }, {
                title: '安装路径',
                key: ''
            }, {
                title: '项目路径',
                key: 'home'
            }, {
                title: '运行参数',
                key: 'inputArgs'
            }, {
                title: ' ',
                key: ' '
            }],
            JVMInfo: {

            }
        }
    },
    methods: {
        async getBasicInfo() {
            const res = await get('/web/sys/monitor/server', {})
            const cpuData = res.data.cpu;
            this.cpu = {
                free: (cpuData.free * 100).toFixed(2) + '%',
                sys: (cpuData.sys * 100).toFixed(2) + '%',
                used: (cpuData.used * 100).toFixed(2) + '%',
                cpuNum: cpuData.cpuNum
            }
            res.data.cpu;
            this.mem = res.data.mem;
            this.mem.usage = (this.mem.usage * 100).toFixed(2) + '%'
            this.sys = res.data.sys
            this.JVMInfo = res.data.jvm;
            this.JVMInfo.startTime = new Date(this.JVMInfo.startTime).toLocaleString()
            this.tableData = res.data.sysFiles || []
            this.tableData.forEach(item => {
                item.usage = item.usage + '%'
            })

        }
    },
    async mounted() {
        await this.getBasicInfo()
        this.$emit("ready");
    }
})
</script>

<style lang="scss" scoped>
.taskDetail {
    width: 100%;
    height: 100%;
    overflow: hidden;
    overflow-y: auto;
    background: white;
    border-radius: 6px;

    .serverBasicInfo {
        padding-right: 12px;
        display: flex;

        .serverInfoCard {
            flex: 1;
            margin: 12px;
            margin-right: 0;
            border: 1px solid #ddd;
            border-radius: 6px;
            text-align: left;
            padding: 12px;

            .serverTitle {
                font-size: 18px;
                font-weight: 600;
            }

            .serverInfo {
                display: flex;
                line-height: 32px;
                font-size: 14px;

                .leftTitle {
                    width: 110px;
                    font-weight: 600;
                    text-align: right;
                }

                .rightContent {
                    // flex:1;
                }
            }
        }
    }

    .JVMBasic {
        width: calc(100% - 12px);
        padding: 12px;
        border-radius: 6px;
        border: 1px solid #ddd;
        margin: 0 12px;
        margin-bottom: 12px;

        .JVMTitle {
            text-align: left;
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 12px;
        }

        .JVMContent {
            display: flex;
            width: 100%;
            text-align: left;
            flex-wrap: wrap;
            border-top: 1px solid #ddd;
            border-left: 1px solid #ddd;

            .JVMItem {
                width: 50%;
                display: flex;
                font-size: 14px;

                .JVMLabel {
                    width: 120px;
                    font-weight: 600;
                    padding: 12px;
                    border-bottom: 1px solid #ddd;
                    border-right: 1px solid #ddd;
                }

                .JVMValue {
                    flex: 1;
                    padding: 12px;
                    border-bottom: 1px solid #ddd;
                    border-right: 1px solid #ddd;
                    word-break: break-all;
                }
            }
        }
    }

    :deep(.el-table__header) {
        tr {
            th {
                color: black !important;
            }
        }
    }
}
</style>