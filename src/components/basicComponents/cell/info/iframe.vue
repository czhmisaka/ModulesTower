<!--
 * @Date: 2022-05-22 18:23:04
 * @LastEditors: CZH
 * @LastEditTime: 2022-05-22 20:04:04
 * @FilePath: /configforpagedemo/src/components/basicComponents/cell/info/iframe.vue
-->
<script lang="ts">
import { defineComponent, reactive, h, toRefs, toRef } from "vue";
import { baseComponents } from "@/components/basicComponents/grid/module/gridCard/baseCardComponentMixins";
import cardBg from "../card/cardBg.vue";

export default defineComponent({
  mixins: [baseComponents],
  props: {
    url: String,
    sizeUnit: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  setup(props, context) {
    const isLoading = reactive({
      isLoading: true,
    });
    const { url } = toRefs(props);
    return () => [
      h(cardBg, {
      }, () => [
        h("iframe", {
          style: {
            width: "100%",
            height: "100%",
            border: "none",
            borderRadius: "12px",
          },
          src: url.value,
          onLoad: () => {
              context.emit("ready")
          },
        }),
      ]),
    ];
  },
});
</script>
