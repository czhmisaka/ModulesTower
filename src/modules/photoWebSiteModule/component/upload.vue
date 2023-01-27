<!--
 * @Date: 2022-10-20 21:59:36
 * @LastEditors: CZH
 * @LastEditTime: 2023-01-28 00:18:52
 * @FilePath: /configforpagedemo/src/modules/photoWebSiteModule/component/upload.vue
-->
<template>
  <cardBg>
    <div class="box">
      <el-upload
        style="width:100%;height;100%"
        v-model:file-list="fileList"
        :on-change="handleChange"
        :action="
          action
            ? action
            : '/api/upload/?category_id=' + (baseData?.category?.id || 3) + '&user_id=1'
        "
        :on-success="success"
        multiple
      >
        <el-button :icon="Upload" circle size="large" class="center"> </el-button>
      </el-upload>
    </div>
  </cardBg>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Upload } from "@element-plus/icons-vue";
import {
  componentInfo,
  inputType,
  propInfo,
  gridSizeMaker,
} from "@/components/basicComponents/grid/module/dataTemplate";
import cardBg from "@/components/basicComponents/cell/card/cardBg.vue";
import { ElMessage } from "element-plus";

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
  props: ["action", "sizeUnit", "onClickFunc", "tips", "detail", "baseData"],
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
    success(e) {
      ElMessage.success("上传成功");
    },

    handleChange(e) {
      console.log(this.fileList);
    },
  },
});
</script>

<style lang="scss" scoped>
.box {
  width: 100%;
  height: 100%;
  text-align: center;
  line-height: 100%;
}

.center {
  position: absolute;
  top: 50%;
  margin-top: -1.5em;
}
</style>
