<!--
 * @Date: 2023-03-12 23:09:15
 * @LastEditors: CZH
 * @LastEditTime: 2023-06-27 09:17:22
 * @FilePath: /ConfigForDesktopPage/src/modules/photoWebSiteModule/component/selectList/searchInfoChosSearch.vue
-->
<template>
  <cardBg>
    <div
      class="wholeBox"
      :style="{
        lineHeight: size(),
      }"
    >
      <el-input
        :style="{
          height: size(0.6),
          transition: 'width 0.3s',
          width:
            searchString && searchString.length > 0
              ? `calc(80% - ${size(0.2)})`
              : `calc(100%)`,
        }"
        @keydown.enter.prevent="search"
        v-model="searchString"
        placeholder="请输入..."
      />
      <el-button
        :style="{
          transition: 'all 0.5s',
          height: size(0.6),
          width: searchString && searchString.length > 0 ? `calc(20%)` : `calc(0%)`,
          marginLeft: size(0.2),
          opacity: searchString && searchString.length > 0 ? 1 : 0.2,
        }"
        :loading="loading"
        @click="search"
        type="primary"
      >
        {{ btnName ? btnName : "搜索" }}
      </el-button>
    </div>
  </cardBg>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";
import {
  componentInfo,
  gridSizeMaker,
} from "@/components/basicComponents/grid/module/dataTemplate";
import cardBg from "@/components/basicComponents/cell/card/cardBg.vue";

import {
  changeVisible,
  changeCardSize,
  changeCardPosition,
  changeCardProperties,
  setData,
} from "@/components/basicComponents/grid/module/cardApi/index";

export default defineComponent({
  name: "searchInfoChosSearch",

  componentInfo: {
    labelNameCn: "混沌搜索用搜索栏",
    key: "searchInfoChosSearch",
    description: "一个非常普通的搜索栏",
    gridInfo: {
      middle: gridSizeMaker(4, 8),
    },
  } as componentInfo,
  propsDetail: {},
  baseProps: {},
  components: { cardBg },

  props: ["baseData", "sizeUnit", "onClickFunc", "searchFunc", "gridList", "btnName"],
  data: () => {
    return {
      searchString: "v2",
      loading: false,
    };
  },
  methods: {
    /**
     * @name: size
     * @description: 基于sizeUnit.blocksize 计算
     * @authors: CZH
     * @Date: 2023-03-13 00:02:49
     */
    size(num = 1) {
      return this.sizeUnit.blockSize * num + "px";
    },

    /**
     * @name: search
     * @description: 执行搜索
     * @authors: CZH
     * @Date: 2023-03-13 00:35:14
     */
    async search() {
      let { searchString } = this;
      if (searchString && searchString.length > 1) {
        try {
          this.loading = true;
          await this.searchFunc(this, searchString);
          this.loading = false;
          this.searchString = "";
        } catch {
          this.$message.warning("搜索函数出问题啦！");
        }
      }
    },
  },
  setup(props, context) {
    onMounted(() => {
      context.emit("ready");
    });
    return {};
  },
});
</script>

<style scoped>
.wholeBox {
  width: calc(100%);
  height: 100%;
  text-align: left;
  padding: 0px 12px;
}
</style>
