<template>
  <cardBg :cusStyle="{}">
    <div class="wholeBox" :id="`canvas_${title}`"></div>
  </cardBg>
</template>

<script lang="tsx">
import { defineComponent } from "vue";
import cardBg from "@/components/basicComponents/cell/card/cardBg.vue";
import {
  componentInfo,
  inputType,
  propInfo,
  gridSizeMaker,
} from "@/components/basicComponents/grid/module/dataTemplate";
import ForceGraph3D from "3d-force-graph";
export default defineComponent({
     components: { cardBg },
    componentInfo: {
        labelNameCn: "3d力导图",
        key: "3dforceGraph",
        description: "3dforceGraph",
        gridInfo: {
        middle: gridSizeMaker(12, 8),
        },
    } as componentInfo,
    props: ["baseData", "sizeUnit", "title", "chartOptions", "extraFuncList"],
    data: () => {
        return {
            ForceGraph3D,
        };
    },
    watch: {
        chartOptions: {
            handler(val) {
                
                this.init();
            },
        }
    },
    mounted() {
        console.log('pppp')
        const that= this
        setTimeout(() => {
                that.$emit('ready')
            }, 100)
        this.init();
    },
    methods:{
        init(){
             const that = this;
             setTimeout(()=>{
                if (that.chartOptions) {
                    const myGraph = ForceGraph3D();
                    const canvas = myGraph(document.getElementById(`canvas_${that.title}`))
                    .graphData(that.chartOptions)
                    .backgroundColor('#ffffff')
                    .linkColor('gray')
                }
             })
        }
    }
})
</script>

<style>

</style>