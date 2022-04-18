<!--
 * @Date: 2022-04-12 20:07:58
 * @LastEditors: CZH
 * @LastEditTime: 2022-04-18 09:54:03
 * @FilePath: /configforpagedemo/src/components/animate/lineSlideExchange.vue
-->
<template>
  <div class="wholeScreen">
    <div class="rotateBox" :style="`transform:rotate(${rotate}deg)`">
      <div
        v-for="(item, index) in linesArray"
        :key="`lines${index}}`"
        :class="`lineFilter ${status}`"
        :style="{
          width: `${item.width}%`,
          backgroundColor: `${item.color}`,
          transform: `translateY(${
            status == 'slideIn' ? '0' : status == 'slideOut' ? '100' : '-100'
          }%)`,
          animationDuration: `${0.1 + index * 0.1}s`,
          boxShadow: `0px 0px ${item.width / 2}vw ${item.color}`,
        }"
      ></div>
    </div>
  </div>
</template>

<script lang="tsx">
import { defineComponent, toRefs, ref } from "vue";

interface lineObj {
  color: string;
  width: number;
}

/**
 * @name: rgbToHex
 * @description: rgbToHex
 * @authors: CZH
 * @Date: 2022-04-17 19:39:21
 * @param {*} r
 * @param {*} g
 * @param {*} b
 */
function rgbToHex(r: number, g: number, b: number): string {
  var hex = ((r << 16) | (g << 8) | b).toString(16);
  return "#" + new Array(Math.abs(hex.length - 7)).join("0") + hex;
}

/**
 * @name: hexToRgb
 * @description: hexToRgb
 * @authors: CZH
 * @Date: 2022-04-17 19:39:38
 * @param {*} hex
 */
function hexToRgb(hex: string): Array<number> {
  let rgb: Array<number> = [];
  for (var i = 1; i < 7; i += 2) {
    rgb.push(parseInt("0x" + hex.slice(i, i + 2)));
  }
  return rgb;
}

/**
 * @name: getColorList
 * @description: 获取颜色列表
 * @authors: CZH
 * @Date: 2022-04-16 23:23:32
 * @param {*} colorList
 */
function getColorList(
  startColor: string,
  endColor: string,
  colorNum = 10
): Array<string> {
  let colorArray: Array<string> = [];
  let sColor = hexToRgb(startColor),
    eColor = hexToRgb(endColor);
  let rStep = (eColor[0] - sColor[0]) / colorNum,
    gStep = (eColor[1] - sColor[1]) / colorNum,
    bStep = (eColor[2] - sColor[2]) / colorNum;
  for (let i = 0; i <= colorNum; i++) {
    colorArray.push(
      rgbToHex(rStep * i + sColor[0], gStep * i + sColor[1], bStep * i + sColor[2])
    );
  }
  return colorArray;
}

export default defineComponent({
  name: "lineSlideExchange",
  props: {
    linesNumber: {
      type: Number,
      default: 30,
    },
    startColor: {
      type: String,
      default: "#ff0000",
    },
    endColor: {
      type: String,
      default: "#ff9900",
    },
    rotate: {
      type: Number,
      default: 45,
    },
  },
  setup: (props, { expose }) => {
    // 计算颜色列表
    const { linesNumber, startColor, endColor } = toRefs<any>(props);
    const colorArray: Array<string> = getColorList(
      startColor.value,
      endColor.value,
      linesNumber.value
    );
    let linesArray: Array<lineObj> = [];
    for (let x = 0; x <= linesNumber.value; x++) {
      linesArray.push({
        color: colorArray[x % colorArray.length],
        width: 100 / linesNumber.value,
      });
    }
    let status = ref("");

    // 开始动画
    const start = () => {
      status.value = "slideIn";
    };

    // 结束动画
    const finish = () => {
      status.value = "slideOut";
    };

    expose({ start, finish });
    return {
      status,
      linesArray,
    };
  },
});
</script>

<style lang="scss">
@keyframes lineSlideIn {
  0% {
    transform: translateY(-100%);
  }
  100% {
    transform: translateY(0%);
  }
}
@keyframes lineSlideOut {
  0% {
    transform: translateY(0%);
  }
  100% {
    transform: translateY(100%);
  }
}
.wholeScreen {
  width: 100vw;
  height: 100vh;
  position: fixed;
  overflow: hidden;
  top: 0px;
  left: 0px;
  backdrop-filter: blur(2px);
  background: rgba(255, 255, 255, 0.1);
  .rotateBox {
    position: absolute;
    top: 50%;
    left: 50%;
    margin-left: -100vw;
    margin-top: -100vh;
    width: 200vw;
    height: 200vh;
    display: flex;
    flex-wrap: column;
    .lineFilter {
      height: 100%;
      line-height: 100%;
      animation-iteration-count: infinite;
    }
    .slideIn {
      animation: lineSlideIn ease-in-out;
    }
    .slideOut {
      animation: lineSlideOut ease-in-out;
    }
  }
}

.zIndexTop {
  z-index: 10000000000;
}
</style>
