<!--
 * @Date: 2023-05-30 10:47:09
 * @LastEditors: CZH
 * @LastEditTime: 2023-12-06 18:17:43
 * @FilePath: /lcdp_fe_setup/src/layout/components/panel/index.vue
-->
<script setup lang="ts">
import { ref } from "vue";
import { onClickOutside } from "@vueuse/core";
import { emitter } from "@/utils/mitt";
import { isMobile } from "@/utils/Env";
import { useCardStyleConfigHook } from '../../../store/modules/cardStyleConfig';

let show = ref<Boolean>(false);
const target = ref(null);
onClickOutside(target, (event: any) => {
  if (event.clientX > target.value.offsetLeft) return;
  show.value = false;
});

emitter.on("openPanel", () => {
  show.value = true;
});

</script>

<template>
  <el-drawer v-model="show" :size="`calc(${isMobile() ? 100 : 30}% - ${2 * useCardStyleConfigHook().get('margin')}px)`"
    :with-header="false" :append-to-body="true" :close-on-click-modal="true" :show-close="true" :style="`border-radius: ${useCardStyleConfigHook().get('borderRadius')
      }px;margin: ${useCardStyleConfigHook().get('margin')
      }px;height: calc(100vh - ${2 * useCardStyleConfigHook().get('margin')
      }px);box-shadow: rgba(0, 0, 0, 0.1) -6px 6px 12px, inset rgba(0,0,0,0.05) -3px 3px 12px 0px`">
    <slot></slot>
  </el-drawer>
</template>
