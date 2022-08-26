<!--
 * @Date: 2022-05-22 18:23:04
 * @LastEditors: CZH
 * @LastEditTime: 2022-08-24 00:17:48
 * @FilePath: /configforpagedemo/src/components/basicComponents/cell/info/iframe.vue
-->
<script lang="ts">
import { defineComponent, reactive, h, toRefs, onMounted } from "vue";
import { baseComponents } from "@/components/basicComponents/grid/module/gridCard/baseCardComponentMixins";
import cardBg from "../card/cardBg.vue";
import {
  changeVisible,
  changeCardPosition,
  changeCardSize,
} from "@/components/basicComponents/grid/module/cardApi";

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

    onMounted(async () => {
      setInterval(() => {
        let data = {
          elcard1: {
            x: Math.floor(Math.random() * 8),
            y: Math.floor(Math.random() * 4),
          },
          elcard2: {
            x: Math.floor(Math.random() * 8),
            y: Math.floor(Math.random() * 4),
          },
          elcard3: {
            x: Math.floor(Math.random() * 8),
            y: Math.floor(Math.random() * 4),
          },
          elcard4: {
            x: Math.floor(Math.random() * 8),
            y: Math.floor(Math.random() * 4),
          },
        };
        changeCardPosition(context, data);
      }, 1000);
    });
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
