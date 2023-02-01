<!--
 * @Date: 2023-01-21 21:10:09
 * @LastEditors: CZH
 * @LastEditTime: 2023-01-31 00:52:06
 * @FilePath: /configforpagedemo/src/modules/photoWebSiteModule/component/imageInfo/infoCard.vue
-->
<template>
  <cardBg
    :cus-style="{
      overflow: 'scroll',
    }"
  >
    <el-card
      @click="rate"
      :style="{
        margin: '6px',
      }"
      :body-style="{
        padding: '0px',
      }"
    >
      <waterFallItem
        v-if="baseData['image']"
        :url="baseData['image'].url"
        :item="baseData['image']"
        :cus-style="{
          width: 'calc(100%)',
          borderRadius: '6px',
          height: '150px',
        }"
        :noPreview="true"
      ></waterFallItem>
    </el-card>
    <el-card
      title="基本信息"
      :style="{
        margin: '6px',
        marginTop: '3px',
      }"
      :body-style="{
        padding: '3px',
      }"
    >
      <el-descriptions :column="1" size="small" v-if="baseData['image']" border>
        <el-descriptions-item
          v-for="item in Object.keys(imageInfo)"
          :align="'left'"
          :label="item"
          label-align="left"
        >
          {{ imageInfo[item] }}
        </el-descriptions-item>
      </el-descriptions>
    </el-card>
  </cardBg>
</template>

<script lang="ts">
import { defineComponent, watch } from "vue";
import cardBg from "@/components/basicComponents/cell/card/cardBg.vue";
import { get, post, piwigoPost } from "@/utils/api/requests";

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
    key: "InfoCard",
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
  watch: {
    "baseData.image": {
      handler(val) {
        this.initImageInfo(val);
      },
    },
  },
  async mounted() {
    this.$emit("ready");
  },

  data: () => {
    return {
      imageInfo: {},
    };
  },
  methods: {
    async rate() {
      await piwigoPost("/piwigo/ws.php?format=json", {
        method: "pwg.images.rate",
        rate: "1",
        image_id: this.baseData.image.id,
      });
    },
    async initImageInfo(image) {
      if (!image || !image.id) return;
      let res = await get("/image-info?id=" + image.id, {});
      if (!res || !res.data) return;
      const { tagList } = res.data;
      const info = res.data.info[0];
      this.imageInfo = {
        尺寸: `${info.width}px × ${info.height}px`,
        文件大小: `${info.filesize} Kb`,
        格式: info.file.split(".")[1],
        创建日期: new Date(info.date_available.replace("T", " ")).toLocaleString(),
        修改日期: new Date(info.lastmodified.replace("T", " ")).toLocaleString(),
      };
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
