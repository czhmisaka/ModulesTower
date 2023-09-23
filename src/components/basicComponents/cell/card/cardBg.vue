<!--
 * @Date: 2022-05-18 23:06:49
 * @LastEditors: CZH
 * @LastEditTime: 2023-09-04 21:23:46
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
    noHover: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, context) {
    const { slots } = context;
    const { isDark } = useDark();
    return () =>
      h(
        "div",
        {
          class: `${isDark.value ? "" : "shadow"} ${props.noHover ? "" : "hover"}`,
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

.__hover {
  box-shadow: inset 0px 0px 0px rgba(0, 0, 0, 0.3),
    inset -0px -0px 0px rgba(255, 255, 255, 0.7), -0px -0px 0px rgba(0, 0, 0, 0.4);
  transition: all 0.4s;
  z-index: 10000;
}
.__hover:hover {
  padding: 3px;
  box-shadow: inset 3px 3px 3px rgba(0, 0, 0, 0.3),
    inset -3px -3px 3px rgba(255, 255, 255, 0.7), -3px -3px 12px rgba(0, 0, 0, 0.4);
  .__context {
    border-radius: 3px;
    box-shadow: inset -3px -3px 3px rgba(255, 255, 255, 0.7);
  }
}
</style>
