<!--
 * @Date: 2023-01-21 21:10:09
 * @LastEditors: CZH
 * @LastEditTime: 2023-02-14 18:58:30
 * @FilePath: /ConfigForDesktopPage/src/modules/photoWebSiteModule/component/imageInfo/infoCard.vue
-->
<template>
  <cardBg
    :cus-style="{
      overflow: 'scroll',
    }"
  >
    <el-card
      @click="rate"
      :style="{
        margin: '6px',
      }"
      :body-style="{
        padding: '0px',
        paddingBottom: '-5px',
      }"
    >
      <waterFallItem
        v-if="baseData['image']"
        :url="baseData['image'].url"
        :item="baseData['image']"
        :cus-style="{
          width: 'calc(100%)',
          borderRadius: '6px',
          height: '150px',
        }"
        :noPreview="true"
      ></waterFallItem>
    </el-card>
    <el-card :style="elCardInfo.style" :body-style="elCardInfo.bodyStyle" title="颜色">
      <div class="flexBox">
        <div
          class="tag"
          v-for="color in colorList"
          :style="{
            backgroundColor: color,
          }"
          @click="colorClick(color)"
        ></div>
      </div>
    </el-card>
    <el-card :style="elCardInfo.style" :body-style="elCardInfo.bodyStyle" title="评分">
      <el-rate
        v-model="imageInfo.rate"
        :colors="['#F7BA2A', '#FF9900', '#ff0000']"
        @change="rate"
      />
    </el-card>
    <el-card
      title="基本信息"
      :style="elCardInfo.style"
      :body-style="elCardInfo.bodyStyle"
    >
      <el-descriptions :column="1" size="small" v-if="baseData['image']" border>
        <el-descriptions-item
          v-for="item in Object.keys(imageInfo)"
          :align="'left'"
          :label="item"
          label-align="left"
        >
          {{ imageInfo[item] }}
        </el-descriptions-item>
      </el-descriptions>
    </el-card>
    <el-card
      v-if="categoryInfo['相册名']"
      title="相册信息"
      :style="elCardInfo.style"
      :body-style="elCardInfo.bodyStyle"
    >
      <el-descriptions :column="1" size="small" v-if="baseData['image']" border>
        <el-descriptions-item
          v-for="item in Object.keys(categoryInfo)"
          :align="'left'"
          :label="item"
          label-align="left"
        >
          {{ categoryInfo[item] }}
        </el-descriptions-item>
      </el-descriptions>
    </el-card>
  </cardBg>
</template>

<script lang="ts">
import { defineComponent, watch } from "vue";
import cardBg from "@/components/basicComponents/cell/card/cardBg.vue";
import { get, post, piwigoPost } from "@/utils/api/requests";

import {
  componentInfo,
  inputType,
  propInfo,
  gridSizeMaker,
} from "@/components/basicComponents/grid/module/dataTemplate";
import waterFallItem from "@/modules/photoWebSiteModule/component/imageList/waterFallItem.vue";

import {
  setData,
  changeVisible,
  changeCardPosition,
  changeCardSize,
  changeCardProperties,
  refreshDesktop,
} from "@/components/basicComponents/grid/module/cardApi/index";

export default defineComponent({
  componentInfo: {
    labelNameCn: "图片详情介绍",
    key: "InfoCard",
    description: "图片详情介绍",
    gridInfo: {
      middle: gridSizeMaker(2, 12),
    },
  } as componentInfo,

  propsDetail: {
    image: {
      label: "图片信息",
      type: inputType.obj,
    },
    watchKeyForCategory: {
      label: "baseData监听key(相册key)",
      type: inputType.text,
    },
  } as propInfo,

  baseProps: {},

  props: ["baseData", "sizeUnit", "image", "watchKeyForCategory"],
  components: { cardBg, waterFallItem },
  watch: {
    "baseData.image": {
      handler(val) {
        this.initImageInfo(val);
      },
    },
  },
  async mounted() {
    this.$emit("ready");
  },

  data: () => {
    return {
      tagList: [],
      colorList: [] as string[],
      imageInfo: {
        尺寸: "",
        文件大小尺寸: "",
        格式尺寸: "",
        创建日期尺寸: "",
        修改日期尺寸: "",
        rate: 0,
      },
      categoryInfo: {},

      elCardInfo: {
        style: {
          margin: "6px",
          marginTop: "3px",
        },
        bodyStyle: {
          padding: "3px",
        },
      },
    };
  },
  methods: {
    async rate(e) {
      await piwigoPost("/piwigo/ws.php?format=json", {
        method: "pwg.images.rate",
        rate: e + "",
        image_id: this.baseData.image.id,
      });
    },
    async initImageInfo(image) {
      if (!image || !image.id) return;
      let res = await get("/image-info?id=" + image.id, {});
      if (!res || !res.data) return;
      const { tagList, color } = res.data;
      const info = res.data.info[0];
      this.colorList = color;
      this.tagList = tagList;
      this.imageInfo = {
        尺寸: `${info.width}px × ${info.height}px`,
        文件大小: `${info.filesize} Kb`,
        格式: info.file.split(".")[1],
        创建日期: new Date(info.date_available.replace("T", " ")).toLocaleString(),
        修改日期: new Date(info.lastmodified.replace("T", " ")).toLocaleString(),
        rate: 0,
      };
      let resInfo = await piwigoPost("/piwigo/ws.php?format=json", {
        method: "pwg.images.getInfo",
        image_id: this.baseData.image.id,
      });
      this.imageInfo.rate = resInfo.result.rates.count;
      const category = this.baseData[this.watchKeyForCategory];
      if (category["name"])
        this.categoryInfo = {
          相册名: category["name"],
          级别: category["rank"],
        };
      else this.categoryInfo = {};
    },
    async colorClick(color) {
      const that = this;
      changeCardPosition(that, {
        waterFall: {
          x: 0,
          y: 0,
        },
      });
      changeCardSize(that, {
        InfoCard: {
          width: 2,
          height: 10,
        },
        waterFall: {
          width: 10,
          height: 12,
        },
      });
      changeVisible(that, {
        userManage_menuListRemote: false,
        searchInfo: false,
        upload: false,
        icon: true,
      });
      changeCardProperties(that, {
        waterFall: {
          getFunc: async function (that, data) {
            let res = await get(
              `/palette?colors=${color.replace("rgb(", "").replace(")", "")}&offset=${
                data.offset
              }&limit=${data.limit}`,
              {}
            );
            const resData = res.data;
            const back = resData.map((x) => {
              return {
                ...x,
                url:
                  `/imageserver/i.php?` +
                  x.path.replace("./", "/").replace(".", "-sm.") +
                  "",
              };
            });
            return back;
          },
        },
      });
      this.$nextTick(() => {
        setData(that, {
          category: {},
        });
      });
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
.flexBox {
  display: flex;
  justify-content: flex-start;
  border-radius: 3px;
  overflow: hidden;
  .tag {
    width: 20%;
    height: 15px;
  }
}
</style>
