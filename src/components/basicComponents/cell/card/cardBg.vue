<!--
 * @Date: 2022-05-18 23:06:49
 * @LastEditors: CZH
 * @LastEditTime: 2023-03-15 21:53:34
 * @FilePath: /ConfigForDesktopPage/src/components/basicComponents/cell/card/cardBg.vue
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
            // boxShadow: isDark.value
            //   ? "  0px 0px 6.5px rgba(255, 255, 255, 0.26),0px 0px 52px rgba(255, 255, 255, 0.023)"
            //   : "  0px 0px 2.2px rgba(0, 0, 0, 0.1), 0px 0px 5.3px rgba(0, 0, 0, 0.005),0px 0px 10px rgba(0, 0, 0, 0.007),0px 0px 17.9px rgba(0, 0, 0, 0.009),0px 0px 33.4px rgba(0, 0, 0, 0.01),0px 0px 80px rgba(0, 0, 0, 0.01)",
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
