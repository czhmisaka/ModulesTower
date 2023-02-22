<!--
 * @Date: 2023-02-20 09:46:29
 * @LastEditors: CZH
 * @LastEditTime: 2023-02-20 10:05:02
 * @FilePath: /configforpagedemo/src/modules/Graph/component/Echarts/echarts.vue
-->
<template>
  <cardBg :cusStyle="{}">
    <div class="wholeBox" :id="`canvas_${title}`"></div>
  </cardBg>
</template>

<script lang="tsx">
import { defineComponent } from "vue";
import ForceGraph from "force-graph";
import cardBg from "@/components/basicComponents/cell/card/cardBg.vue";
import {
  componentInfo,
  inputType,
  propInfo,
  gridSizeMaker,
} from "@/components/basicComponents/grid/module/dataTemplate";
import { notDeepEqual } from "assert";

export default defineComponent({
  components: { cardBg },

  componentInfo: {
    labelNameCn: "力导图",
    key: "forceGraph",
    description: "forceGraph",
    gridInfo: {
      middle: gridSizeMaker(12, 8),
    },
  } as componentInfo,

  props: ["baseData", "sizeUnit", "title", "chartOptions", "extraFuncList"],
  data: () => {
    return {
      ForceGraph,
    };
  },
  watch: {
    chartOptions: {
      handler(val) {
        this.$emit("ready", true);
        this.init();
      },
    },
  },
  mounted() {
    this.init();
  },

  methods: {
    async init() {
      const that = this;
      setTimeout(() => {
        if (that.chartOptions) {
          const myGraph = ForceGraph();
          const canvas = myGraph(document.getElementById(`canvas_${that.title}`))
            .graphData(that.chartOptions)
            .nodeCanvasObject((node, ctx, globalScale) => {
              let label = node["name"] + "";
              let title = "【" + node["type"] + "】";
              label =
                label.length > 7
                  ? label.substring(0, 7) + " ..."
                  : label.length < 4
                  ? "  " + label + "  "
                  : label;
              const fontSize = 14 / globalScale;
              ctx.font = `${fontSize}px Sans-Serif`;
              const textWidth = ctx.measureText(label).width;
              const titleWidth = ctx.measureText(title).width;
              const bckgDimensions = [textWidth, fontSize].map((n) => n + fontSize * 0.2); // some padding
              ctx.beginPath();
              ctx.arc(
                node.x,
                node.y,
                (titleWidth > textWidth ? titleWidth : textWidth) / 2 + node["val"],
                0,
                360,
                false
              );
              ctx.fillStyle = node["bgColor"];
              ctx.fill();
              ctx.textAlign = "center";
              ctx.textBaseline = "middle";
              ctx.fillStyle = node["color"] || "#fff";
              ctx.fillText(label, node.x, node.y);
              ctx.fillText(title, node.x, node.y - fontSize - 1);
              node["__bckgDimensions"] = bckgDimensions; // to re-use in nodePointerAreaPaint
            })
            .nodeRelSize(10)
            .linkDirectionalParticles(1)
            .linkDirectionalArrowLength(10)
            .d3VelocityDecay(0.3);
          canvas.d3Force("link").distance((link) => {
            return link.target.type == "问题编号" ? 300 : 200;
          });
          canvas.d3Force("charge").strength(-400);
        }
        that.$emit("ready");
      }, 500 + Math.random() * 500);
    },
  },
});
</script>

<style scoped lang="scss">
.wholeBox {
  width: 100%;
  height: 100%;
  transition: all 0.3s;
}
</style>
