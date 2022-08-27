<!--
 * @Date: 2022-05-22 18:23:04
 * @LastEditors: CZH
 * @LastEditTime: 2022-08-27 15:49:21
 * @FilePath: /configforpagedemo/src/components/basicComponents/cell/info/iframe.vue
-->
<script lang="ts">
import { defineComponent, ref, h, toRefs } from "vue";
import { baseComponents } from "@/components/basicComponents/grid/module/gridCard/baseCardComponentMixins";
import cardBg from "../card/cardBg.vue";
import { changeVisible } from "@/components/basicComponents/grid/module/cardApi";

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
    const { url } = toRefs(props);
    context.emit("ready");
    return () => [
      h(cardBg, {}, () => [
        h("iframe", {
          style: {
            width: "100%",
            height: "100%",
            border: "none",
            borderRadius: "12px",
          },
          src: url.value,
          onLoad: () => {
            context.emit("ready");
          },
        }),
      ]),
    ];
  },
});
</script>
