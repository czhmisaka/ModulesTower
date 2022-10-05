<!--
 * @Date: 2022-05-22 16:57:40
 * @LastEditors: CZH
 * @LastEditTime: 2022-05-22 20:16:03
 * @FilePath: /configforpagedemo/src/components/basicComponents/cell/info/infoCard.vue
-->
<script lang="ts">
import { defineComponent, h, toRefs } from "vue";
import { baseComponents } from "@/components/basicComponents/grid/module/gridCard/baseCardComponentMixins";

import { ElCard } from "element-plus";
import cardBg from "../card/cardBg.vue";
import { changeCardProperties } from "../../grid/module/cardApi";
import { gridCellTemplate } from "../../grid/module/dataTemplate";
import { infoType } from "./DynamicIsland";
export default defineComponent({
  mixins: [baseComponents],
  props: {
    gridList: {
      type: Object,
      default: () => {
        return [] as gridCellTemplate[];
      },
    },
    isBlack: {
      type: Boolean,
      default: false,
    },
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
    const { title, content, img, isBlack } = toRefs(props);
    // changeCardProperties
    context.emit("ready");
    return () => [
      h(
        cardBg,
        {
          ontouchend: () => {
            changeCardProperties(context, {
              DynamicIsland: {
                info: [
                  {
                    image: img.value,
                    type: infoType.image,
                    time: 5,
                  },
                ],
              },
            });
          },
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
                    color: isBlack.value ? "white" : "black",
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
                    width: "calc( 100% - 24px)",
                    height: "20%",
                    bottom: "0px",
                    background: isBlack.value
                      ? "rgba(255,255,255, 0.4)"
                      : "rgba( 0,0,0,0.4)",
                    backdropFilter: "blur(2px)",
                    color: "white",
                    textAlign: "left",
                    padding: "0px 12px",
                    fontSize: "8%",
                  },
                },
                [h("i", content.value)]
              ),
            ]
          ),
        ]
      ),
    ];
  },
});
</script>
