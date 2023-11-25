<!--
 * @Date: 2023-07-26 16:57:15
 * @LastEditors: CZH
 * @LastEditTime: 2023-09-06 19:20:00
 * @FilePath: /lcdp_fe_setup/src/components/ReIcon/src/icon.vue
-->
<template>
  <ElIcon
    v-if="Icon.iconType == IconType.elIcon && Icon.src"
    :size="size"
    :color="Icon.color"
  >
    <component :is="getIcon(Icon.src)"></component>
  </ElIcon>
  <!-- <ElIcon v-if="Icon.iconType == IconType.svg" :color="Icon.color">
    <component :is="getSvgIcon(Icon.src)"></component>
  </ElIcon> -->
</template>

<script lang="ts">
import {
  IconType,
  iconTemplate,
} from "@/modules/userManage/component/searchTable/inputElementComponent/iconPicker";
import { getIcon } from "@/utils";
import { defineComponent } from "vue";
const fuck = import.meta.glob("@/assets/svg/icon/*.svg");
export default defineComponent({
  props: ["icon", "size"],
  data: () => {
    return {
      Icon: {} as iconTemplate,
      IconType,
    };
  },
  mounted() {
    this.Icon = this.icon;
  },
  methods: {
    getSvgIcon(name) {
      return "";
    },
    getIcon,
  },
});
</script>

<style scoped></style>
