<!--
 * @Date: 2023-02-13 10:25:34
 * @LastEditors: CZH
 * @LastEditTime: 2023-02-17 17:18:56
 * @FilePath: /configforpagedemo/src/modules/userManage/component/userCard/userInfoCard.vue
-->
<template>
  <cardBg
    :cusStyle="{
      padding: '12px',
    }"
  >
    <div
      :style="{
        width: '100%',
        height: '100%',
        overflow: 'auto',
        overflowX: 'hidden',
      }"
    >
      <el-descriptions
        :title="title || '用户信息'"
        v-if="!showTemplate || showTemplate.length == 0"
        border
        :column="2"
      >
        <el-descriptions-item v-for="item in Object.keys(userInfoData)" :label="item">{{
          userInfoData[item]
        }}</el-descriptions-item>
      </el-descriptions>
    </div>
  </cardBg>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import cardBg from "@/components/basicComponents/cell/card/cardBg.vue";
import {
  componentInfo,
  inputType,
  propInfo,
  gridSizeMaker,
} from "@/components/basicComponents/grid/module/dataTemplate";
export default defineComponent({
  componentInfo: {
    labelNameCn: "用户信息展示组件",
    key: "userInfoCard",
    description: "展示用户信息",
    gridInfo: {
      middle: gridSizeMaker(4, 3),
    },
  } as componentInfo,

  propsDetail: {
    userInfo: {
      label: "用户信息",
      type: inputType.obj,
    },
    showTemplate: {
      label: "可用展示模板函数",
      description: "需要输出SearchStorage构建的对象",
      type: inputType.functionEditor,
    },
  } as propInfo,

  props: ["userInfo", "showTemplate", "title", "watchKey", "baseData"],
  components: {
    cardBg,
  },
  setup(props, context) {
    let userInfoData = ref({});
    if (props.userInfo) userInfoData = props.userInfo;
    console.log(props.userInfo, "asd");
    context.emit("ready");
    watch(
      () => props.baseData,
      (e) => {
        if (e[props.watchKey]) {
          userInfoData = e[props.watchKey];
        }
      }
    );
    return { userInfoData };
  },
});
</script>

<style scoped></style>
