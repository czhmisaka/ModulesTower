<!--
 * @Date: 2022-05-18 23:06:49
 * @LastEditors: CZH
 * @LastEditTime: 2023-12-22 11:15:59
 * @FilePath: /ConfigForDesktopPage/src/components/basicComponents/cell/card/cardBg.vue
-->

<script lang="ts">
import { defineComponent, h } from "vue";
import { deviceDetection, useDark, useGlobal } from "@pureadmin/utils";
import { ElIcon } from "element-plus";
import IconCell from "../icon/iconCell.vue";
import { getIcon } from "@/utils";
import { cardStyleConfigStore, useCardStyleConfigHook } from '../../../../store/modules/cardStyleConfig';
import { Store } from "pinia";
import { toRefs } from "vue";
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
    let { card, cardDark } = toRefs(useCardStyleConfigHook())
    return () =>
      h(
        "div",
        {
          style: {
            width: "100%",
            height: "100%",
            filter: isDark.value ? cardDark.value.filter : card.value.filter,
            // filter: isDark.value ? "" : "drop-shadow(0px 0px 2px rgba(0, 0, 0, 0.1))",
            background: isDark.value ? cardDark.value.background : card.value.background,
            borderRadius: useCardStyleConfigHook().get('borderRadius') + 'px',
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
