<!--
 * @Date: 2023-01-21 21:10:09
 * @LastEditors: CZH
 * @LastEditTime: 2023-01-31 09:34:30
 * @FilePath: /configforpagedemo/src/modules/photoWebSiteModule/component/imageList/waterfall.vue
-->
<template>
  <cardBg>
    <div class="wholeScreen" ref="waterfall" v-if="open">
      <div ref="scroll">
        <div class="row" v-for="imgList in rowList">
          <div
            style="
              position: absolute;
              z-index: 1283123;
              font-weight: 900;
              text-shadow: 1px;
              color: white;
            "
          >
            {{
              imgList.length > 1
                ? imgList.map((x) => x.rowIndex).reduce((a, b) => a + b)
                : 0
            }}
            {{ row.rowIndexNumber }}
            {{ row.rowIndexNumber * row.rowIndexSize + row.lastOffset }}
          </div>
          <waterFallItem
            v-for="item in imgList"
            :url="item.url"
            :width="item.width - row.margin * 2"
            :height="row.height"
            :item="item"
            :cusStyle="{
              margin: row.margin + 'px',
            }"
            :class="selectedId == item.id ? ' normal selectedIn' : 'normal'"
            @mouseenter="selectedId = item.id"
            @click="setImage(item)"
          ></waterFallItem>
        </div>
      </div>
    </div>
  </cardBg>
</template>

<script lang="ts">
import { defineComponent, watch } from "vue";
import cardBg from "@/components/basicComponents/cell/card/cardBg.vue";
import { setData } from "@/components/basicComponents/grid/module/cardApi/index";

import {
  componentInfo,
  inputType,
  propInfo,
  gridSizeMaker,
} from "@/components/basicComponents/grid/module/dataTemplate";
import waterFallItem from "@/modules/photoWebSiteModule/component/imageList/waterFallItem.vue";

let fuck = null;
let Index = {};
let isInit = false;
let imageListForReSize = [];
export default defineComponent({
  componentInfo: {
    labelNameCn: "瀑布流",
    key: "waterFall",
    description: "展示图片瀑布流",
    gridInfo: {
      middle: gridSizeMaker(3, 8),
    },
  } as componentInfo,

  propsDetail: {
    getFunc: {
      label: "获取图片的函数，搭配监听key使用",
      type: inputType.text,
    },
    watchKeyForCategory: {
      label: "baseData监听key(相册key)",
      type: inputType.text,
    },
    imageList: {
      label: "图片列表(直接渲染用）",
      type: inputType.array,
    },
  } as propInfo,

  baseProps: {},

  props: ["baseData", "sizeUnit", "watchKeyForCategory", "imageList", "getFunc"],
  components: { cardBg, waterFallItem },
  watch: {
    baseData: {
      handler: async function (val) {
        if (
          Object.keys(val).indexOf(this.watchKeyForCategory) > -1 &&
          Index != val[this.watchKeyForCategory]
        ) {
          Index = val[this.watchKeyForCategory];
          console.log("asdasd");
          this.data.offset = 0;
          this.rowList = [[]];
          imageListForReSize = [];
          await this.getImgList(val[this.watchKeyForCategory], true);
        }
      },
    },
  },
  async mounted() {
    this.open = true;
    if (this.imageList && this.imageList.length > 0) {
    }
    this.$emit("ready");
    await this.$nextTick();
    this.init();
  },
  data: () => {
    return {
      rowList: [[]] as {
        url: string;
        width: number;
        height: number;
        rowIndex: number;
        [key: string]: any;
      }[][],
      data: {
        limit: 70,
        offset: 0,
      } as { [key: string]: number },
      open: false,
      selectedId: -1,
      row: {
        height: "120",
        rowIndexSize: 2,
        rowIndexNumber: 0,
        lastOffset: 0,
        margin: 3,
      },
    };
  },
  methods: {
    async init() {
      if (isInit) return;
      isInit = true;
      const that = this;
      if (fuck) clearInterval(fuck);
      function fuckk(that) {
        const elw = that.$refs["waterfall"];
        const offsetForScrollBar = 0;
        const rowIndexNumber = Math.floor(
          (elw.offsetWidth - offsetForScrollBar) / that.row.rowIndexSize
        );
        const lastOffset = (elw.offsetWidth - offsetForScrollBar) % that.row.rowIndexSize;
        if (
          that.row.rowIndexNumber != rowIndexNumber ||
          that.row.lastOffset != lastOffset
        ) {
          that.row.rowIndexNumber = rowIndexNumber;
          that.row.lastOffset = lastOffset;
          if (that.rowList.length < 2) return;
          that.rowList = [[]];
          that.pkFunc(imageListForReSize);
        }
      }
      fuck = setInterval(() => {
        fuckk(that);
      }, 200);

      const elw = that.$refs["waterfall"];
      let a = false;

      fuckk(that);

      elw.addEventListener("scroll", (e) => {
        const scroll = that.$refs["scroll"];
        const box = scroll.parentElement;
        if (box.scrollTop + box.clientHeight > box.scrollHeight - 10) {
          if (a) return;
          a = true;
          that.getImgList();
          setTimeout(() => {
            a = false;
          }, 500);
        }
      });
    },

    setImage(data) {
      setData(this, { image: data });
    },

    async getImgList(val = this.baseData[this.watchKeyForCategory], isInit = false) {
      const that = this;
      if (!val) return null;
      let { limit, offset } = that.data;
      let list = await that.getFunc(that, {
        key: val,
        limit,
        offset,
      });
      that.data = { limit, offset: list.length + offset };
      list = list.map((x) => {
        return {
          ...x,
          origin: x,
          url: x.url,
          path: x.path,
          height: that.row.height,
          width:
            Math.floor(((that.row.height / x.height) * x.width) / that.row.rowIndexSize) *
            that.row.rowIndexSize,
          rowIndex: Math.floor(
            ((that.row.height / x.height) * x.width) / that.row.rowIndexSize
          ),
        };
      });
      imageListForReSize = imageListForReSize.concat(list);
      this.pkFunc(list);
    },

    pkFunc(lists) {
      let list = JSON.parse(JSON.stringify(lists));
      const that = this;
      list.sort((a, b) => b.rowIndex - a.rowIndex);
      function getRow() {
        return that.rowList[that.rowList.length - 1];
      }
      function getRowIndex() {
        let row = getRow();
        let rowIndex =
          row.length > 0
            ? that.row.rowIndexNumber - row.map((x) => x.rowIndex).reduce((a, b) => a + b)
            : that.row.rowIndexNumber;
        return rowIndex;
      }
      let number = 0;
      while (list.length > 0) {
        number++;
        list.sort((a, b) => b.rowIndex - a.rowIndex);
        if (number > list.length) break;
        for (let i = 0; i < list.length; i++) {
          let x = list[i];
          if (getRowIndex() > x.rowIndex) {
            that.rowList[that.rowList.length - 1].push(x);
            list[i] = false;
          }
        }
        list = list.filter(Boolean);
        for (let i = list.length - 1; i >= 0; i--) {
          let x = list[i];
          if (getRowIndex() >= x.rowIndex) {
            that.rowList[that.rowList.length - 1].push(x);
            list[i] = false;
          } else {
            break;
          }
        }
        list = list.filter(Boolean);
        const rowIndex = getRowIndex();
        if (rowIndex > 0 && list.length > 0) {
          let row = that.rowList[that.rowList.length - 1];
          let cell = row[row.length - 1];
          const { rowIndexSize, lastOffset } = that.row;
          console.log("qwe", lastOffset);
          if (cell) {
            cell = {
              ...cell,
              rowIndex: cell.rowIndex + rowIndex,
              width: (cell.rowIndex + rowIndex) * rowIndexSize + lastOffset,
            };
            that.rowList[that.rowList.length - 1][row.length - 1] = cell;
            that.rowList.push([]);
          }
        }
        if (list.length > 0 && rowIndex == 0) {
          that.rowList.push([]);
        }
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.wholeScreen {
  position: relative;
  width: calc(100% - 24px);
  height: calc(100% - 24px);
  margin: 12px;
  overflow-y: scroll;
}
#waterfall {
  min-height: 100%;
}
.row {
  width: 100%;
  height: calc(100px + 40px);
  display: flex;
  justify-content: flex-start;
}
.selectedIn {
  box-shadow: 0px 0px 2.5px rgba(9, 13, 255, 0.812), 0px 0px 2.7px rgba(9, 13, 255, 0.922),
    0px 0px 2.6px rgba(9, 13, 255, 0.934), 0px 0px 2.3px rgba(9, 13, 255, 0.906),
    0px 0px 2px rgba(9, 13, 255, 0.863), 0px 0px 1.7px rgba(9, 13, 255, 0.821),
    0px 0px 1.4px rgba(9, 13, 255, 0.794), 0px 0px 1.3px rgba(9, 13, 255, 0.797),
    0px 0px 1.5px rgba(9, 13, 255, 0.852), 0px 0px 4px rgba(9, 13, 255, 1);
}
.normal {
  transition: all 0.1s;
  border-radius: 2px;
}
</style>
