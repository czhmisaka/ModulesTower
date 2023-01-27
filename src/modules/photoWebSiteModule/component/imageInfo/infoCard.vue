<!--
 * @Date: 2023-01-21 21:10:09
 * @LastEditors: CZH
 * @LastEditTime: 2023-01-27 22:44:03
 * @FilePath: /configforpagedemo/src/modules/photoWebSiteModule/component/imageInfo/infoCard.vue
-->
<template>
  <cardBg> </cardBg>
</template>

<script lang="ts">
import { defineComponent, watch } from "vue";
import cardBg from "@/components/basicComponents/cell/card/cardBg.vue";
import {
  componentInfo,
  inputType,
  propInfo,
  gridSizeMaker,
} from "@/components/basicComponents/grid/module/dataTemplate";
import waterFallItem from "@/modules/photoWebSiteModule/component/imageList/waterFallItem.vue";

export default defineComponent({
  componentInfo: {
    labelNameCn: "图片详情介绍",
    key: "imageInfoCard",
    description: "图片详情介绍",
    gridInfo: {
      middle: gridSizeMaker(2, 12),
    },
  } as componentInfo,

  propsDetail: {
    image: {
      label: "图片信息",
      type: inputType.obj,
    },
  } as propInfo,

  baseProps: {},

  props: ["baseData", "sizeUnit", "image"],
  components: { cardBg, waterFallItem },
  watch: {},
  async mounted() {
    this.$emit("ready");
  },
  data: () => {
    return {};
  },
  methods: {},
});
</script>

<style lang="scss" scoped>
.wholeScreen {
  position: relative;
  width: calc(100% - 24px);
  height: calc(100% - 24px);
  margin: 12px;
  overflow-y: scroll;
}
</style>
