<!--
 * @Date: 2023-03-20 14:36:17
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-11-14 17:21:19
 * @FilePath: /landblockmanagepresystem/src/modules/userManage/component/searchTable/uploadFileList.vue
-->
<script setup lang="ts">
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import {
  onBeforeUnmount,
  ref,
  shallowRef,
  onMounted,
  defineEmits,
  watchEffect,
} from "vue";
import cardBg from "@/components/basicComponents/cell/card/cardBg.vue";
import { getDownLoadRequestHeaders } from "@/utils/api/user/header";
import { ElMessage, UploadUserFile } from "element-plus";
import { post, get, del, download as Download, getPreUrl } from "@/utils/api/requests";
import { ElLoading } from "element-plus";
import { loadEnv } from "@build/index";
import { log } from "util";

let VITE_PROXY_DOMAIN_REAL = getPreUrl();
defineOptions({
  name: "uploadFileList",
});
const props = defineProps({
  accept: {
    type: String,
    default: "",
  },
  modelValue: {
    type: String,
    default: () => {
      return JSON.stringify([] as UploadUserFile[]);
    },
  },
  action: {
    type: String,
    default: "/cult/sysFile/upload",
  },
  limit: {
    type: Number,
    default: 3,
  },
  bizType:{
    type: String,
    default: () => {
      return 'LAND'
    },
  }
});

const fileList:any = ref([]);

onMounted(() => {
  // 编辑时回显数据
  if (props.modelValue && props.modelValue.length > 0 && props.modelValue!='[]'){
    console.log("sdssds",props.modelValue);
    
    fileList.value = props.modelValue
  }   
});

const loading = ref<any>({});

let uploadNum = 0;

const beforeUpload = (e) => {
  uploadNum++;
};
const handleExceed = (e) => {};

const success = (e,b) => {
  if (uploadNum) uploadNum--;
  // if (uploadNum == 0) loading.value.close();
  else {
    // loading.value.close();
    // loading.value = ElLoading.service({
    //   fullscreen: true,
    //   text: `正在上传中，剩余文件${uploadNum}`,
    // });
  }
  if (e["message"] == "成功") {
    if (uploadNum == 0)
      ElMessage({
        message: "上传成功",
        type: "success",
      });
      console.log(props.bizType,'lplpopop');
      
    fileList.value.push({
      bizType: props.bizType,
      id: e.data,
      realName:b.raw.name
    });
  } else {
    let tips = "上传" + e.message ? e.message : "失败";
    if (e.message.includes("Maximum")) {
      tips = "文件过大";
    }
    ElMessage({
      message: tips,
      type: "error",
    });
  }
};

const download = (file) => {
  Download("/cult/dataFile/downFile?id=" + file.id, file.name, {});
};

const remove = (e) => {
  fileList.value = fileList.value.filter((x) => x.id != e.id);
  emit("update:modelValue", fileList.value);

};

const emit = defineEmits(["update:modelValue"]);

watchEffect(() => {
  if (fileList.value && fileList.value.length > 0) {
    emit("update:modelValue", fileList.value);
  }
});
</script>

<template>
  <div class="wholeBox">
    <el-upload
      :headers="getDownLoadRequestHeaders()"
      :action="VITE_PROXY_DOMAIN_REAL + action"
      :multiple="true"
      :show-file-list="false"
      :before-upload="beforeUpload"
      :on-success="success"
      :on-error="
        () =>
          success({
            messgae: '上传失败',
          })
      "
      v-model="fileList"
      :limit="limit"
    >
      <!-- v-model="fileList"  -->
      <el-button icon="upload"> 上传文件</el-button>
    </el-upload>
    <div class="flexBox" v-for="(file, i) in fileList" :key="i">
      <div class="flexName">{{ file.realName }}</div>
      <div class="btnList">
        <!-- 下载 -->
        <el-button
          size="small"
          class="btn"
          type="primary"
          icon="Download"
          @click="download({ id: file.id, name: file.realName })"
        >
          
        </el-button>
        <!-- 删除 -->
        <el-button
          size="small"
          class="btn"
          type="danger"
          icon="Delete"
          @click="remove(file)"
        ></el-button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.wholeBox {
  width: 100%;
  height: auto;
  display: inline-block;
}
.flexBox {
  width: 100%;
  display: flex;
  justify-content: space-between;
  line-height: 30px;
  .flexName {
    width: calc(100% - 80px);
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .btnList {
    width: 80px;
    .btn {
      margin-left: 3px;
      padding: 2px;
    }
  }
}
</style>
