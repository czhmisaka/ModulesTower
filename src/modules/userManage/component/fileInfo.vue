<!--
 * @Date: 2022-10-20 22:00:09
 * @LastEditors: CZH
 * @LastEditTime: 2022-10-27 09:20:16
 * @FilePath: /configforpagedemo/src/modules/minio/component/fileInfo.vue
-->
<template>
  <span> </span>
</template>

<script lang="ts">
import {
  componentInfo,
  inputType,
  propInfo,
  gridSizeMaker,
} from "@/components/basicComponents/grid/module/dataTemplate";
import { defineComponent } from "vue";
import { MinioFileTemplate } from "./fileTemplate";
export default defineComponent({
  componentInfo: {
    labelNameCn: "Minio文件展示模块",
    key: "fileInfo",
    description: "一个用来展示Minio提供文件地址的模块，搭配minio相关套件使用",
    gridInfo: {
      normal: gridSizeMaker(2, 2),
    },
  } as componentInfo,
  props: {
    file: {
      type: Object,
      default: () => {
        return {} as MinioFileTemplate;
      },
    },
  },
  propsDetail: {
    file: {
      label: "文件信息",
      type: inputType.obj,
    },
  } as propInfo,

  async mounted() {
    this.$emit("ready");
  },
});
</script>
