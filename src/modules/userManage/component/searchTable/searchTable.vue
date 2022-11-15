<!--
 * @Date: 2022-11-09 19:26:59
 * @LastEditors: CZH
 * @LastEditTime: 2022-11-15 17:35:04
 * @FilePath: /configforpagedemo/src/modules/userManage/component/searchTable/searchTable.vue
-->
<template>
  <cardBg
    :cusStyle="{
      padding: '12px',
    }"
  >
    <inputForm v-model="query" @search="search" :queryItemTemplate="searchItemTemplate" />
    <el-divider />
    <infoTable :template="showItemTemplate" :data-list="PageData" :loading="isLoading" />
  </cardBg>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import cardBg from "@/components/basicComponents/cell/card/cardBg.vue";
import {
  componentInfo,
  inputType,
  propInfo,
  gridSizeMaker,
} from "@/components/basicComponents/grid/module/dataTemplate";
import inputForm from "./inputForm.vue";
import infoTable from "./infoTable.vue";

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

  props: [
    "baseData",
    "preLoadData",
    "searchFunc",
    "showItemTemplate",
    "searchItemTemplate",
    "searchKeyWithBaseData",
    "btnList",
  ],
  components: { cardBg, inputForm, infoTable },
  data() {
    return {
      query: {},
      PageData: {},
      isLoading: false,
    };
  },
  async mounted() {
    this.$emit("ready");
    await this.search();
  },
  methods: {
    async preDataLoad() {
      if (this.preLoadData) {
        let that = this;
        await this.preLoadData(that);
      }
    },

    queryChange() {},

    async search(query: { [key: string]: any }) {
      if (this.searchFunc) {
        this.isLoading = true;
        let result = await this.searchFunc(query);
        console.log(result, "asd");
        this.PageData = { data: result };
        this.isLoading = false;
      }
    },
  },
});
</script>

<style lang="scss" scoped></style>
