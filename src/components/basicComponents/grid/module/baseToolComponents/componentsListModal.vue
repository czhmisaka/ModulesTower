<!--
 **
 * @Date: 2022-05-29 01:32:45
 * @LastEditors: CZH
 * @LastEditTime: 2022-05-29 01:34:39
 * @FilePath: /configforpagedemo/src/components/basicComponents/grid/module/baseToolComponents/componentsLIstModal.vue
 * @Description: 一个默认的组件列表模态框如  
-->
<template>
  <div></div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { componentLists } from "@/components/basicComponents/grid/module/gridCard/module/componentLists";

export default defineComponent({
  props: ["gridList"],
  data() {
    return {
      componentLists,
    };
  },
  methods: {
    open() {},
  },
});
</script>
