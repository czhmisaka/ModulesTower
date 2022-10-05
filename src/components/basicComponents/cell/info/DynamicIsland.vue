<!--
 * @Date: 2022-09-22 20:05:21
 * @LastEditors: CZH
 * @LastEditTime: 2022-09-23 00:40:18
 * @FilePath: /configforpagedemo/src/components/basicComponents/cell/info/DynamicIsland.vue
-->

<template>
  <cardBg :cus-style="status.cardBgStyle">
    <div :class="status.class" @touchstart="touchStart" @touchend="touchend">
      <div
        v-if="context.icon.length > 0"
        class="iconFlex"
        :style="{
          height: height + 'px',
          color: 'red',
        }"
      >
        <div class="iconShadow">
          <lessIcon
            :name="context.icon[0].name"
            :iconOption="{
              ...context.icon[0].iconOption,
              margin: height * 0.2 + 'px',
              fontSize: height * 0.6 + 'px',
            }"
          ></lessIcon>
        </div>
        <div class="iconShadow" v-if="context.icon.length > 1">
          <lessIcon
            :name="context.icon[1].name"
            :iconOption="{
              ...context.icon[1].iconOption,
              margin: height * 0.2 + 'px',
              fontSize: height * 0.6 + 'px',
            }"
          ></lessIcon>
        </div>
      </div>
      <div
        class="showBox"
        :style="{
          opacity: __isInInfo(infoType.image) ? 1 : 0,
          backgroundImage: `url(${context.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          marginTop: context.icon.length > 0 ? '-' + height + 'px' : '',
          boxShadow:
            'inset 0px 0px 30px black ,' +
            (context.icon.length > 0
              ? 'rgba(0, 0, 0, 1) 0px 18px 36px -18px inset;'
              : ''),
        }"
      >
        <div></div>
      </div>
    </div>
  </cardBg>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { getIcon } from "@/utils";
import { baseComponents } from "@/components/basicComponents/grid/module/gridCard/baseCardComponentMixins";
import cardBg from "@/components/basicComponents/cell/card/cardBg.vue";
import { deepClone } from "@/components/basicComponents/grid/module/cardApi/deepClone";
import { gridPositionCell, gridSizeCell } from "../../grid/module/dataTemplate";
import lessIcon from "@/components/basicComponents/cell/icon/lessIcon.vue";
import { infoType, infoTemplate } from "./DynamicIsland";
import {
  setData,
  changeVisible,
  changeCardPosition,
  changeCardSize,
  changeCardProperties,
} from "../../grid/module/cardApi/index";
import { stringify } from "querystring";

const keyFrameClass = {
  noMessage: "normal",
} as { [key: string]: string };

let dbTouch = false;

export default defineComponent({
  name: "灵动岛岛",
  nameEn: "DynamicIsland",
  mixins: [baseComponents],
  components: {
    cardBg,
    lessIcon,
  },
  props: {
    info: {
      type: Object,
      default: () => {
        return [] as infoTemplate[];
      },
    },

    size: {
      type: Object,
      default: () => {
        return {
          x: 4,
          y: 0.25,
          width: 0,
          height: 1,
          maxWidth: 8,
          maxHeight: 4,
        };
      },
    },
  },
  watch: {
    info: {
      handler(val) {
        if (val.length > 0) {
          this.pushInfo(val);
        }
      },
    },
    "context.info": {
      handler(val) {
        if (val.length == 0) {
          this.init();
        }
        if (!this.__isInInfo(infoType.image) && this.__isInInfo(infoType.icon)) {
          this.startIcon();
        }
        if (this.__isInInfo(infoType.image)) {
          val.map((item: infoTemplate) => {
            this.context.image = item.image;
          });
          this.startImage();
        }
      },
    },
  },
  data() {
    return {
      infoType,
      status: {
        activeType: "" as infoType,
        cardBgStyleOrigin: {
          background: "black",
          color: "white",
          overflow: "hidden",
        } as { [key: string]: any },

        cardBgStyle: {} as { [key: string]: any },
        class: "",
      },

      context: {
        info: [] as infoTemplate[],
        icon: [] as {
          name: string;
          iconOption: { [key: string]: any };
        }[],
        message: [] as string[],
        element: {} as { [key: string]: any },
        image: "",
        timeLimit: "",
        needKillerInfo: {
          type: infoType.sleep,
        } as infoTemplate,
      } as { [key: string]: any },

      gridInfo: {
        iconSize: {} as { [key: string]: any },
        position: {
          x: 0,
          y: 0,
        } as gridPositionCell,
        size: {
          width: 0,
          height: 0,
        } as gridSizeCell,
      },
    };
  },
  methods: {
    close() {},

    startMessage() {},

    startImage() {
      const position = {
        x: this.size.y,
        y: this.size.y,
      } as gridPositionCell;
      const size = {
        width: this.size.maxWidth - this.size.y * 2,
        height: this.size.maxHeight,
      } as gridSizeCell;

      this.__changeSize(size);
      this.__changePosition(position);
      this.status.class = keyFrameClass.noMessage;
    },

    startEl() {},

    startIcon() {
      const position = {
        x: this.size.maxWidth / 4,
        y: this.size.y,
      } as gridPositionCell;
      const size = {
        width: this.size.maxWidth / 2,
        height: this.size.height,
      } as gridSizeCell;

      this.__changeSize(size);
      this.__changePosition(position);
      this.status.class = keyFrameClass.noMessage;
    },

    /**
     * @name: pushInfo
     * @description: 处理推送的函数
     * @authors: CZH
     * @Date: 2022-09-25 20:43:08
     * @param {*} infoList
     */
    async pushInfo(infoList: infoTemplate[]) {
      infoList.map((item: infoTemplate) => {
        switch (item.type) {
          case infoType.icon:
            if (this.context.icon.length > 1) this.context.icon.shift();
            this.context.icon.push({
              name: item.icon,
              iconOption: item.options,
            });
            this.context.info = this.context.info.concat(infoList);
            break;
          case infoType.image:
            this.__timeLimit(item);
            break;
        }
      });
      await this.$nextTick();
      this.__clearInfo();
    },

    /**
     * @name: touchStart
     * @description: 响应点击事件
     * @authors: CZH
     * @Date: 2022-09-25 20:43:25
     */
    touchStart() {
      if (this.info.length == 0) {
        const { size, position } = this.detail.gridInfo.default;
        const setSize = {
          ...size,
          width: size.width + this.size.maxWidth / 16,
        } as gridSizeCell;
        const setPostion = {
          ...position,
          x: position.x - this.size.maxWidth / 32,
        };

        this.__changeSize(setSize);
        this.__changePosition(setPostion);
      }
    },

    /**
     * @name: touchend
     * @description: 触控离开事件
     * @authors: CZH
     * @Date: 2022-09-25 20:43:48
     */
    touchend() {
      const { size, position } = this.detail.gridInfo.default;
      const setSize = {
        ...size,
        width: size.width - this.size.maxWidth / 16,
      } as gridSizeCell;
      const setPostion = {
        ...position,
        x: position.x + this.size.maxWidth / 32,
      };

      this.__changeSize(setSize);
      this.__changePosition(setPostion);
    },

    init() {
      const position = {
        x: this.size.maxWidth / 3,
        y: this.size.y,
      } as gridPositionCell;
      const size = {
        width: this.size.maxWidth / 3,
        height: this.size.height,
      } as gridSizeCell;

      this.__changeSize(size);
      this.__changePosition(position);
      this.status.class = keyFrameClass.noMessage;
    },

    __changeSize(size: gridSizeCell) {
      let data = {} as { [key: string]: gridSizeCell };
      data[this.detail.label] = size;
      changeCardSize(this, data);
    },

    __changePosition(position: gridPositionCell) {
      let data = {} as { [key: string]: gridPositionCell };
      data[this.detail.label] = position;
      changeCardPosition(this, data);
    },

    /**
     * @name: __clearInfo
     * @description: 清空等待队列
     * @authors: CZH
     * @Date: 2022-09-25 22:00:11
     */
    __clearInfo() {
      let data = {} as { [key: string]: any };
      data[this.detail.key] = {
        info: [],
      };
      changeCardProperties(this, data);
    },

    /**
     * @name: __clearInfoLocal
     * @description: 清空本地当前展示任务
     * @authors: CZH
     * @Date: 2022-09-25 22:00:26
     */
    __clearInfoLocal(info: infoTemplate) {
      let infoList = deepClone(this.context.info);
      let needKillerInfo = {
        type: infoType.sleep,
      } as infoTemplate;
      clearTimeout(this.context.timeLimit);
      this.context.info = infoList.filter((infoCell: infoTemplate) => {
        return !(infoCell.type == info.type);
      });
      this.context.needKillerInfo = needKillerInfo;
    },

    /**
     * @name: __setInfoLocal
     * @description: 设置本地当前展示任务
     * @authors: CZH
     * @Date: 2022-10-05 21:06:31
     * @param {*} info
     */
    __setInfoLocal(info: infoTemplate) {
      this.context.info = this.context.info.concat([info]);
    },

    __isInInfo(name: infoType) {
      return this.context.info.filter((x: infoTemplate) => x.type == name).length > 0;
    },

    /**
     * @name: __timeLimit
     * @description: 展示时间控制函数
     * @authors: CZH
     * @Date: 2022-09-30 10:05:11
     * @param {*} info
     */
    async __timeLimit(info: infoTemplate) {
      let { needKillerInfo } = this.context;
      let needChangeAction = false;
      if (needKillerInfo && needKillerInfo.type != infoType.sleep) {
        this.__clearInfoLocal(needKillerInfo);
        needChangeAction = true;
      }
      setTimeout(() => this.__setInfoLocal(info), needChangeAction ? 300 : 0);
      this.context.needKillerInfo = info;
      if (info.time >= 0) {
        this.context.timeLimit = setTimeout(() => {
          this.__clearInfoLocal(info);
        }, info.time * 1000 + (needChangeAction ? 500 : 0));
        this.context.needKillerInfo = deepClone(info);
      }
    },
  },

  computed: {
    height() {
      return this.size.height * this.sizeUnit.blockSize;
    },
  },
  async mounted() {
    this.$emit("ready");
    this.status.cardBgStyle = deepClone(this.status.cardBgStyleOrigin);
    this.init();
  },
});
</script>

<style lang="scss" scoped>
.normal {
  width: 100%;
  height: 100%;
  transition: 0.1s transform;
}

.isTouch {
  transform: scaleX(110%);
}

.iconFlex {
  display: flex;
  justify-content: space-between;
  z-index: 100;
}

.iconShadow {
  animation: fadeIn 0.5s;
}

.showBox {
  height: 100%;
  width: 100%;
  //   animation: fadeIn 0.5s;
  transition: opacity 0.5s;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
