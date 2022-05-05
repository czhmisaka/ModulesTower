<!--
 * @Date: 2022-05-05 00:07:38
 * @LastEditors: CZH
 * @LastEditTime: 2022-05-05 00:07:38
 * @FilePath: /configforpagedemo/src/components/basicComponents/grid/module/gridCard/module/cardBox.vue
-->

<template>
  <div class="moveBox">
    <slot></slot>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    detail: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  methods: {},
  setup() {},
});
</script>
