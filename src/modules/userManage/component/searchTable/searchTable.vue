<!--
 * @Date: 2022-11-09 19:26:59
 * @LastEditors: CZH
 * @LastEditTime: 2022-11-28 21:17:06
 * @FilePath: /configforpagedemo/src/modules/userManage/component/searchTable/searchTable.vue
-->
<template>
  <cardBg
    ref="mainBox"
    :cusStyle="{
      padding: '12px',
    }"
  >
    <inputForm
      ref="inputBox"
      :query="query"
      @search="search"
      @btnClick="btnClick"
      :queryItemTemplate="searchItemTemplate"
      @inputChange="queryChange"
      :btn-list="btnList"
      :autoSearch="autoSearch"
    />
    <infoTable
      :template="showItemTemplate"
      :data-list="PageData.data"
      :loading="isLoading"
      :onSearch="search"
      :style="{
        height: TableHeight + 'px',
      }"
      @selectedChange="selectedChange"
    />
    <el-pagination
      v-model:current-page="PageData.pageNum"
      v-model:page-size="PageData.pageSize"
      :page-sizes="[100, 200, 300, 400]"
      :small="true"
      :background="true"
      layout="total, sizes, prev, pager, next, jumper"
      :total="PageData.total"
      @size-change="search"
      @current-change="search"
      :hide-on-single-page="false"
    />
  </cardBg>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import sideDialogForm from "@/modules/userManage/component/searchTable/drawerForm.vue";
import cardBg from "@/components/basicComponents/cell/card/cardBg.vue";
import {
  componentInfo,
  inputType,
  propInfo,
  gridSizeMaker,
} from "@/components/basicComponents/grid/module/dataTemplate";
import inputForm from "./inputForm.vue";
import infoTable from "./infoTable.vue";
import { stringAnyObj } from "./searchTable";
import { btnActionTemplate, btnCellTemplate } from "./drawerForm";
import { Console } from "console";
import { deepClone } from "@/components/basicComponents/grid/module/cardApi/deepClone";
import { tableCellTemplateMaker, PageDataTemplate } from "./searchTable";
let interval = null;

export default defineComponent({
  componentInfo: {
    labelNameCn: "搜索列表组件",
    key: "searchTable",
    description:
      "搜索列表组件，可以监听baseData内的参数作为搜索传参数，支持对接不同风格的表单搜索组件",
    gridInfo: {
      middle: gridSizeMaker(9, 8),
    },
  } as componentInfo,

  propsDetail: {
    defaultQuery: {
      label: "初始化搜索值",
      type: inputType.obj,
    },
    searchFunc: {
      label: "搜索函数",
      type: inputType.functionEditor,
    },
    showItemTemplate: {
      label: "展示单元模板列表",
      type: inputType.array,
    },
    searchItemTemplate: {
      label: "搜索单元模板列表",
      type: inputType.array,
    },
    searchKeyWithBaseData: {
      label: "需要读取的baseDataKey值",
      type: inputType.array,
    },
    pageConfig: {
      label: "分页配置",
      type: inputType.obj,
    },
    btnList: {
      label: "按钮行为列表",
      type: inputType.array,
    },
    autoSearch: {
      label: "自动搜索",
      type: inputType.boolean,
    },
  } as propInfo,

  baseProps: {
    autoSearch: false,
    defaultQuery: { helloworld: "hello world" },
    searchFunc: (data) => {
      return [data];
    },
    showItemTemplate: [tableCellTemplateMaker("HELLO WORLD", "helloworld")],
    searchItemTemplate: [tableCellTemplateMaker("HELLO WORLD", "helloworld")],
    btnList: [],
  },

  watch: {},
  props: [
    "defaultQuery",
    "baseData",
    "sizeUnit",
    "searchFunc",
    "showItemTemplate",
    "searchItemTemplate",
    "searchKeyWithBaseData",
    "btnList",
    "autoSearch",
    "pageConfig",
  ],
  components: { cardBg, inputForm, infoTable, sideDialogForm },
  data() {
    return {
      query: {},
      PageData: {} as PageDataTemplate,
      isLoading: false,

      // 当前选择项
      selectedList: [],

      // 计算列表可用高度
      TableHeight: 500,
    };
  },
  async mounted() {
    this.initData();
    this.$emit("ready");
    await this.search();

    let that = this;
    if (interval) clearInterval(interval);
    interval = setInterval(() => {
      if (that.$refs["mainBox"] && that.$refs["inputBox"]) {
        if (that.$refs["inputBox"].$el.offsetHeight)
          that.TableHeight =
            that.$refs["mainBox"].$el.offsetHeight -
            that.$refs["inputBox"].$el.offsetHeight -
            48;
        else that.TableHeight = that.$refs["mainBox"].$el.offsetHeight - 24;
      }
    }, 500);
  },
  methods: {
    async initData() {
      if (this.defaultQuery && Object.keys(this.defaultQuery).length > 0) {
        this.query = deepClone(this.defaultQuery);
      }
    },

    /**
     * @name: queryChange
     * @description: 承接inputForm 回传数据
     * @authors: CZH
     * @Date: 2022-11-21 18:24:28
     */
    queryChange(query: stringAnyObj) {
      this.query = query;
      if (this.autoSearch) this.search();
    },

    /**
     * @name: btnClick
     * @description: 自定义按钮事件
     * @authors: CZH
     * @Date: 2022-11-21 19:04:03
     * @param {*} btn
     */
    async btnClick(btn: btnCellTemplate) {
      if (btn.type == btnActionTemplate.OpenDrawer) {
        this.$modules.getModuleApi()["userManage_openDrawerForm"](this, btn.drawerProps);
      } else if (btn.type == btnActionTemplate.Function && btn.function) {
        let that = this;
        await btn.function(that);
      } else if (btn.type == btnActionTemplate.Url && btn.url) {
        window.open(btn.url);
      }
    },

    async selectedChange(selectedList: any[]) {
      this.selectedList = selectedList;
    },

    async search(query: { [key: string]: any } = this.query) {
      console.log(query);
      if (this.searchFunc) {
        this.isLoading = true;
        try {
          let result = await this.searchFunc(query);
          if (result) this.PageData.data = result;
        } catch (e) {
          console.log("【searchTable】组件search事件报错", e);
        } finally {
          this.isLoading = false;
        }
      }
    },
  },
});
</script>

<style lang="scss" scoped></style>
