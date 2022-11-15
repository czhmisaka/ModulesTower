<!--
 * @Date: 2022-11-09 19:26:59
 * @LastEditors: CZH
 * @LastEditTime: 2022-11-15 18:33:22
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
      :queryItemTemplate="searchItemTemplate"
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

  watch: {
    "sizeUnit.blockSize": {
      handler(val) {
        if (this.$refs["mainBox"] && this.$refs["inputBox"]) {
          console.log(
            this.$refs["mainBox"].$el.offsetHeight,
            this.$refs["inputBox"].$el.offsetHeight
          );
          this.TableHeight =
            this.$refs["mainBox"].$el.offsetHeight -
            this.$refs["inputBox"].$el.offsetHeight -
            72;
        }
      },
      deep: true,
      immediate: true,
    },
  },
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
  components: { cardBg, inputForm, infoTable },
  data() {
    return {
      query: {},
      PageData: {},
      isLoading: false,

      // 计算列表可用高度
      TableHeight: 500,
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
