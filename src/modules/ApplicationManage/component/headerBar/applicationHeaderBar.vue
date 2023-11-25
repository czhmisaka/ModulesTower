

<!--
 * @Date: 2023-10-09 10:22:33
 * @LastEditors: CZH
 * @LastEditTime: 2023-11-13 16:11:52
 * @FilePath: /lcdp_fe_setup/src/modules/ApplicationManage/component/headerBar/applicationHeaderBar.vue
-->
<template>
  <CardBg :cusStyle="{
    width: '100%',
    padding: '0px',
    borderRadius: '6px',
    overflow: 'hidden',
    transition: 'all 0.3s',
    filter: ' drop-shadow(0px 0px 1px rgba(0, 0, 0, 0.1))'
  }" @mouseenter="mouse_hover(true)" @mouseleave="mouse_hover(false)">
    <div class="cell message" v-if="applicationInfoLocal" v-show="showType == 'headerBar'" :style="{
      opacity: showType == 'headerBar' ? '1' : '0',
      background: `linear-gradient(135deg, ${Icon ? Icon.color : 'rgba(0,0,0,1)'
        } -200%, rgba(0,0,0,0) 50%)`,
      backdropFilter: 'saturate(50%) blur(4px)',
    }
      ">
      <div class="icon" v-if="Icon['iconType'] == IconType.elIcon && Icon['src']">
        <ElIcon v-if="Icon['iconType'] == IconType.elIcon && Icon['src']" :color="Icon['color']">
          <component :is="getIcon(Icon['src'])"></component>
        </ElIcon>
      </div>
      <div class="text">
        【{{ applicationInfoLocal['name'] }}】
      </div>
    </div>
    <!--这一块要求显示区域是300*200 -->
    <div v-if="applicationInfoLocal" v-show="showType == 'card' && applicationInfoLocal" class="cardBox" :style="{
      background: `linear-gradient(135deg, ${Icon ? Icon.color : 'rgba(0,0,0,1)'
        } -100%, rgba(0,0,0,0) 50%)`,
      backdropFilter: 'saturate(50%) blur(4px)',
      opacity: showType == 'card' ? '1' : '0',
    }
      ">
      <div class="icon">
        <ElIcon v-if="Icon['iconType'] == IconType.elIcon && Icon['src']" :color="Icon['color']">
          <component :is="getIcon(Icon['src'])"></component>
        </ElIcon>
      </div>
      <div class="content" :style="{
        transition: 'opacity 1s',
        opacity: showType == 'card' ? '1' : '0',
      }
        ">
        <div class="title">
          {{ applicationInfoLocal['name'] }}
          <ElTag type="danger" size="small" v-if="applicationInfoLocal['top']"> 置顶</ElTag>
          <ElTag :style="{
            marginLeft: applicationInfoLocal['top'] ? '6px' : '0'
          }
            " :type="applicationInfoLocal['published'] == 0 ? 'warning' : 'success'" size="small">{{
    { 0: '未发布', 1: '已发布' }[applicationInfoLocal['published']]
  }}</ElTag>
        </div>
        <div class="desc">
          {{ applicationInfoLocal['description'] }}
        </div>
        <div class="btnList">
          <span v-for="( btns, index ) in  btnList " :key="index + 'btn'">
            <el-button v-if="btns.isShow(applicationInfo, btns)"
              :loading="loadingMap[btns.label + btns.showAbleKey + index]" style="margin-right: 3px;cursor:pointer" link
              :disabled="btns.isDisable(applicationInfo, '')" size="small" :type="btns.elType
                ? typeof btns.elType != 'string'
                  ? btns.elType(applicationInfo)
                  : btns.elType
                : ''
                " @click="() => btnClick(btns)">
              {{ btns.label }}
            </el-button>
          </span>
        </div>
      </div>
    </div>
  </CardBg>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import CardBg from "@/components/basicComponents/cell/card/cardBg.vue";
import {
  componentInfo,
  gridSizeMaker,
} from "@/components/basicComponents/grid/module/dataTemplate";
import userInfoCard from "@/modules/userManage/component/userCard/userInfoCard.vue";
import { useUserStore, useUserStoreHook } from "@/store/modules/user";
import { userFieldStorage } from "@/modules/userManage/PageConfigData/user/userValueManage";
import { userTableCellStorage } from "@/modules/userManage/PageConfigData/workteam";
import { ApplicationInfoTemplate, stringAnyObj } from '../../types';
import { IconType } from '../../../userManage/component/searchTable/inputElementComponent/iconPicker';
import { getIcon } from "@/utils";
import icon from '@/components/ReIcon/src/icon.vue';
import { ElTag, ElButton } from 'element-plus';
export default defineComponent({
  componentInfo: {
    labelNameCn: "应用信息头部导航条",
    key: "applicationHeaderBar",
    description: "应用信息头部导航条",
    gridInfo: {
      middle: gridSizeMaker(12, 0),
    },
  } as componentInfo,
  name: "applicationHeaderBar",
  components: { CardBg, userInfoCard },
  props: [
    'applicationInfo',
    'mouseenter',
    'mouseleave',
    'showType',
    'detail',
    'btnList'
  ],
  data: () => {
    return {
      applicationInfoLocal: {} as ApplicationInfoTemplate,
      IconType,
      Icon: {} as stringAnyObj,
      loadingMap: {} as { [key: string]: boolean },
    };
  },
  watch: {
    applicationInfo: {
      handler(val) {
        if (val && val.name) {
          this.applicationInfoLocal = val;
          this.Icon = this.applicationInfoLocal.icon ? JSON.parse(this.applicationInfoLocal.icon) : {}
          this.$emit("ready");
        }
      },
      deep: true,
    }
  },
  emits: ['btnClick'],
  async mounted() {
    if (this.applicationInfo && Object.keys(this.applicationInfo).length > 0) {
      this.applicationInfoLocal = this.applicationInfo;
      this.Icon = this.applicationInfoLocal.icon ? JSON.parse(this.applicationInfoLocal.icon) : {}
      this.$emit("ready");
    }
  },
  methods: {
    btnClick(e) {
      this.$emit('btnClick', e)
      console.log(e, 'asd')
    },

    getIcon,

    mouse_hover(isIn: Boolean) {
      if (isIn && this.mouseenter)
        this.mouseenter(this)
      else if (!isIn && this.mouseleave)
        this.mouseleave(this)
    }
  },
});
</script>

<style lang="scss" scoped>
.cell {
  position: relative;
  float: left;
  text-align: center;
  width: auto;
  height: 100%;
  display: flex;
  justify-content: space-around;
  color: #ddd;
  font-size: 14px;
  padding: 0px 12px;
  transition: 0.3s all;
  cursor: pointer;

  .icon {
    display: flex;
    flex-flow: column;
    justify-content: center;
    width: 24px;
    font-size: 24px;
  }

  .text {
    display: flex;
    flex-flow: column;
    justify-content: center;
    text-align: center;
    color: #333;
    font-size: 16px;
    font-weight: bold;
  }
}

.cell:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.cardBox {
  width: 100%;
  height: 100%;
  background-repeat: no-repeat !important;
  background-size: 100% !important;
  background-position: -80px !important;

  .icon {
    float: left;
    display: flex;
    flex-flow: column;
    justify-content: center;
    width: 50px;
    font-size: 50px;
    padding: 10px;
    border-radius: 50%;
  }

  .content {
    position: absolute;
    top: 0px;
    left: 50px;
    width: calc(100% - 60px);
    height: 100%;
    padding: 18px;
    text-align: left;

    .btnList {
      position: absolute;
      bottom: 12px;
      right: 0px;
    }

    .title {
      font-size: 16px;
      font-weight: bolder;
    }

    .desc {
      margin-top: 6px;
      font-size: 12px;
      font-weight: 200;
      max-height: 102px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
</style>