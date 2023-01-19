<!--
 * @Date: 2022-10-20 21:59:36
 * @LastEditors: CZH
 * @LastEditTime: 2023-01-18 17:33:23
 * @FilePath: /configforpagedemo/src/modules/photoWebSiteModule/component/upload.vue
-->
<template>
  <cardBg>
    <div class="box">
      <el-upload
        style="width:100%;height;100%"
        v-model:file-list="fileList"
        :action="action ? action : '/api/upload/'"
        multiple
      >
        <div class="box">
          <el-icon :fontSize="sizeUnit.blockSize + 'px'">
            <Upload></Upload>
          </el-icon>
        </div>
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
  props: ["action", "sizeUnit", "onClickFunc", "tips", "detail"],
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

<style lang="scss" scoped>
.box {
  width: 100%;
  height: 100%;
  text-align: center;
  line-height: 100%;
}
</style>
