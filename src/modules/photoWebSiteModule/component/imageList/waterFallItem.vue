<!--
 * @Date: 2023-01-26 09:47:29
 * @LastEditors: CZH
 * @LastEditTime: 2023-01-27 20:57:46
 * @FilePath: /configforpagedemo/src/modules/photoWebSiteModule/component/imageList/waterFallItem.vue
-->

<script lang="ts">
import { defineComponent, h } from "vue";

export default defineComponent({
  name: "waterFallItem",
  props: ["url", "width", "height", "cusStyle", "item"],
  setup(props, context) {
    console.log(props.item);
    return () =>
      h(
        "div",
        {
          style: {
            float: "left",
            width: props.width + "px",
            height: props.height + "px",
            backgroundSize: "cover",
            backgroundImage: `url(${props.url})`,
            backgroundPosition: "center",
            ...props.cusStyle,
            display: "inline-block",
          },
        },
        [
          h(
            "div",
            {
              style: {
                height: "40px",
                width: "calc(100% - 12px)",
                position: "relative",
                marginTop: "140px",
                color: "white",
                padding: "0px 6px ",
              },
            },
            [
              h(
                "div",
                {
                  style: {
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  },
                },
                props.item.file
              ),
              h(
                "div",
                {
                  style: {
                    color: "#666",
                    lineHeight: "12px",
                    fontSize: "10px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  },
                },
                props.item.date_available.replace("T", " ")
              ),
            ]
          ),
        ]
      );
  },
});
</script>

<style scoped></style>
