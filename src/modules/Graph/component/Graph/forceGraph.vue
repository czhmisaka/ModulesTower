<!--
 * @Date: 2023-02-20 09:46:29
 * @LastEditors: CZH
 * @LastEditTime: 2023-02-20 10:05:02
 * @FilePath: /configforpagedemo/src/modules/Graph/component/Echarts/echarts.vue
-->
<template>
  <cardBg
    :cusStyle="{
      padding: '12px',
    }"
  >
    <div :id="`canvas_${title}`" class="wholeBox"></div>
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
        this.$emit("ready");
      },
    },
  },
  mounted() {
    if (this.chartOptions) {
      const myGraph = ForceGraph();
      const canvas = myGraph(document.getElementById(`canvas_${this.title}`))
        .graphData(this.chartOptions)
        .nodeCanvasObject((node, ctx, globalScale) => {
          const label = node["name"] + "";
          const fontSize = 14 / globalScale;
          ctx.font = `${fontSize}px Sans-Serif`;
          const textWidth = ctx.measureText(label).width;
          const bckgDimensions = [textWidth, fontSize].map((n) => n + fontSize * 0.2); // some padding
          ctx.beginPath();
          ctx.arc(node.x, node.y, textWidth / 2 + node["val"], 0, 360, false);
          ctx.fillStyle = node["bgColor"];
          ctx.fill();
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillStyle = node["color"] || "#fff";
          ctx.fillText(label, node.x, node.y);
          node["__bckgDimensions"] = bckgDimensions; // to re-use in nodePointerAreaPaint
        })
        .nodeRelSize(10)
        .linkDirectionalParticles(2)
        .linkDirectionalArrowLength(10)
        .d3VelocityDecay(0.3);
      canvas.d3Force("link").distance((link) => {
        console.log(link.target.type);
        return link.target.type == "问题编号" ? 200 : 80;
      });
      canvas.d3Force("charge").strength(-100);
    }
    this.$emit("ready");
  },

  methods: {
    async init() {},
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
