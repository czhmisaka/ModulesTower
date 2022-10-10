<!--
 * @Date: 2022-10-10 17:05:19
 * @LastEditors: CZH
 * @LastEditTime: 2022-10-10 17:05:30
 * @FilePath: /configforpagedemo/src/components/basicComponents/cell/info/infoFile.vue
-->

<template>
  <div class="flex">
    <div class="icon" v-if="fileDetail.icon">
      {{ fileDetail.icon }}
    </div>
    <div class="icon" v-else>
      <el-icon><Files /></el-icon>
    </div>
    <div class="fileName">
      {{ fileDetail.name }}
    </div>
    <div class="fileInfo">
      {{ fileDetail?.sizeInfo }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { fileTemplate } from "./fileType";

export default defineComponent({
  name: "infoFile",
  nameCn: "展示一个文件的详情",

  data: () => {
    return {
      fileDetail: null as fileTemplate,
    };
  },

  watch: {
    file: {
      handler() {},
    },

    size: {
      handler() {},
    },
  },

  props: ["file", "size", "baseData", "sizeUnit"],
});
</script>

<style lang="scss" scoped>
.flex {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  .icon {
    height: 100%;
    width: auto;
  }
  .fileName {
  }
  .fileInfo {
  }
}
</style>
