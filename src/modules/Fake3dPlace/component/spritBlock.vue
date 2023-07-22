<!--
 * @Date: 2023-07-22 14:58:03
 * @LastEditors: CZH
 * @LastEditTime: 2023-07-23 05:15:58
 * @FilePath: /ConfigForDesktopPage/src/modules/Fake3dPlace/component/spritBlock.vue
-->
<template>
  <div :style="cusStyleFunc()" :class="cusClassFunc()">
    <el-image @click="click" class="image" :src="image" :fit="fit || 'cover'" />
  </div>
</template>

<script lang="ts">
import {
  componentInfo,
  gridSizeMaker,
} from "@/components/basicComponents/grid/module/dataTemplate";
import { defineComponent } from "vue";

export enum transFormTemplate {
  wall = "wall",
  road = "road",
}

export default defineComponent({
  props: [
    "baseData",
    "sizeUnit",
    "detail",
    "image",
    "cusStyle",
    "transform",
    "clickFunc",
    "fit",
  ],
  async mounted() {
    this.$emit("ready");
    console.log(this.sizeUnit, this.detail);
  },
  methods: {
    click() {
      if (this.clickFunc) {
        const that = this;
        this.clickFunc(that);
      }
    },

    cusClassFunc() {
      return `base ` + this.transform;
    },

    cusStyleFunc() {
      let base = {};
      if (this.transform == transFormTemplate.wall) {
        base = {
          transform: `rotateX(0deg) skew(327deg) translate(${
            this.detail.gridInfo.default.size.width * -(336 / this.sizeUnit.colNum)
          }px,${
            this.detail.gridInfo.default.size.height * -(1080 / this.sizeUnit.colNum)
          }px)`,
        };
      }
      if (this.cusStyle)
        base = {
          base,
          ...this.cusStyle,
        };
      return base;
    },
  },

  componentInfo: {
    labelNameCn: "伪造精灵块",
    key: "spritBlock",
    description: "",
    gridInfo: {
      middle: gridSizeMaker(1, 1),
    },
  } as componentInfo,
});
</script>

<style scoped>
.base {
  cursor: pointer;
  width: 100%;
  height: 100%;
}
.image {
  width: 100%;
  height: 100%;
}

.wall {
  transform: rotateX(10deg) skew(327deg);
  transform: translate(1, 1);
}
</style>
