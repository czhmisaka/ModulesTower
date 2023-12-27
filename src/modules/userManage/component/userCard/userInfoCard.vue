<!--
 * @Date: 2023-02-13 10:25:34
 * @LastEditors: CZH
 * @LastEditTime: 2023-12-22 17:16:40
 * @FilePath: /ConfigForDesktopPage/src/modules/userManage/component/userCard/userInfoCard.vue
-->
<template>
  <cardBg :cusStyle="cardBgCusStyle">
    <div :style="{
      width: '280px',
      height: '100%',
      overflow: 'auto',
      overflowX: 'hidden',
    }">
      <div class="wholeWidthBox" :style="{
        height:
          btnList && btnList.length > 0
            ? blockSizePercent(2.3)
            : blockSizePercent(2),
      }" v-if="userInfoData['username']">
        <el-image v-if="userInfoData['icon']
          ? userInfoData['icon'].replace('/lcdp', '/api')
          : ''
          " :style="{
    width: blockSizePercent(1.4),
    height: blockSizePercent(1.4),
    borderRadius: '50%',
    margin: blockSizePercent(0.3),
  }" class="mainColorBorder" :src="userpng" fit="cover" />

        <div class="flexCol" :style="{
          width: `calc(100% - ${blockSizePercent(2)})`,
          fontSize: blockSizePercent(0.2),
        }">
          <span class="name">
            {{ userInfoData["username"] }}
            <br />
            <span class="mobile">部门：{{ userInfoData['units'] && userInfoData['units'][0] ? userInfoData['units'][0].name : '' }}</span>
          </span>
        </div>
      </div>
    </div>

  </cardBg>
  <!-- mainActionBtnList -->
  <cardBg :cusStyle="{ ...cardBgCusStyle, paddingTop: '9px' }" v-if="mainActionBtnList && mainActionBtnList.length">
    <div class="btnList" :style="{}">
      <div :key="index" v-for="(item, index) in mainActionBtnList.filter((btn) =>
        btn && btn.isShow
          ? btn.isShow(userInfoData, JSON.parse(JSON.stringify(btn)))
          : true
      )" style="float: left; margin-right: 6px">
        <el-button class="btn" :loading="item.isLoading" @click="btnClick(item)" :type="item.elType" :icon="item.icon"
          :size="blockSizePercent(1, '') as number < 40 ? 'small' : 'default'" plain>
          {{ item.label }}
        </el-button>
      </div>
    </div>
  </cardBg>
  <!-- BtnList -->
  <cardBg :cusStyle="{ ...cardBgCusStyle, paddingTop: '9px' }" v-if="btnList && btnList.length">
    <div class="btnList" :style="{}">
      <div :key="index" v-for="(item, index) in btnList.filter((btn) =>
        btn && btn.isShow
          ? btn.isShow(userInfoData, JSON.parse(JSON.stringify(btn)))
          : true
      )" style="float: left; margin-right: 6px">
        <el-button class="btn" :loading="item.isLoading" @click="btnClick(item)" :type="item.elType" :icon="item.icon"
          :size="blockSizePercent(1, '') as number < 40 ? 'small' : 'default'" plain>
          {{ item.label }}
        </el-button>
      </div>
    </div>
  </cardBg>
</template>
<script lang="ts">
import userpng from "@/assets/img/user.png";

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
} from "@/components/basicComponents/grid/module/cardApi/index";
import { useUserStoreHook } from "@/store/modules/user";

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
      type: inputType.functionEditor,
    },
    showTemplate: {
      label: "可用展示模板函数",
      description: "需要输出SearchStorage构建的对象",
      type: inputType.array,
    },
    mainActionBtnList: {
      label: "主要操作按钮列表",
      type: inputType.array,
    },
    btnList: {
      label: "按钮列表",
      type: inputType.array,
    },
  } as propInfo,

  baseProps: {
    userInfo: async () => {
      return await useUserStoreHook().getOptions();
    },
  },

  props: [
    "mainActionBtnList",
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
      userpng,
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
        margin: '6px',
        width: 'calc( 230px + 12px)'
      };
      Object.keys(data).map((x) => {
        if (!data[x]) delete data[x];
      });
      return data;
    },
  },

  methods: {
    hightLight(value = true) {
      // hightLightComponent(this, value ? [this.detail.label] : []);
      // this.isHover = value;
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
    // 方便获取 尺寸
    const blockSizePercent = (num, unit = "px"): string | number => {
      return 30 * num + unit;
    };

    return { blockSizePercent };
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
  display: inline-block;
  border: 2px white solid;
  box-shadow: 0px 0px 2px $subMenuActiveBg;
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
  display: inline-block;
  margin-bottom: -6px;
  position: relative;
  width: 100%;

  .btn {
    bottom: 0px;
    position: absolute;
  }
}
</style>
