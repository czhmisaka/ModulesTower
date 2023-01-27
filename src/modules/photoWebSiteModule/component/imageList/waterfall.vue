<!--
 * @Date: 2023-01-21 21:10:09
 * @LastEditors: CZH
 * @LastEditTime: 2023-01-27 18:50:07
 * @FilePath: /configforpagedemo/src/modules/photoWebSiteModule/component/imageList/waterfall.vue
-->
<template>
  <cardBg>
    <div class="wholeScreen" ref="waterfall" v-if="open">
      <div ref="scroll">
        <div class="row" v-for="imgList in rowList">
          <waterFallItem
            v-for="item in imgList"
            :url="item.url"
            :width="item.width"
            :height="row.height"
            :item="item"
            :cusStyle="{
              margin: row.margin + 'px',
            }"
          ></waterFallItem>
        </div>
      </div>
    </div>
  </cardBg>
</template>

<script lang="ts">
import { defineComponent, watch } from "vue";
import cardBg from "@/components/basicComponents/cell/card/cardBg.vue";
import {
  componentInfo,
  inputType,
  propInfo,
  gridSizeMaker,
} from "@/components/basicComponents/grid/module/dataTemplate";
import waterFallItem from "@/modules/photoWebSiteModule/component/imageList/waterFallItem.vue";

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
        if (Object.keys(val).indexOf(this.watchKeyForCategory) > -1) {
          this.$nextTick();
          this.data.offset = 0;
          this.rowList = [[]];
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
        limit: 100,
        offset: 0,
      } as { [key: string]: number },
      open: false,

      row: {
        height: "140",
        rowIndexSize: 20,
        rowIndexNumber: 0,
        lastOffset: 0,
        margin: 3,
      },
    };
  },
  methods: {
    async init() {
      const that = this;
      const elw = that.$refs["waterfall"];
      let a = false;

      setTimeout(() => {
        that.row.rowIndexNumber = Math.floor(
          (elw.offsetWidth + 300) / that.row.rowIndexSize
        );
        that.row.lastOffset = (elw.offsetWidth + 300) % that.row.rowIndexSize;
      }, 300);
      window.addEventListener("resize", () => {
        that.row.rowIndexNumber = Math.floor(
          (elw.offsetWidth + 300) / that.row.rowIndexSize
        );
        that.row.lastOffset = (elw.offsetWidth + 300) % that.row.rowIndexSize;
      });
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

    async getImgList(val = this.baseData[this.watchKeyForCategory], isInit = false) {
      const that = this;
      if (!val) return null;
      let { limit, offset } = that.data;
      let list = await that.getFunc(that, {
        key: val,
        limit,
        offset,
      });
      list = list.map((x) => {
        return {
          ...x,
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
      list.sort((a, b) => b.rowIndex - a.rowIndex);
      function getRow() {
        return that.rowList[that.rowList.length - 1];
      }
      function getRowIndex() {
        let row = getRow();
        let rowIndex =
          row.length > 0
            ? that.row.rowIndexNumber -
              row
                .map((x) => Math.floor(x.width / that.row.rowIndexSize))
                .reduce((a, b) => a + b)
            : that.row.rowIndexNumber;
        return rowIndex;
      }
      let number = 0;
      while (list.length > 0) {
        number++;
        if (number > 500) break;
        for (let i = 0; i < list.length; i++) {
          let x = list[i];
          if (getRowIndex() >= x.rowIndex) {
            that.rowList[that.rowList.length - 1].push(x);
            list[i] = false;
          }
        }
        list.filter(Boolean);
        for (let i = list.length - 1; i >= 0; i--) {
          let x = list[i];
          if (getRowIndex() >= x.rowIndex) {
            that.rowList[that.rowList.length - 1].push(x);
            list[i] = false;
          } else {
            break;
          }
        }
        list.filter(Boolean);
        if (getRowIndex() > 0) {
          let row = that.rowList[that.rowList.length - 1];
          let cell = row[row.length - 1];
          if (cell) {
            cell = {
              ...cell,
              width: cell.width + getRowIndex() * that.row.rowIndexSize + this.row.offset,
            };
            that.rowList.push([]);
          }
        }
        list.filter(Boolean);
        if (list.length > 0 && getRowIndex() == 0) that.rowList.push([]);
      }
      that.data = { limit, offset: list.length + offset };
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
  height: calc(140px + 40px);
  display: flex;
  justify-content: flex-start;
}
</style>
