<!--
 * @Date: 2022-05-18 23:06:49
 * @LastEditors: CZH
 * @LastEditTime: 2022-05-18 23:07:03
 * @FilePath: /configforpagedemo/src/components/basicComponents/cell/card/cardBg.vue
-->
<script lang="ts">
import { defineComponent, h } from "vue";

export default defineComponent({
  props: {
    cusStyle: {
      type: Object,
      default: () => {
        return {} as { [key: string]: any };
      },
    },
  },
  setup(props, context) {
    const { slots } = context;
    return () =>
      h(
        "div",
        {
          style: {
            width: "100%",
            height: "100%",
            background: "#FFFFFF",
            borderRadius: "6px",
            overflow: "hidden",
            boxShadow:
              "  0px 0px 2.2px rgba(0, 0, 0, 0.1), 0px 0px 5.3px rgba(0, 0, 0, 0.005),0px 0px 10px rgba(0, 0, 0, 0.007),0px 0px 17.9px rgba(0, 0, 0, 0.009),0px 0px 33.4px rgba(0, 0, 0, 0.01),0px 0px 80px rgba(0, 0, 0, 0.01)",
            ...props.cusStyle,
          },
        },
        { default: () => slots.default?.(props, context) }
      );
  },
});
</script>
