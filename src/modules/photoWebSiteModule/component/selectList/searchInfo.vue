<!--
 * @Date: 2023-01-20 23:35:00
 * @LastEditors: CZH
 * @LastEditTime: 2023-02-14 23:59:59
 * @FilePath: /ConfigForDesktopPage/src/modules/photoWebSiteModule/component/selectList/searchInfo.vue
-->
<template>
  <cardBg>
    <div
      class="wholeBox"
      :style="{
        lineHeight: sizeUnit.blockSize + 'px',
      }"
    >
      <el-input v-model="query['name']" placeholder="图片名字" class="item"></el-input>
      <el-select
        v-model="query['tags']"
        :placeholder="'标签'"
        style="width: auto"
        class="item"
        multiple
        clearable
        collapse-tags
      >
        <el-option v-for="tag in tagList" :value="tag.id" :label="tag.name"></el-option>
      </el-select>
      <el-button
        :style="{ margin: `${(sizeUnit.blockSize - 30) / 2}px 0px`, float: 'right' }"
        @click="clear"
        >清空</el-button
      >
    </div>
  </cardBg>
</template>

<script lang="ts">
let category = {};
import { defineComponent } from "vue";
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
  name: "searchInfo",
  componentInfo: {
    labelNameCn: "搜索栏",
    key: "searchInfo",
    description:
      "用于对接某个piwigo - pythonserver 的服务器，展示当前的所有相册列表，并提供部相册的增删功能 , 展示可搜索的选项列表",
    gridInfo: {
      middle: gridSizeMaker(4, 8),
    },
  } as componentInfo,

  propsDetail: {},

  baseProps: {},

  components: { cardBg },
  watch: {
    query: {
      handler(val) {
        let value = JSON.parse(JSON.stringify(val));
        if (value.tags && value.tags.length == 0) delete value.tags;
        let data = {};
        data[this.outputKey] = value;
        const that = this;
        if (Object.keys(value).length != 0) {
          changeCardPosition(that, {
            waterFall: { x: 0, y: 1 },
            searchInfo: { x: 0, y: 0 },
          });
          changeCardSize(that, {
            waterFall: {
              width: 10,
              height: 11,
            },
            categoryList: {
              width: 0,
              height: 0,
            },
            collectionList: {
              width: 0,
              height: 0,
            },
            searchInfo: {
              width: 10,
              height: 1,
            },
          });
          changeVisible(that, {
            upload: false,
          });
          if (that.baseData.category)
            category = JSON.parse(JSON.stringify(that.baseData.category));
          data["category"] = null;
        } else {
          changeCardPosition(that, {
            waterFall: { x: 2, y: 1 },
            searchInfo: { x: 2, y: 0 },
          });
          changeCardSize(that, {
            waterFall: {
              width: 8,
              height: 11,
            },
            categoryList: {
              width: 2,
              height: 5,
            },
            collectionList: {
              width: 2,
              height: 5,
            },

            searchInfo: {
              width: 8,
              height: 1,
            },
          });
          changeVisible(that, {
            upload: true,
          });
          if (category != null) {
            data["category"] = category;
            category = null;
          }
        }

        setData(that, data);
      },
      deep: true,
    },
  },
  props: ["baseData", "sizeUnit", "onClickFunc", "tagList", "outputKey"],
  data() {
    return {
      query: {},
    };
  },
  mounted() {
    this.$emit("ready");
  },

  methods: {
    clear() {
      this.query = {};
    },
  },
});
</script>

<style lang="scss" scoped>
.wholeBox {
  width: calc(100%);
  height: 100%;
  text-align: left;
  padding: 0px 12px;
  .item {
    width: 80px;
    margin-right: 6px;
  }
}
</style>
