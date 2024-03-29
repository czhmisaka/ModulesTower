<!--
 * @Date: 2022-04-12 20:07:58
 * @LastEditors: CZH
 * @LastEditTime: 2022-04-18 09:54:03
 * @FilePath: /configforpagedemo/src/components/animate/lineSlideExchange.vue
-->
<template>
  <div
    class="wholeScreen"
    :style="{
      zIndex: status ? '10000000' : '-1',
    }"
  >
    <div
      class="rotateBox"
      :style="`transform:rotate(${rotate}deg);backdrop-filter: blur(2px);opacity:${
        status ? '1' : '0'
      }`"
      v-if="linesArray && linesArray.length > 0"
    >
      <div
        v-for="(item, index) in linesArray"
        :key="`lines${index}}`"
        :class="`lineFilter ${status}`"
        :ref="
          (el) => {
            if (el) linesArrayDom[i] = el;
          }
        "
        @animationend="
          (e) => {
            stopAnimation(e, index);
          }
        "
        :style="{
          width: `${item.width}%`,
          backgroundColor: `${item.color}`,
          transform: `translateY(${
            status == 'slideIn' ? '0' : status == 'slideOut' ? '100' : '-100'
          }%)`,
          animationDuration: `${(index * 0.05) / speed}s`,
          boxShadow: `0px 0px ${item.width / 2}vw ${item.color}`,
          zIndex: index,
        }"
      ></div>
    </div>
  </div>
</template>

<script lang="tsx">
import { defineComponent, toRefs, ref, reactive } from "vue";

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
): Array<lineObj> {
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
  let linesArray: Array<lineObj> = [];
  for (let x = 0; x <= colorNum; x++) {
    linesArray.push({
      color: colorArray[x % colorArray.length],
      width: 100 / colorNum,
    });
  }
  return linesArray;
}

export default defineComponent({
  name: "lineSlideExchange",
  props: {
    speed: {
      type: Number,
      default: 1,
    },
    linesNumber: {
      type: Number,
      default: 30,
    },
    startColor: {
      type: String,
      default: "#00aaff",
    },
    endColor: {
      type: String,
      default: "#ccaaff",
    },
    rotate: {
      type: Number,
      default: 30,
    },
  },
  setup: (props, { expose }) => {
    // 计算颜色列表
    const { linesNumber, startColor, endColor, speed, rotate } = toRefs<any>(props);
    let linesArray = ref(new Array<lineObj>());
    const linesArrayDom = ref([]);
    let status = ref("");

    // 开始动画
    const start = () => {
      linesArray.value = getColorList(
        startColor.value,
        endColor.value,
        linesNumber.value
      );
      status.value = "slideIn";
    };

    // 开始退出动画
    const finish = () => {
      linesArray.value = reactive(
        getColorList(startColor.value, endColor.value, linesNumber.value)
      );
      status.value = "slideOut";
    };

    // 动画停止
    const stopAnimation = (data: any, index: number) => {
      /**
       * @czhmisaka
       * 留个坑,需要完善结束时间判断,在结束时返回准确的状态
       */
      if (
        index >= linesArray.value.length / speed.value &&
        data.animationName == "lineSlideOut"
      ) {
        status.value = "";
      }
    };

    expose({ start, finish, stopAnimation });
    return {
      stopAnimation,
      status,
      linesArray,
      linesArrayDom,
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
  background: rgba(255, 255, 255, 0.1);
  overflow: hidden;
  transition: all 1s ease-in-out;
  .rotateBox {
    position: absolute;
    top: 50%;
    left: 50%;
    // 这里留一个坑,日后改为自适应所有分辨率比例,原理就是获取当前窗口长宽比,搭配转角去计算需要的宽高
    margin-left: -200vw;
    margin-top: -200vh;
    width: 400vw;
    height: 400vh;
    // 以上
    display: flex;
    flex-wrap: column;
    opacity: 0;
    .lineFilter {
      height: 100%;
      line-height: 100%;
      animation-iteration-count: infinite;
      border-radius: 30px;
    }
    .slideIn {
      animation: lineSlideIn ease-in;
    }
    .slideOut {
      animation: lineSlideOut ease-out;
    }
  }
}
</style>
