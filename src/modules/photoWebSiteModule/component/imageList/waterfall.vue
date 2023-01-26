<!--
 * @Date: 2023-01-21 21:10:09
 * @LastEditors: CZH
 * @LastEditTime: 2023-01-26 10:38:05
 * @FilePath: /configforpagedemo/src/modules/photoWebSiteModule/component/imageList/waterfall.vue
-->
<template>
  <cardBg>
    <div class="wholeScreen" v-if="open">
      <div
        v-infinite-scroll="getImgList"
        infinite-scroll-immediate="false"
        ref="waterfall"
      >
        <div id="waterfall"></div>
      </div>
    </div>
  </cardBg>
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
import { waterfall } from "./waterfall.js";

export default defineComponent({
  componentInfo: {
    labelNameCn: "瀑布流",
    key: "waterFall",
    description: "展示图片瀑布流",
    gridInfo: {
      middle: gridSizeMaker(3, 8),
    },
  } as componentInfo,

  propsDetail: {
    getFunc: {
      label: "获取图片的函数，搭配监听key使用",
      type: inputType.text,
    },
    watchKeyForCategory: {
      label: "baseData监听key(相册key)",
      type: inputType.text,
    },
    imageList: {
      label: "图片列表(直接渲染用）",
      type: inputType.array,
    },
  } as propInfo,

  baseProps: {},

  props: ["baseData", "sizeUnit", "watchKeyForCategory", "imageList", "getFunc"],
  components: { cardBg },
  watch: {
    baseData: {
      handler: async function (val) {
        if (Object.keys(val).indexOf(this.watchKeyForCategory) > -1) {
          this.data.offset = 0;
          this.imgList = [];
          await this.getImgList();
        }
      },
    },
    imgList(val) {
      const elw = this.$refs["waterfall"];
      console.log(elw.scrollTop, "asd");
      waterfall("#waterfall", {
        datas: val,
        direction: "h",
        parentBox: "main",
        spacing: 6,
        rowClass: "img-row",
        itemClass: "img-item",
      });
      console.dir(elw, "asd");
    },
  },
  mounted() {
    this.open = true;
    if (this.imageList && this.imageList.length > 0) {
    }
    this.$emit("ready");
  },
  data: () => {
    return {
      imgList: [],
      data: {
        limit: 20,
        offset: 0,
      } as { [key: string]: number },
      open: false,
    };
  },
  methods: {
    async getImgList(val = this.baseData[this.watchKeyForCategory]) {
      if (!val) return null;
      let { limit, offset } = this.data;
      console.log("asd");
      let list = await this.getFunc(this, {
        key: val,
        limit,
        offset,
      });
      this.imgList = this.imgList.concat(list);
      this.data = { limit, offset: list.length + offset };
    },
  },
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
