<!--
 * @Date: 2022-10-20 21:59:36
 * @LastEditors: CZH
 * @LastEditTime: 2022-10-26 09:39:16
 * @FilePath: /configforpagedemo/src/modules/minio/component/upload.vue
-->
<template>
  <cardBg>
    <div :style="{}">
      <el-upload v-model:file-list="fileList" action="/api/upload/" multiple>
        <ElButton> 上传图片 </ElButton>
      </el-upload>
    </div>
  </cardBg>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {
  componentInfo,
  inputType,
  propInfo,
  gridSizeMaker,
} from "@/components/basicComponents/grid/module/dataTemplate";
import cardBg from "@/components/basicComponents/cell/card/cardBg.vue";

export default defineComponent({
  name: "upload",
  componentInfo: {
    labelNameCn: "上传组件",
    key: "upload",
    description: "用于对接某个piwigo - pythonserver 的服务器",
    gridInfo: {
      middle: gridSizeMaker(3, 2),
    },
  } as componentInfo,

  propsDetail: {
    name: {
      label: "name",
      description: "组件名称",
      type: inputType.text,
    },
  },

  baseProps: {},

  components: { cardBg },
  data() {
    return {
      fileList: [],
    };
  },
  mounted() {
    this.$emit("ready");
  },

  methods: {},
});
</script>
