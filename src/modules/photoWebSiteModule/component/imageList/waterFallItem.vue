<!--
 * @Date: 2023-01-26 09:47:29
 * @LastEditors: CZH
 * @LastEditTime: 2023-01-29 11:51:46
 * @FilePath: /configforpagedemo/src/modules/photoWebSiteModule/component/imageList/waterFallItem.vue
-->

<script lang="ts">
import { defineComponent, h } from "vue";
import { useDark } from "@pureadmin/utils";
import { ElImage } from "element-plus";

export default defineComponent({
  name: "waterFallItem",
  props: ["url", "width", "height", "cusStyle", "item", "noPreview"],
  setup(props, context) {
    // console.log(props.item);
    const { isDark } = useDark();
    return () =>
      h(
        "div",
        {
          style: {
            float: "left",
            width: props.width ? props.width + "px" : "100%",
            height: props.height ? props.height + "px" : "",
            // backgroundSize: "cover",
            // backgroundImage: `url(${props.url})`,
            // backgroundPosition: "center",
            ...props.cusStyle,
            display: "inline-block",
          },
        },
        [
          h(ElImage, {
            style: { width: "100%", height: "100%", borderRadius: "3px" },
            src: props.url,
            teleported: true,
            fit: "cover",
            previewSrcList: props.noPreview
              ? []
              : [`/imageserver/` + props.item.origin.path],
          }),
          h(
            "div",
            {
              style: {
                height: "40px",
                width: "calc(100% - 12px)",
                position: "relative",
                marginTop: "-8px",
                color: isDark.value ? "white" : "#333",
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
                [`${props.item.origin.width} x ${props.item.origin.height}`]
              ),
            ]
          ),
        ]
      );
  },
});
</script>

<style scoped></style>
