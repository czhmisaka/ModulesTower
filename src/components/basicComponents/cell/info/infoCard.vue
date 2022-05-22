<!--
 * @Date: 2022-05-22 16:57:40
 * @LastEditors: CZH
 * @LastEditTime: 2022-05-22 18:12:05
 * @FilePath: /configforpagedemo/src/components/basicComponents/cell/info/infoCard.vue
-->
<script lang="ts">
import { defineComponent, h, toRefs } from "vue";

import { ElCard } from "element-plus";
import cardBg from "../card/cardBg.vue";
export default defineComponent({
  props: {
    sizeUnit: {
      type: Object,
      default: () => {
        return {};
      },
    },
    title: {
      type: String,
      default: "",
    },
    content: {
      type: String,
      default: "",
    },
    img: { type: String, default: "" },
  },
  setup(props, context) {
    const { title, content, img } = toRefs(props);
    const _blockSize = toRefs(props.sizeUnit.blockSize);
    return () => [
      h(
        cardBg,
        {
          cusStyle: {
            overflow: "hidden",
          },
        },
        () => [
          h(
            "div",
            {
              style: {
                width: "100%",
                height: "100%",
                backgroundImage: `url(${img.value})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              },
            },
            [
              h(
                "div",
                {
                  style: {
                    position: "absolute",
                    top: "0px",
                    fontSize: "20px",
                    margin: "12px",
                    color: "white",
                    backdropFilter: "blur(10px)",
                    borderRadius: "12px",
                    padding: "2px 4px",
                  },
                },
                [h("span", title.value)]
              ),
              h(
                "div",
                {
                  style: {
                    position: "relative",
                    top: "80%",
                    overflow: "hidden",
                    width: "100%",
                    height: "20%",
                    bottom: "0px",
                    background: "rgba(255,255,255, 0.4)",
                    backdropFilter: "blur(2px)",
                    color: "white",
                    textAlign: "left",
                    padding: "0px 12px",
                  },
                },
                [h("span", content.value)]
              ),
            ]
          ),
        ]
      ),
    ];
  },
});
</script>
