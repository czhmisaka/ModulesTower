<!--
 * @Date: 2023-01-26 09:47:29
 * @LastEditors: CZH
 * @LastEditTime: 2023-01-26 09:49:20
 * @FilePath: /configforpagedemo/src/modules/photoWebSiteModule/component/imageList/waterFallItem.vue
-->

<script lang="ts">
import { defineComponent, h } from "vue";

export default defineComponent({
  name: "waterFallItem",
  props: ["item"],
  setup(props, context) {
    return h("img", {
      alt: props.item,
      src: props.item,
    });
  },
});
</script>

<style scoped></style>
