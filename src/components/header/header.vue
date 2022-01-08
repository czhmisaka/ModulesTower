<!--
 * @Date: 2021-12-30 19:40:58
 * @LastEditors: CZH
 * @LastEditTime: 2022-01-08 13:37:49
 * @FilePath: /configforpagedemo/src/components/header/header.vue
-->
<template>
  <div class="header">
    <div class="siteTitle">
      <div :class="isOpen ? 'normal' : 'mini'">
        <!-- 这边放上自己的icon -->
      </div>
      <div class="titl">
        
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "header",
  porps: {
    isOpen: {
      type: Boolean,
      default: false,
    },
    headerConfig: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {};
  },
  methods: {},
});
</script>
<style lang="scss" scoped>
.header {
  width: 100vw;
  height: 50px;
  box-shadow: 0px 0px 10px #ccc;
}
</style>