<!--
 * @Date: 2022-06-15 23:34:40
 * @LastEditors: CZH
 * @LastEditTime: 2022-06-15 23:34:51
 * @FilePath: /configforpagedemo/src/components/basicComponents/grid/module/baseToolComponents/funcComponentLoader.vue
-->
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    componentsDetail: {
      type: Object,
      default: () => {
        return {} as {
          [key: string]: any;
        };
      },
    },
  },
  setup() {},
});
</script>
