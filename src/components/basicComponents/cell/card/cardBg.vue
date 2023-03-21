<!--
 * @Date: 2022-05-18 23:06:49
 * @LastEditors: CZH
 * @LastEditTime: 2023-03-16 15:21:24
 * @FilePath: /configforpagedemo/src/components/basicComponents/cell/card/cardBg.vue
-->

<script lang="ts">
import { defineComponent, h } from "vue";
import { deviceDetection, useDark, useGlobal } from "@pureadmin/utils";

export default defineComponent({
  props: {
    cusStyle: {
      type: Object,
      default: () => {
        return {} as { [key: string]: any };
      },
    },
    title: {
      type: String,
      default: "",
    },
  },
  setup(props, context) {
    const { slots } = context;
    const { isDark } = useDark();
    return () =>
      h(
        "div",
        {
          class: isDark.value ? "" : "shadow",
          style: {
            width: "100%",
            height: "100%",
            background: isDark.value ? "#020409" : "#FFFFFF",
            borderRadius: "6px",
            overflow: "hidden",
            ...props.cusStyle,
          },
        },
        { default: () => slots.default?.(props, context) }
      );
  },
});
</script>
<style lang="scss" scoped>
.shadow {
  filter: drop-shadow(0px 0px 4px rgba(0, 0, 0, 0.05));
}
</style>
