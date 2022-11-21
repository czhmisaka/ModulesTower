<!--
 * @Date: 2022-11-09 19:26:59
 * @LastEditors: CZH
 * @LastEditTime: 2022-11-18 15:34:31
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
      v-model="query"
      @search="search"
      @btnClick="btnClick"
      :queryItemTemplate="searchItemTemplate"
      :inputChange="queryChange"
      :btn-list="btnList"
    />
    <el-divider />
    <infoTable
      :template="showItemTemplate"
      :data-list="PageData"
      :loading="isLoading"
      :style="{
        height: TableHeight + 'px',
      }"
    />
    <drawerForm ref="drawer" :appendToBody="'false'" :detail="drawerData"></drawerForm>
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
import { btnCellTemplate, stringAnyObj, btnActionTemplate } from "./searchTable";

import drawerForm from "@/modules/userManage/component/searchTable/drawerForm.vue";

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
    preLoadData: {
      label: "预加载数据列表",
      type: inputType.array,
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
    btnList: {
      label: "按钮行为列表",
      type: inputType.array,
    },
  } as propInfo,

  baseProps: {},

  watch: {},
  props: [
    "baseData",
    "sizeUnit",
    "preLoadData",
    "searchFunc",
    "showItemTemplate",
    "searchItemTemplate",
    "searchKeyWithBaseData",
    "btnList",
  ],
  components: { cardBg, inputForm, infoTable, sideDialogForm, drawerForm },
  data() {
    return {
      query: {},
      PageData: {},
      isLoading: false,

      // drawer
      drawerData: {} as stringAnyObj,

      // 计算列表可用高度
      TableHeight: 500,
    };
  },
  async mounted() {
    this.$emit("ready");
    await this.search();
    let that = this;
    if (interval) clearInterval(interval);
    interval = setInterval(() => {
      if (this.$refs["mainBox"] && this.$refs["inputBox"]) {
        this.TableHeight =
          this.$refs["mainBox"].$el.offsetHeight -
          this.$refs["inputBox"].$el.offsetHeight -
          72;
      }
    });
  },
  methods: {
    async preDataLoad() {
      if (this.preLoadData) {
        let that = this;
        await this.preLoadData(that);
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
        this.drawerData = btn.drawerProps;
        this.$refs["drawer"].open();
      } else if (btn.type == btnActionTemplate.Function) {
      } else if (btn.type == btnActionTemplate.Url) {
      }
    },

    async search(query: { [key: string]: any }) {
      if (this.searchFunc) {
        this.isLoading = true;
        let result = await this.searchFunc(query);
        this.PageData = { data: result };
        this.isLoading = false;
      }
    },
  },
});
</script>

<style lang="scss" scoped></style>
