<!--
 * @Date: 2023-01-20 23:35:00
 * @LastEditors: CZH
 * @LastEditTime: 2023-02-09 00:33:16
 * @FilePath: /configforpagedemo/src/modules/photoWebSiteModule/component/selectList/tagList.vue
-->
<!--
 * @Date: 2022-10-20 21:59:36
 * @LastEditors: CZH
 * @LastEditTime: 2023-01-19 23:05:52
 * @FilePath: /configforpagedemo/src/modules/photoWebSiteModule/component/upload.vue
-->
<template>
  <cardBg>
    <el-tag v-for="tag in tagList" @click="clickFunc(tag)">{{ tag.label }}</el-tag>
  </cardBg>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Upload } from "@element-plus/icons-vue";
import {
  componentInfo,
  gridSizeMaker,
} from "@/components/basicComponents/grid/module/dataTemplate";
import cardBg from "@/components/basicComponents/cell/card/cardBg.vue";
import { setData } from "@/components/basicComponents/grid/module/cardApi";

export default defineComponent({
  name: "tagList",
  componentInfo: {
    labelNameCn: "tag列表组件",
    key: "tagList",
    description:
      "用于对接某个piwigo - pythonserver 的服务器，展示当前的所有相册列表，并提供部相册的增删功能 , 展示可选择的tag列表",
    gridInfo: {
      middle: gridSizeMaker(4, 8),
    },
  } as componentInfo,

  propsDetail: {},

  baseProps: {},

  components: { cardBg },
  props: ["sizeUnit", "onClickFunc", "tagList", "outputKey"],
  data() {
    return {
      Upload,
      fileList: [],
    };
  },
  mounted() {
    this.$emit("ready");
  },

  methods: {
    clickFunc(tag) {
      if (this.onClickFunc) {
        this.onClickFunc(tag);
      } else if (this.outputKey) {
        let data = {};
        data[this.outputKey] = tag;
        setData(this, data);
      }
    },
  },
});
</script>

<style lang="scss" scoped></style>
