<!--
 * @Date: 2022-11-11 09:35:29
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-11-23 09:01:59
 * @FilePath: /lcdp_fe_setup/src/modules/userManage/component/searchTable/inputForm.vue
-->
<template>
  <div
    v-if="
      (queryItemTemplate && queryItemTemplate.length > 0) ||
      (btnList && btnList.length > 0) ||
      !autoSearch
    "
  >
    <cardBg
      ref="formBox"
      class="formBox"
      :cus-style="{
        padding: '0px',
        height: 'auto',
        paddingBottom: (btnList && btnList.length > 0) || !autoSearch ? '12px' : '0px',
        'border-radius': '6px',
        border: '0px solid',
        filter: 'none',
        'box-shadow': 'none',
        display: 'inline-block',
      }"
    >
    <el-popover trigger="hover" :width="332" placement="right-start">
      <template #reference>
        <div class="screenDiv">筛选 
          <el-icon><ArrowRight /></el-icon>
        </div>
      </template>
      <div class="filterDiv">
        <div class="filterTitle">筛选选项</div>
        <div class="filterContent">
          <el-checkbox-group v-model="checkboxScreenGroup">
            <div v-for="(item) in screenFormList" :key="item.key">
              <el-checkbox :label="item.key">{{ item.label }}</el-checkbox>
            </div>
          </el-checkbox-group>
        </div>
        <div class="filterBtnList">
          <el-button type="primary" @click="changeStatus">确定</el-button>
          <el-button style="color: #0A1F44;" @click="resetStatus">重置</el-button>
        </div>
      </div>
      
    </el-popover>
      <VueForm
        v-model="formData"
        :style="{
          textAlign: 'left',
        }"
        :schema="schema"
        :ui-schema="uiSchema"
        :formProps="formProps"
        @change="onChange"
      >
        <div
          v-if="(btnList && btnList.length > 0) || !autoSearch"
          slot-scope="{ formData }"
          :style="{ textAlign: 'right' }"
        >
          <el-button
            class="btn"
            v-if="!autoSearch && queryItemTemplate && queryItemTemplate.length > 0"
            @click="refreshData(-1)"
            icon="RefreshRight"
            plain
            >重置</el-button
          >
          <el-button
            class="btn"
            v-if="!autoSearch"
            plain
            type="primary"
            @click="handleSubmit(formData)"
            style="margin-left: 0px"
            icon="Position"
            >搜索</el-button
          >
          <div
            v-for="(item, index) in (btnList || []).filter((btn) =>
              btn && btn.isShow
                ? btn.isShow({ ...formData, _selectedList: selectedList }, btn)
                : true
            )"
            :key="index + 'btn'"
            class="floatLeft"
            :style="item.style ? item.style : ''"
          >
            <!--  :on-success="item.uploadInfo.onsuccess"
            :on-error="item.uploadInfo.onerror"
            :on-exceed="item.uploadInfo.onexceed" -->
            <el-upload
              ref="uploadRef"
              :headers="getDownLoadRequestHeaders()"
              class="upload-demo"
              :action="actionUrl + (item.uploadInfo ? item.uploadInfo.action : '')"
              :limit="item.uploadInfo ? item.uploadInfo.limit : 1"
              :data="item.uploadInfo ? item.uploadInfo?.data : {}"
              :on-success="
                (response, file, fileList) => {
                  return btnClick(item, response);
                }
              "
              :on-error="
                (response, file, fileList) => {
                  return btnClick(item, response);
                }
              "
              :on-exceed="
                (response, file, fileList) => {
                  return btnClick(item, response);
                }
              "
              :show-file-list="false"
              v-if="item.type == btnActionTemplate.UploadFunction"
            >
              <el-button plain icon="plus" type="primary">{{ item.label }}</el-button>
            </el-upload>
            <el-popover v-if="item.type == btnActionTemplate.HoverFunction">
              <template #reference>
                <el-button 
                :type="
                  item.elType
                    ? typeof item.elType != 'string'
                      ? item.elType(formData)
                      : item.elType
                    : ''
                " :ico="item.hoverIcon">
                  {{ item.hoverInfo.hoverText }}
                </el-button>
              </template>
                <div class="hoverButton">
                  <div class="hoverButtonItem" v-for="(hoverItem,hoverIndex) in item.hoverInfo.hoverList" :key="hoverIndex" @click="btnClick(item,hoverItem)">
                    <component
                :is="useRenderIcon({ ...hoverItem })"
                class="iconCell"
              />
                    {{ hoverItem.label }}
                  </div>
                </div>
            </el-popover>
           
            <el-button
              v-else
              :loading="item.isLoading"
              @click="btnClick(item)"
              :disabled="
                item.isDisable({ ...formData, _selectedList: selectedList }, item)
              "
              :type="
                item.elType
                  ? typeof item.elType != 'string'
                    ? item.elType(formData)
                    : item.elType
                  : ''
              "
              plain
              :icon="item.hoverIcon"
            >
              <!-- :plain="
                item.elType
                  ? (typeof item.elType != 'string'
                      ? item.elType(formData)
                      : item.elType) == 'info'
                  : 'info'
              " -->
              {{ item.label }}
            </el-button>
          </div>
        </div>
      </VueForm>
      <div class="TopRight" v-if="isNeedClose">
        <iconCell
          :name="isOpen ? 'ArrowDownBold' : 'ArrowUpBold'"
          @click="changeOpen"
          :iconOption="{
            fontSize: '12px',
          }"
        />
      </div>
    </cardBg>
    <!-- <el-divider
      :style="{
        opacity: 0,
        width: 'calc(100% - 12px)',
        margin: '6px',
      }"
    /> -->
  </div>
</template>

<script lang="ts">
import { defineComponent, h } from "vue";
import VueForm from "@lljj/vue3-form-element";
import { propertiesMaker } from "./searchTable";
import iconCell from "@/components/basicComponents/cell/icon/iconCell.vue";
import cardBg from "@/components/basicComponents/cell/card/cardBg.vue";
import { ElButton, ElDivider, formProps } from "element-plus";
import {
  tableCellTemplate,
  stringAnyObj,
  btnCellTemplate,
  btnActionTemplate,
} from "@/modules/userManage/types";
import { getDownLoadRequestHeaders } from "@/utils/api/user/header";
import { getPreUrl } from "@/utils/api/requests";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
const VITE_PROXY_DOMAIN_REAL = getPreUrl();
let interval = null;
export default defineComponent({
  name: "表单组件",
  props: [
    "query",
    "queryItemTemplate",
    "queryItemConfig",
    "btnList",
    "autoSearch",
    "selectedList",
  ],
  watch: {
    query: {
      handler(val) {
        this.refreshData(val);
      },
      deep: true,
      immediate: true,
    },
    queryItemTemplate: {
      handler(val) {
        this.initForm(val);
      },
      immediate: true,
    },
  },

  computed: {
    isNeedClose() {
      // return Object.keys(this.schema.properties).length >= 3;
      return false;
    },
  },

  components: { VueForm, cardBg, iconCell },

  data() {
    return {
      formData: {},
      uiSchema: {},
      formFooter: {
        show: false,
      },
      isOpen: true,
      formProps: {
        layoutColumn: 3,
        inlineFooter: false,
        labelSuffix: "：",
        labelPosition: "top",
        isMiniDes: false,
        defaultSelectFirstOption: true,
        labelWidth: "120px",
      },
      schema: {
        type: "object",
        properties: {},
      },
      btnActionTemplate,
      actionUrl: VITE_PROXY_DOMAIN_REAL,
      screenFormList: [],
      checkboxScreenGroup:[]
    };
  },
  methods: {
    useRenderIcon,
    async changeStatus(){
      const newList = this.queryItemTemplate.map(item=>{
        if(this.checkboxScreenGroup.includes(item.key)){
          return {...item}
        }
      })
      await this.initForm(newList)
    },
    async resetStatus(){
      this.initScreenForm()
      await this.initForm(this.queryItemTemplate);
    },
    initScreenForm(queryItemTemplate: tableCellTemplate[] = this.queryItemTemplate){
      const array = [];
      this.screenFormList = queryItemTemplate.map(item=>{
        array.push(item.key)
        return {
          label:item.label,
          key: item.key,
        }
      })
      this.checkboxScreenGroup = array
    },
    getDownLoadRequestHeaders() {
      return getDownLoadRequestHeaders();
    },
    /**
     * @name: 初始化搜索用表单和对象
     * @description: initForm
     * @authors: CZH
     * @Date: 2022-11-14 10:17:28
     */
    async initForm(queryItemTemplate: tableCellTemplate[] = this.queryItemTemplate) {
      if (Object.keys(this.query).length > 0) {
      }
      let properties = {} as stringAnyObj;
      properties = await propertiesMaker(queryItemTemplate, this, false);
      this.schema.properties = properties;
    },

    // 上报数据修改事件
    onChange(key) {
      this.$emit("inputChange", this.formData);
      if(!this.formData.pageNumber){
        this.handleSubmit(this.formData,'ooo')
      }
      
    },

    // 回报搜索事件
    handleSubmit(formData: stringAnyObj) {
      formData.pageNumber = 1;
      this.$emit("search", formData);
    },

    /**
     * @name: btnClick
     * @description: 回报自定义按钮事件
     * @authors: CZH
     * @Date: 2022-11-21 19:03:17
     * @param {*} btn
     */
    btnClick(btn: btnCellTemplate, res?: stringAnyObj) {
      this.$emit("btnClick", btn, res);
    },

    changeOpen() {
      this.isOpen = !this.isOpen;
      this.isOpen
        ? this.initForm()
        : this.initForm(this.queryItemTemplate.slice(0, this.formProps.layoutColumn));
    },

    refreshData(val: any) {
      if (val === -1) {
        this.formData = {};
        this.$emit("inputChange", {});
        // 按照7月11号的要求，删除了重置直接导致的刷新
        // this.$emit("refresh");
        this.$nextTick().then(() => {
          this.handleSubmit();
        });
      } else if (val && Object.keys(val).length > 0) {
        for (let x in val) {
          if (this.formData[x] != val[x]) {
            this.formData[x] = val[x];
          }
        }
      } else {
        this.formData = val;
      }
    },
    addFileCreate(e) {
      console.log(e, "success");
      this.$emit("inputChange", e);
    },
    errorFile(e) {
      console.log(e, "err");
      this.$emit("inputChange", e);
    },
    exceedFile(e) {
      console.log(e, "exceed");
      this.$emit("inputChange", e);
    },
  },
  async mounted() {
    this.refreshData(this.query);
    let that = this;
    if (interval) clearInterval(interval);
    interval = setInterval(() => {
      if (that.$refs["formBox"] && that.$refs["formBox"]["$el"]) {
        let width = that.$refs["formBox"]["$el"].offsetWidth;
        if (width > 600) {
          that.formProps.layoutColumn = 3;
        } else if (width > 400) {
          that.formProps.layoutColumn = 2;
        } else {
          that.formProps.layoutColumn = 1;
        }
      }
    }, 100);
    await this.initForm(this.queryItemTemplate);
    setTimeout(()=>{
      this.initScreenForm()
    },200)
  },
});
</script>

<style lang="scss" scoped>
.formBox {
  width: 100%;
  height: auto;
  transition: all 0.3s;
}

.TopRight {
  position: absolute;
  width: 20px;
  height: 20px;
  top: 0px;
  right: 0px;
  margin: 18px;
}
.btn {
  float: right;
  margin-left: 6px;
}
.floatLeft {
  float: left;
  margin-right: 6px;
}

.screenDiv {
  width: 68px;
  height: 24px;
  text-align: center;
  border: 1px solid #E1E4E8;
  font-size: 14px;
  color: #21252D;
  border-radius: 4px;
  margin-bottom: 4px;
  display:flex;
  align-items: center;
  justify-content: center;
  .el-icon {
    margin-top:1px;
  }
}
.screenDiv:hover {
  width: 68px;
  height: 24px;
  text-align: center;
  border: 1px solid rgba(59, 128, 253, 0.3);
  font-size: 14px;
  color: rgba(59, 128, 253, 1);
  border-radius: 4px;
  margin-bottom: 4px;
  .el-icon {
    transform: rotate(90deg);
  }
}
.filterDiv {
  width: 308px;
  .filterTitle {
    font-size: 16px;
    font-weight: 600;
    color: #0A1F44;
  }
  .filterBtnList {
    border-top: 1px solid #E1E4E8;
    text-align:center;
    padding-top: 12px;
  }
}
.hoverButton {
  display:flex;
  flex-direction: column;
  justify-content: center;
}
.hoverButtonItem {
  width: 114px;
  height: 32px;
  text-align: center;
  line-height: 32px;
  display:flex;
  align-items: center;
  justify-content: center;
  cursor:pointer;
  border-radius: 4px;
  margin-right: -20px;
  .hoverButtonItem  {
    margin-right: 6px;
  }
}
.hoverButtonItem:hover {
  background: rgba(59, 128, 253, 0.1);
  color: rgb(59, 128, 253)
}
</style>
