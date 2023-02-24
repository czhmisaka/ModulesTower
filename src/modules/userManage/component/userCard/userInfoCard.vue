<!--
 * @Date: 2023-02-13 10:25:34
 * @LastEditors: CZH
 * @LastEditTime: 2023-02-17 17:18:56
 * @FilePath: /configforpagedemo/src/modules/userManage/component/userCard/userInfoCard.vue
-->
<template>
  <cardBg
    @mouseenter="hightLight()"
    @mouseleave="hightLight(false)"
    :cusStyle="cardBgCusStyle"
  >
    <el-popover
      ref="popoverRef"
      placement="left-start"
      :show-arrow="false"
      :show-after="300"
      :visible="isHover"
      :width="400"
    >
      <template #reference>
        <div
          :style="{
            width: '100%',
            height: '100%',
            overflow: 'auto',
            overflowX: 'hidden',
          }"
        >
          <div
            class="wholeWidthBox"
            :style="{
              height: blockSizePercent(2),
            }"
            v-if="userInfoData['name']"
          >
            <el-image
              :style="{
                width: blockSizePercent(1.4),
                height: blockSizePercent(1.4),
                borderRadius: '50%',
                margin: blockSizePercent(0.3),
              }"
              class="mainColorBorder"
              :src="
                userInfoData['icon'] ? userInfoData['icon'].replace('/lcdp', '/api') : ''
              "
              fit="cover"
            />
            <div
              class="flexCol"
              :style="{
                width: `calc(100% - ${blockSizePercent(2)})`,
                fontSize: blockSizePercent(0.2),
              }"
            >
              <span class="name">
                {{ userInfoData["name"] }}
                <br />
                <span class="mobile">{{ userInfoData["mobile"] }}</span>
              </span>
            </div>
          </div>
          <div class="btnList" :style="{}" v-if="btnList && btnList.length">
            <div
              v-for="item in btnList.filter((btn) =>
                btn && btn.isShow
                  ? btn.isShow(userInfoData, JSON.parse(JSON.stringify(btn)))
                  : true
              )"
              style="float: left; margin-right: 6px"
            >
              <el-button
                class="btn"
                :loading="item.isLoading"
                @click="btnClick(item)"
                :type="item.elType"
                :icon="item.icon"
                :size="blockSizePercent(1, '') < 40 ? 'small' : 'default'"
                :text="blockSizePercent(1, '') < 40"
              >
                {{ item.label }}
              </el-button>
            </div>
          </div>
        </div>
      </template>
      <div v-if="showTemplate && showTemplate.length > 0">
        <el-form ref="form" v-on:submit.prevent :label-position="'left'" size="small">
          <el-form-item
            :label-width="'120px'"
            :label="item.label"
            v-for="item in showTemplate.filter((x) => x.table.type != showType.btnList)"
          >
            <span v-if="item.table.type == showType.funcComponent">
              <component :is="item.table.showFunc(userInfoData, item.key)"></component>
            </span>
            <span v-else-if="item.table.type == showType.func">
              {{ item.table.showFunc(userInfoData, item.key) }}
            </span>
          </el-form-item>
        </el-form>
      </div>
    </el-popover>
  </cardBg>
</template>

<script lang="ts">
import { defineComponent, ref, watch, onMounted, toRefs } from "vue";
import cardBg from "@/components/basicComponents/cell/card/cardBg.vue";
import {
  componentInfo,
  inputType,
  propInfo,
  gridSizeMaker,
} from "@/components/basicComponents/grid/module/dataTemplate";
import {
  setData,
  changeVisible,
  hightLightComponent,
} from "@/components/basicComponents/grid/module/cardApi/index";

import {
  btnActionTemplate,
  stringAnyObj,
  btnCellTemplate,
  showType,
  tableCellTemplate,
  tableCellOptions,
} from "@/modules/userManage/types";
export default defineComponent({
  componentInfo: {
    labelNameCn: "用户信息展示组件",
    key: "userInfoCard",
    description: "展示用户信息",
    gridInfo: {
      middle: gridSizeMaker(4, 3),
    },
  } as componentInfo,

  propsDetail: {
    userInfo: {
      label: "用户信息",
      type: inputType.obj,
    },
    showTemplate: {
      label: "可用展示模板函数",
      description: "需要输出SearchStorage构建的对象",
      type: inputType.functionEditor,
    },
  } as propInfo,

  props: [
    "btnList",
    "userInfo",
    "showTemplate",
    "title",
    "baseData",
    "sizeUnit",
    "detail",
  ],

  components: {
    cardBg,
  },

  data: () => {
    return {
      userInfoData: {},
      showType,
      isHover: false,
    };
  },

  computed: {
    cardBgCusStyle() {
      let data = {
        padding: "6px",
        boxShadow: this.isHover ? "5px 5px 12px rgba(0,0,0,0.1) " : "",
        transform: this.isHover ? "translate(6px ,6px)" : "",
        transition: "box-shadow 0.4s,transform 0.4s",
        overflow: "none",
      };
      Object.keys(data).map((x) => {
        if (!data[x]) delete data[x];
      });
      return data;
    },
  },

  methods: {
    hightLight(value = true) {
      hightLightComponent(this, value ? [this.detail.label] : []);
      this.isHover = value;
    },
    /**
     * @name: btnClick
     * @description: 按钮点击事件
     * @authors: CZH
     * @Date: 2022-12-02 09:27:05
     * @param {*} btn
     */
    async btnClick(btn: btnCellTemplate) {
      if (btn.type == btnActionTemplate.OpenDrawer) {
        this.drawerData = btn.drawerProps;
        this.$refs["drawer"].open();
      } else if (btn.type == btnActionTemplate.Function && btn.function) {
        let that = this;
        await btn.function(that, this.userInfoData);
      } else if (btn.type == btnActionTemplate.Url) {
        window.open(btn.url);
      }
    },
  },

  async mounted() {
    this.$emit("ready", true);
    if (this.userInfo) this.userInfoData = await this.userInfo();
    this.$emit("ready");
  },
  setup(props, context) {
    const { sizeUnit, detail: gridInfo } = toRefs(props);

    // 方便获取 尺寸
    const blockSizePercent = (num, unit = "px"): string | number => {
      const size = gridInfo.value.gridInfo.default.size.width;
      const sizeChangeRate = size / 3 / 2;
      return sizeUnit.value["blockSize"] * num * sizeChangeRate + unit;
    };

    return { sizeUnit, gridInfo, blockSizePercent };
  },
});
</script>

<style lang="scss" scoped>
.wholeWidthBox {
  width: 100%;
  display: flex;
  justify-content: flex-start;
}
.mainColorBorder {
  border: 1px white solid;
  box-shadow: 0px 0px 4px var(--el-color-primary);
}

.flexCol {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  .name {
    font-size: 1.6em;
    font-weight: bolder;
    .mobile {
      font-size: 0.8;
      font-weight: 100;
    }
  }
}
.btnList {
  width: calc(100%);
  height: 40px;
  position: absolute;
  bottom: 0px;
  margin-bottom: 6px;
  .btn {
    bottom: 0px;
    position: absolute;
  }
}
</style>
