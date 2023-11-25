<!--
 * @Date: 2022-05-18 23:06:49
 * @LastEditors: CZH
 * @LastEditTime: 2023-09-12 16:35:02
 * @FilePath: /lcdp_fe_setup/src/components/basicComponents/cell/card/cardBg.vue
-->

<script lang="ts">
import { defineComponent, h } from "vue";
import { deviceDetection, useDark, useGlobal } from "@pureadmin/utils";
import { ElIcon } from "element-plus";
import IconCell from "../icon/iconCell.vue";
import { getIcon } from "@/utils";

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
    titleIcon: {
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
          style: {
            width: "100%",
            height: "100%",
            filter: isDark.value ? "" : "drop-shadow(0px 0px 2px rgba(0, 0, 0, 0.1))",
            background: isDark.value ? "#020409" : "#FFFFFF",
            borderRadius: "6px",
            overflow: "hidden",
            ...props.cusStyle,
          },
        },
        {
          default: () => [
            props.title
              ? h(
                "div",
                {
                  style: {
                    "text-align": "left",
                    "font-weight": "600",
                    "border-bottom": "1px #eee solid",
                    color: "#666",
                    "font-size": "14px",
                    display: "flex",
                    "align-items": "center",
                  },
                },
                [
                  props.titleIcon
                    ? h(
                      ElIcon,
                      {
                        style: {},
                        size: 14,
                      },
                      h(getIcon(props.titleIcon + ""))
                    )
                    : null,
                  props.title,
                ]
              )
              : null,
            slots.default?.(props, context),
          ],
        }
      );
  },
});
</script>

<style lang="scss" scoped></style>
