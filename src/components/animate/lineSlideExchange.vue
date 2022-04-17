<!--
 * @Date: 2022-04-12 20:07:58
 * @LastEditors: CZH
 * @LastEditTime: 2022-04-16 22:28:24
 * @FilePath: /configforpagedemo/src/components/animate/lineSlideExchange.vue
-->

<script lang="tsx">
import { defineComponent, h, toRefs, PropType } from "vue";

interface lineObj {
  color: string;
  width: number;
}

function rgbToHex(r: number, g: number, b: number): string {
  var hex = ((r << 16) | (g << 8) | b).toString(16);
  return "#" + new Array(Math.abs(hex.length - 7)).join("0") + hex;
}

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
  console.log([...arguments], "asd", colorArray);
  return colorArray;
}

export default defineComponent({
  name: "lineSlideExchange",
  methods: {
    async start() {},
  },
  props: {
    linesNumber: {
      type: Number,
      default: 10,
    },
    startColor: {
      type: String,
      default: "#ff0000",
    },
    endColor: {
      type: String,
      default: "#ff9900",
    },
  },
  setup: (props) => {
    const { linesNumber, startColor, endColor } = toRefs<any>(props);
    console.log(startColor.value, endColor.value, linesNumber.value, "asd");
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
    return () => (
      <div class="wholeScreen">
        {linesArray.map((item, index) => {
          return (
            <div
              class={"lineFilter line" + index}
              style={{
                backgroundColor: item.color,
                width: item.width * 2 + "vw",
                height: "100vh",
                boxShadow: "0px 0px 10px " + item.color,
                animationDuration: 0.1 + 0.2 * index + "s",
                transform: "translate(-50vw, 0vh) rotateZ(45deg) scale(2)",
              }}
            ></div>
          );
        })}
      </div>
    );
  },
});
</script>

<style lang="scss" scoped>
@keyframes lineSlideIn {
  0% {
    transform: translate(-150vw, 100vh) rotateZ(45deg) scale(2);
  }
  100% {
    transform: translate(-50vw, 0vh) rotateZ(45deg) scale(2);
  }
}
.wholeScreen {
  width: 100vw;
  height: 100vh;
  position: fixed;
  overflow: hidden;
  top: 0px;
  left: 0px;
  z-index: 9999;
  display: flex;
  flex-wrap: column;
  backdrop-filter: blur(10px);
  .lineFilter {
    animation: lineSlideIn ease-in-out;
  }
}

.zIndexTop {
  z-index: 10000000000;
}
</style>
