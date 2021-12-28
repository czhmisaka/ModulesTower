<!--
 * @Author: czh
 * @Date: 2021-08-30 16:59:49
-->
<template>
    <div class="content-container">
        <!-- 基础信息展示区域 -->
        <span v-if="basicInfoConfig&&basicInfoConfig.length>0">
            <el-card class="search-config" v-for="(main,index) in basicInfoConfig" :key="index+main">
                <div class="flex flex-start">
                    <div class="flex-column flex-start" style="width:100%">
                        <InfoBlockByTemplate :infoDataTemplate="main" :sourceData="detailData" v-if="detailData" />
                    </div>
                </div>
            </el-card>
        </span>
        <!-- 基础信息展示区域 -->
        <!-- 搜索区域 显示对应配置项 queryItemOptions 选择用数据存配置项 apiConfig.queryItemApiConfig -->
        <el-card class="search-config" v-if="queryItemOptions&&queryItemOptions.length>0">
            <div slot="header">
                <span class="cardHeader">搜索</span>
                <br>
            </div>
            <el-form @submit.native.prevent :inline="true" :model="queryOption" label-suffix=":" label-width="120px"
                label-position="right" class="demo-form-inline" size="mini">
                <el-form-item v-for="(item,index) in queryItemOptions" :key="item.prop+index" :label="item.label">
                    <el-select clearable v-model="queryOption[item.prop]" v-if="item.type==='select'"
                        :placeholder="'请选择'+item.label">
                        <el-option v-for="(it,ind) in queryItemConfig[item.prop]" :key="ind" :label="it.label"
                            :value="it.value">
                        </el-option>
                    </el-select>
                    <el-select clearable v-model="queryOption[item.prop]" v-if="item.type==='selects'"
                        :placeholder="'请选择'+item.label" multiple collapse-tags>
                        <el-option v-for="(it,ind) in queryItemConfig[item.prop]" :key="ind" :label="it.label"
                            :value="it.value">
                        </el-option>
                    </el-select>
                    <el-select style="width:auto" v-if="item.type==='inputList'" v-model="queryOption[item.prop]"
                        multiple clearable filterable allow-create default-first-option collapse-tags
                        :placeholder="item.label" @change="batchInput('queryOption',item.prop)">
                        <el-option v-for="item in queryOption[item.prop]" :key="item" :label="item" :value="item">
                        </el-option>
                    </el-select>
                    <el-input v-model="queryOption[item.prop]" v-if="item.type==='input'" :placeholder="item.label">
                    </el-input>
                    <el-cascader v-if="item.type==='areaCascader'" :options="queryItemConfig[item.prop]"
                        :props="{ expandTrigger: 'hover' ,value:'id',label:'nameEn',multiple: true }"
                        style="width:485px" :placeholder="'请选择'+item.label" collapse-tags clearable
                        @change="areaHandleChange" filterable>
                        <template slot-scope="{ node, data }">
                            <span>{{ data.nameEn }}</span>
                            <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
                        </template>
                    </el-cascader>
                    <el-date-picker v-if="item.type=='datePicker'" v-model="queryOption[item.prop]"
                        :type="item.component&&item.component.Type?item.component.Type:'datetime'" :picker-options="{}"
                        range-separator="-" start-placeholder="StartTime" end-placeholder="EndTime" align="right"
                        :value-format="item.component.valueFormat">
                    </el-date-picker>
                </el-form-item>
                <el-form-item style="float:right">
                    <el-button type="primary" @click="onSearch">
                        {{"查询"}}</el-button>
                    <el-button type="primary" @click="clearQueryOption">
                        {{'重置'}}</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <!-- 搜索区域 结束 -->

        <!-- 导入进度 -->
        <el-card class="search-result" v-if="uploadFileStatus.length>0">
            <b slot="header">
                {{ '导入进度'}}</b>
            <span v-for="(item,index) in uploadFileStatus" :key="index">
                <div v-if="!item.download&&!item.finish">
                    <div>{{item.fileName}}</div>
                    <el-progress :text-inside="true" :stroke-width="14" :percentage="item.process"
                        style="font-size:10px;line-height:14px;margin:10px 0px;"
                        :format="(e)=>{return item.fileName+` (${e.toFixed(1)+' '}%)`}">
                    </el-progress>
                </div>
                <div v-if="item.download">
                    <el-popover placement="top-start" :title="'「'+item.fileName+'」'" trigger="hover">
                        <el-button slot="reference" type="success" icon='el-icon-download'
                            @click="downloadBatchPositionImportResult(item,index)"
                            style="float:left;margin:10px;margin-left:0px;padding:10px;margin-top:0px;">
                            {{item.fileName}}【{{$DateFormat(item.timeTick)}}】
                        </el-button>
                        <p> {{'结果文件保留十分钟，请尽快下载。'}}
                        </p>
                    </el-popover>
                </div>
            </span>
        </el-card>
        <!-- 导入进度 结束-->

        <el-card class="search-result" v-if="dataList.data">
            <!-- 特殊操作按钮区域 相关配置项 1.按钮列表 actionButtonList 2. 列名配置项 tableColumn -->
            <el-header style="padding-left:0px;height: auto;padding-right:0px">
                <span v-for="(item,index) in actionButtonList" v-bind:key="index" style="display:inline-block">
                    <el-upload :on-success="(e)=>{uploadExcelTemplate(e,item)}" class="action-button"
                        :show-file-list="false" @ v-if="item.actionType=='uploadExcelTemplate'" :action="apiUpload"
                        :accept="item.accept" list-type="none">
                        <el-button :type="item.type" :icon="item.icon">{{item.name}}</el-button>
                    </el-upload>
                    <el-button v-else class="action-button" :type="item.type" :icon="item.icon"
                        @click="clickActionButton(item)"
                        :disabled="item.isDisable?selectedList.length>0?false:true:false">
                        {{item.name}}
                    </el-button>
                </span>
                <el-button
                    v-if="config.moduleConfig&&config.moduleConfig.feature&&config.moduleConfig.feature.positionListMap"
                    style="float:right;margin:0px 0px 0px 10px;" class="action-button" type="primary"
                    icon="el-icon-location"
                    @click="navTo({path:'/pudoPosition/map',query:{...config.moduleConfig.feature.positionListMap.query,id:selectedList.map(function(elem){return elem.id})}})">
                    {{"地图模式"}}
                </el-button>
                <el-select v-model="tableColumnCheckList" multiple collapse-tags
                    style="float:right;margin-right:0px;margin-bottom:10px;display:inline-block;" class="el-select-fit"
                    :placeholder="'选择列表展示项'" @change="tableVisibleChange">
                    <el-option v-for="(item,index) in tableColumn" :key="item.value+index" :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-header>
            <!-- 特殊操作按钮区域 结束 -->

            <!-- 搜索结果区域 列表展示区域 相关配置项 1.自定义操作按钮配置 apiConfig.dealTool  2.主搜索函数配置 apiConfig.onSearch & apiConfig.root 3.替换用参数数据配置 apiConfig.queryItemApiConfig  -->
            <el-table v-if="tableColumn&&tableColumn.length>0&&dataList.data" ref="tableController"
                :data="dataInPageList" @selection-change="selectPosition" border stripe v-loading="loading"
                style="cursor:default" @cell-dblclick="showDetail" :row-style="{'min-height':'60px'}">
                <el-table-column type="selection" align="center" width="55" fixed='left' style="min-height:100px">
                </el-table-column>
                <div v-for="(item,index) in tableColumnList" v-bind:key="item.label+index">
                    <el-table-column v-if="item.selectable" :filters="filtersList[item.prop]"
                        :filter-method="filterByProp" width="160" :label="item.label" :prop="item.prop"
                        :sortable="item.sortable">
                        <template slot-scope="scope">
                            <span v-if="item.template">
                                <span v-for="(it) in item.template" v-bind:key="it">
                                    <span>{{it.key?scope.row[it.key]?scope.row[it.key]:it.value:it.value}}</span>
                                </span>
                            </span>
                            <span v-else>
                                {{scope.row[item.prop]}}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column v-if="item.backUpProp&&!item.selectable" width="180" :label="item.label"
                        :prop="item.prop" :sortable="item.sortable">
                        <template slot-scope="scope">
                            <span v-if="scope.row[item.prop]">
                                <span v-for="(it,ind) in item.template" v-bind:key="ind+''">
                                    <span>{{it.key?(scope.row[it.key]?scope.row[it.key]:it.value):it.value}}</span>
                                </span>
                            </span>
                            <span v-else>
                                <span v-for="(it,ind) in item.backUpTemplate" v-bind:key="ind+''">
                                    <span>{{it.key?(scope.row[it.key]?scope.row[it.key]:it.value):it.value}}</span>
                                </span>
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column v-if="!item.backUpProp&&!item.selectable" width="200" :label="item.label"
                        :prop="item.prop" :sortable="item.sortable">
                        <template slot-scope="scope">
                            <span v-if="item.template">
                                <span v-for="(it,ind) in item.template" v-bind:key="ind+''">
                                    <span>{{it.key?(scope.row[it.key]?scope.row[it.key]:it.value):it.value}}</span>
                                </span>
                            </span>
                            <span v-else>
                                {{scope.row[item.prop]}}
                            </span>
                        </template>
                    </el-table-column>
                </div>
                <el-table-column fixed="right" label="操作"
                    v-if="config.apiConfig.dealTool&&config.apiConfig.dealTool.length>0"
                    :width="config.apiConfig.dealTool_width||'80px'">
                    <template slot-scope="scope" style="margin-right:10px;">
                        <span v-for="(it,ind) in config.apiConfig.dealTool" :key="it.name+ind">
                            <el-button size="mini" :type="it.type" :style="it.style"
                                @click="(e)=>{dealTool_apiButton(scope,it,ind)}">
                                {{it.name}}
                            </el-button>
                        </span>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 搜索结果区域 结束 -->

            <!-- 前端分页组件处理 开始-->
            <el-pagination class="page-footer" v-if="dataList.data" @size-change="handleSizeChange"
                @current-change="handleCurrentChange" current-page.sync="0" :page-sizes="pageConfig.select"
                :page-size="pageConfig.pageSize" layout="sizes, prev, pager, next" :total="dataList.data.length">
            </el-pagination>
            <!-- 前端分页组件处理 结束-->


            <!-- 导出组件 -->
            <ExportTable ref="EXPORTTABLE" :config="config" @needRefresh='needRefresh'
                :selectedLists="selectedList.length>0?selectedList:dataList.data" :queryOption="queryOption">
            </ExportTable>
            <!-- 导出组件 -->

            <!-- DealElement 组件 -->
            <DealElement ref="DEALELEMENT" :config="config" :actionButtonCell="actionButtonCell"
                @needRefresh='needRefresh' :selectedLists="selectedList">
            </DealElement>
            <!-- DealElement 组件 -->

            <!-- 详情弹窗组件 -->
            <el-drawer @close='beforeClose' :title="showDetailControl.id+''" :visible.sync="showDetailControl.show"
                direction="rtl" size="63.5%" style="width:100%;height:100%;overflow-x:hidden;" class="overflowHidden"
                :append-to-body="true">
                <div style="width:100%;height:100%;overflow-x:hidden;padding:30px;z-index:10000" class="scrollStyle">
                    <positionDetail
                        v-if="config.moduleConfig&&config.moduleConfig.type&&config.moduleConfig.type=='point'"
                        :positionIdFromProp='showDetailControl.id'></positionDetail>
                    <AssetsCabinetListDetail
                        v-if="showDetailControl.row&&config.moduleConfig.type&&config.moduleConfig.type=='listDetail'"
                        :tableDetail="showDetailControl.row[config.moduleConfig.listDetail_dataKey]"
                        :tableColumn="config.moduleConfig.listDetail_tableColumn_dataTemplate">
                    </AssetsCabinetListDetail>
                </div>
            </el-drawer>
            <!-- 详情弹窗组件 -->
        </el-card>
    </div>
</template>

<script>
    // 获取一些模板数据
    import config_modules from '@/configs/pageConfigForNormalList/index.js'
    import $i18n from '../../../i18n'
    import PositionDetail from '@/views/position/PositionDetail'

    // 所有放在 @/components/normalListAction/ 文件夹下的组件都会自动注册为全局组件使用（main.js 中的 Util.init(Vue)）
    // 故不再另外引入组件

    // 表格滚动条优化
    let interval = ''
    let el
    let tableBodyWrapDom = document.getElementsByClassName('.el-table__body-wrapper')
    let tableBodyDom = document.getElementsByClassName('.el-table__body')

    function handle(e) {
        if (!el) return
        // top为dom上侧距离可视窗口顶部的值
        if (tableBodyWrapDom) {
            const {
                top: tableBodyDomTop
            } = tableBodyWrapDom.getBoundingClientRect()
            if (tableBodyDomTop > window.innerHeight || tableBodyWrapDom.classList.contains('is-scrolling-none')) {
                // 此时列表在可视窗口的下侧不可见区域，因此不做任何修改
                tableBodyWrapDom.style.height = 'unset'
                tableBodyWrapDom.style.marginBottom = 'unset'
            } else {
                const wrapHeight = Math.min(window.innerHeight - tableBodyDomTop, tableBodyDom.offsetHeight)
                tableBodyWrapDom.style.height = wrapHeight + "px"
                tableBodyWrapDom.style.overFlow = 'hidden'
                if (e && e.target && e.target.className && e.target.className.split(' ')[0] ==
                    'el-table__body-wrapper') {
                    let containDom = document.getElementsByClassName('content-container')[0].parentElement
                    containDom.scrollTop += tableBodyWrapDom.scrollTop * 8
                }
                tableBodyWrapDom.scrollTop = 0
                tableBodyWrapDom.style.marginBottom = (tableBodyDom.offsetHeight - wrapHeight) + 'px'
            }
        }
    }
    // 表格滚动条优化


    export default {
        name: "DetailPage",
        components: {
            PositionDetail
        },

        data() {
            return {
                apiUpload: '/cngpp/cngpp-oc/uploadFiles',
                basicInfoConfig: [],
                path: '',
                config: {},
                tableColumn: [],
                tableColumnList: [],
                tableColumnCheckList: [],
                actionButtonList: [],
                queryItemConfig: {},
                filtersList: {},
                queryOption: {},
                loading: false,
                detailData: {},
                dataList: {
                    data: []
                },
                dataInPageList: [], // 分页显示数据
                pageConfig: {
                    pageSize: 5,
                    pageNum: 0,
                    select: [5, 10, 20, 30, 50]
                }, // 分页组件设置
                dealTool: {
                    loadinglist: {},
                },
                showDetailControl: {
                    show: false,
                    id: ''
                },
                selectedList: [], // 已选择的选项
                actionButtonCell: null, // 当前操作的按钮
                uploadFileStatus: [], // all of data about excel-template importing 
                uploadFileProcess: false
            };
        },

        watch: {
            // 避免同组件页面切换刷新失效
            // 一般需要和主流程保持同步
            async $route(to, from) {
                this.path = to.path
                await this.importConfigs(this.path)
                await this.loadConfigList(); // 加载配置项
                await this.onSearch();
                this.getTableVisibleChangeListFromLocation(); // 加载历史选项
            },
            positionList() {
                this.$nextTick(handle)
            }
        },

        // 按照路由载入对应模块
        async created() {
            this.path = this.$route.path
            interval = setInterval(handle, 1000)
            await this.importConfigs(this.path)
        },

        // 主流程
        async mounted() {
            el = this.$el
            tableBodyWrapDom = el.querySelector('.el-table__body-wrapper')
            tableBodyDom = el.querySelector('.el-table__body')
            window.addEventListener('scroll', handle, true)
            window.addEventListener('resize', handle, true)
            await this.importConfigs(this.path)
            await this.loadConfigList(); // 加载配置项
            await this.onSearch();
            this.getTableVisibleChangeListFromLocation(); // 加载列表可查看选项的历史选项
            this.getUploadFileStatusFromLocalStorage()
        },

        methods: {
            // 载入通用化页面配置
            async importConfigs(path) {
                this.config = config_modules[path.split('/')[1]]
                this.tableColumn = JSON.parse(JSON.stringify(this.config.tableColumn))
                this.tableColumnList = JSON.parse(JSON.stringify(this.config.tableColumn))
                this.queryItemOptions = this.config.queryItemOptions
                this.actionButtonList = this.config.actionButtonList
                this.basicInfoConfig = this.config.basicInfoConfig
                this.getUploadFileStatusFromLocalStorage()
            },

            // 清空筛选项
            clearQueryOption() {
                this.queryOption = {}
                this.$refs['tableController'].clearSort() // to clear the table Sort status.
                this.$refs['tableController'].clearFilter() // now it is useless,but maybe will be useful in future.
                this.onSearch()
            },

            // 组件唤起用 重置操作
            needRefresh() {
                this.dataList = []
                this.actionButtonCell = null
                this.clearQueryOption()
            },

            // 单个页面展示数量修改
            handleSizeChange(e) {
                this.queryOption.pageSize = e
                this.pageSize = e
                this.onSearch(false)
            },

            // 切换页面
            handleCurrentChange(e) {
                this.queryOption.pageNum = e - 1
                this.onSearch(false)
            },

            // dialog 关闭前操作
            beforeClose() {
                this.onSearch(false);
                return true
            },

            // 搜索函数
            async onSearch(isNew = true) {
                this.loading = true
                let Api = this.config.apiConfig.onSearch
                let data = {}
                if (Api.dataDealFunc) {
                    data = Api.dataDealFunc(this.$route.params.id)
                } else {
                    data[Api.idKeyName] = this.$route.params.id
                    data = {
                        'data': data
                    }
                }
                this.$axios.post(this.$api[this.config.apiConfig.root][this.config.apiConfig.onSearch.api], data)
                    .then(
                        res => {
                            if (res.code != '0000') return;
                            this.loading = false;
                            let detailData = res.data.data ? res.data.data : res.data
                            let that = this
                            detailData = this.$utils.commonDataDealForNormalList(detailData, Api.replace, that)
                            if (detailData.dataList) {
                                this.dataList = {
                                    data: detailData.dataList
                                }
                            }
                            this.detailData = detailData
                            this.handleCurrentChange(1)
                        })
            },

            // 页面跳转函数
            navTo(e) {
                this.$router.push(e)
            },

            // 按钮事件
            async clickActionButton(action) {
                switch (action.actionType) {
                    case 'downloadByUrl':
                        window.location.href = action.url
                        break;
                    case 'func':
                        let that = this
                        return action.return(that)
                        break;
                    default:
                        this.$set(this, 'actionButtonCell', action)
                        await this.$nextTick()
                        this.$refs[action.actionType.toUpperCase()].open()
                        break;
                }
            },


            // 上传表格模板操作
            async uploadExcelTemplate(e, action) {
                if (action.asyncSign)
                    return this.addTaskToUploadFileStatus({
                        ...action.api.pre_data,
                        fileName: e.data[0].fileName,
                        objectName: e.data[0].key,
                        bucketName: this.$api.bucketName,
                    }, action.api)
                else {
                    let res = await this.$axios.post(this.$api[action.api.root][action.api.api], {
                        data: {
                            ...action.api.pre_data,
                            objectName: e.data[0].key,
                            bucketName: this.$api.bucketName
                        }
                    })
                    await action.api.resBack(res, this)
                    this.clearQueryOption()
                }
            },

            // 列表选择函数
            selectPosition(e) {
                this.selectedList = e
            },

            // 修改表格显示列 的状态 动态表格用
            async tableVisibleChange(data) {
                let tableColumn = this.tableColumn
                let e = []
                if (data.propList) {
                    e = data.propList
                } else {
                    e = data
                }
                let list = []
                this.tableColumn.forEach(x => {
                    if (e.indexOf(x.prop) != -1) {
                        list.push(x)
                    }
                })
                this.tableColumnList = []
                await this.$nextTick(); // 保证正确的刷新
                this.tableColumnList = list
                data = {
                    propList: e,
                    tableColumn
                }
                localStorage.setItem('tableColumnList_' + this.path.split('/'), JSON.stringify(data))
            },

            // 读取历史操作记录
            async getTableVisibleChangeListFromLocation() {
                let tableColumn = this.tableColumn
                let data = []
                if (localStorage.getItem('tableColumnList_' + this.path.split('/')))
                    data = JSON.parse(localStorage.getItem('tableColumnList_' + this.path.split('/')));
                if (!data || !data.propList) {
                    data = {
                        propList: tableColumn.map(x => {
                            return x.prop
                        }),
                        tableColumn: tableColumn
                    }
                }
                if (data.tableColumn.length != tableColumn.length) {
                    data.tableColumn = tableColumn;
                    data.propList = tableColumn.map(x => {
                        return x.prop
                    })
                }
                let list = data.propList
                list = list && list.length > 0 ? list : tableColumn.map(x => {
                    return x.prop
                })
                this.tableColumnCheckList = list;
                this.tableVisibleChange(list)
            },

            // 获取搜索配置
            async loadConfigList() {
                let that = this
                return await that.$utils.loadConfigList(that)
            },

            // dealTool 通用处理函数
            async dealTool_apiButton(scope, it, index) {
                this.loading = true
                let data = {}
                let that = this
                for (let x in it.data) {
                    data[x] = scope.row[it.data[x]]
                }
                for (let x in it.optionData) {
                    data[x] = it.optionData[x]
                }
                if (it.root == 'func') {
                    await it.return(that, scope.row)
                } else {
                    let res = await this.$axios.post(this.$api[it.root][it.api], {
                        data
                    });
                    let msg = it.returnFunc(res)
                    if (msg.box) {
                        this.$msgBox(msg.content, msg.title, msg.option)
                    } else {
                        this.$msg(msg.msg, msg.type, 4)
                    }
                    this.needRefresh()
                }

            },

            // 表格表内筛选用函数
            filterByProp(value, row, column) {
                const property = column['property'];
                return row[property] === value;
            },

            // 地区选择函数 // 暂不支持自定义
            areaHandleChange(e) {
                let areaId = []
                e.forEach(x => {
                    areaId.push(x[2])
                })
                this.$set(this.queryOption, 'areaIds', areaId)
            },

            // input-list 组件批量输入
            batchInput(className, propName) {
                let data = JSON.parse(JSON.stringify(this[className][propName]))
                let backData = []
                data.forEach(x => {
                    if (x.split(' ').length > 0) {
                        x.split(' ').map(c => {
                            backData.push(c)
                        })
                    } else {
                        backData.push(x)
                    }
                })
                this[className][propName] = backData
            },


            // 展示详情看板
            showDetail(row, column, cell, event) {
                if (this.config.moduleConfig.type) {
                    this.showDetailControl.show = true
                    this.showDetailControl.id = row.id
                    this.showDetailControl.row = row
                }
            },

            // 从缓存中读取 任务进度
            getUploadFileStatusFromLocalStorage() {
                this.uploadFileStatus = []
                this.uploadFileStatus = this.$utils.getJsonFromLSBykey('AsyncTaskStatus_' + this.path.split('/')) || []
                this.uploadFileStatus.sort((a, b) => {
                    if (a.download && !b.download) return 1
                    else return -1
                })
                let deleteList = []
                this.uploadFileStatus.forEach((x, index) => {
                    if (x.timeTick && new Date().getTime() - x.timeTick > 1000 * 60 * 10) {
                        deleteList.push(index)
                    }
                })
                deleteList.forEach(x => {
                    this.deleteBatchPositionImportResult({}, x)
                })
                if (this.uploadFileStatus && this.uploadFileStatus.length > 0) {
                    this.startUploadFileProcess()
                }
            },

            // 添加一条查询任务
            addTaskToUploadFileStatus(data, api) {
                this.uploadFileStatus.push({
                    data,
                    fileName: data.fileName,
                    process: 0,
                    api
                })
                if (!this.uploadFileProcess)
                    this.startUploadFileProcess()
            },


            // 导入进度处理 检测查询任务，查询并重复调用自身
            async startUploadFileProcess(that = this) {
                that.uploadFileProcess = true
                let uploadFileStatus = JSON.parse(JSON.stringify(that.uploadFileStatus))
                if (uploadFileStatus.map(x => {
                        if (x.data.fileName) return x
                    }).length > 0) {
                    uploadFileStatus.forEach(async (x, index) => {
                        if (x.data && x.data.fileName) {
                            if (!that.$api[x.api.root][x.api.api]) return;
                            let res = await that.$axios.post(that.$api[x.api.root][x.api.api], {
                                data: x.data
                            });
                            let {
                                data
                            } = res.data
                            if (data && data.split('://').length > 1) {
                                let key = false
                                uploadFileStatus.forEach((y, ind) => {
                                    if (y && y.download && y.download == data)
                                        key = ind
                                })
                                if (key === false) {
                                    uploadFileStatus[index]['download'] = data
                                    uploadFileStatus[index].data.fileName = null
                                } else {
                                    that.deleteBatchPositionImportResult('', key)
                                }
                                uploadFileStatus[key || index]['timeTick'] = new Date().getTime()
                            } else if (!data) {
                                // to defind empty data
                            } else if (data * 100 == 100 && x.api.noResult) {
                                x.process = data * 100
                                uploadFileStatus[index]['finish'] = true
                                uploadFileStatus[index]['data']['fileName'] = null
                                this.$msg(x.fileName + ' import finish', 'success')
                                this.deleteBatchPositionImportResult('', index)
                            } else {
                                x.process = data * 100
                            }
                        }
                    })
                }
                uploadFileStatus = uploadFileStatus.filter(Boolean)
                let length = uploadFileStatus.map(x => {
                    if (x.data.fileName != null) return x
                    else return null
                }).filter(Boolean).length
                if (length > 0) {
                    setTimeout(() => {
                        that.startUploadFileProcess(that)
                    }, 1000)
                } else {
                    that.uploadFileProcess = false
                }
                that.uploadFileStatus = uploadFileStatus
                that.$utils.setJsonAsStrToJsonByKey('AsyncTaskStatus_' + this.path.split('/'), that
                    .uploadFileStatus)
            },

            // 主动下载测评结果
            downloadBatchPositionImportResult(item, index) {
                let url = item.download.replace('http:', 'https:')
                this.$utils.openDownloadDialog(url, `【${this.$DateFormat(item.timeTick)}】` + item.fileName)
                this.deleteBatchPositionImportResult(item, index)
            },

            // 删除评测结果
            deleteBatchPositionImportResult(item, index) {
                this.uploadFileStatus.splice(index, 1)
                this.$utils.setJsonAsStrToJsonByKey('AsyncTaskStatus_' + this.path.split('/'), this.uploadFileStatus)
            },

            // 分页管理
            handleSizeChange(e) {
                this.pageConfig.pageSize = e
                this.handleCurrentChange(1)
            },

            // 分页切换
            handleCurrentChange(e) {
                this.pageConfig.pageNum = e - 1
                this.dataInPageList = []
                this.dataList.data.forEach((x, index) => {
                    if (index >= this.pageConfig.pageNum * this.pageConfig.pageSize && index < (this.pageConfig
                            .pageNum + 1) *
                        this.pageConfig.pageSize)
                        this.dataInPageList.push(x)
                })
            }
        },
        computed: {},
        destroyed() {
            clearInterval(interval)
            window.removeEventListener('scroll', handle, true)
            window.removeEventListener('resize', handle, true)
        }
    }
</script>

<style lang='less' scoped>
    .content-container {}


    .search-config {
        margin: 0 10px 10px 0;
    }

    .search-result {
        margin: 0 10px 10px 0;
    }

    .selectNum-word {
        font-size: 12px;
        color: gray;
    }

    .tag {
        margin-right: 5px;
        cursor: pointer;
        user-select: none;
        transition: all 0.3s;
        margin-bottom: 5px;
    }

    .action-button {
        margin: 0px 10px 0 0;
        margin-bottom: 10px;
        position: relative;
    }

    .page-footer {
        margin: 10px 0;
        float: right;
    }

    .el-select-fit {
        width: 430px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }

    .overflowHidden {
        overflow: hidden;
    }

    .flex {
        display: flex;
    }

    .flex-column {
        display: flex;
        flex-direction: column;
    }



    .infoBox {
        width: 100%;
    }

    .infoBlock {
        min-width: 20%;
        max-width: 280px;
        margin: 10px 0px 0px 0px;
        padding: 0px 10px 0px 10px;
        color: #909399;
    }

    .info {
        color: #303133;
    }
</style>