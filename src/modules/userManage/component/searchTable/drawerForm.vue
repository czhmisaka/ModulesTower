<!--
 * @Date: 2022-11-21 08:52:56
 * @LastEditors: CZH
 * @LastEditTime: 2022-11-21 08:54:50
 * @FilePath: /configforpagedemo/src/modules/userManage/component/searchTable/sideDialogForm.vue
-->
<template>
  <el-drawer v-model="isOpen" :with-header="false">
    <span>Hi there!</span>
  </el-drawer>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  data() {
    return {
      isOpen: false,
    };
  },
});
</script>

<style lang="scss" scoped></style>
