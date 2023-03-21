<!--
 * @Date: 2023-03-20 14:36:17
 * @LastEditors: CZH
 * @LastEditTime: 2023-03-20 17:52:31
 * @FilePath: /configforpagedemo/src/modules/userManage/component/searchTable/uploadFileList.vue
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
import { ElMessage, UploadProps, UploadUserFile } from "element-plus";
import { post, get, del, download as Download } from "@/utils/api/requests";
import { ElLoading } from "element-plus";
import { loadEnv } from "@build/index";

const { VITE_PROXY_DOMAIN_REAL } = loadEnv();

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
});

const fileList = ref<UploadUserFile[]>([]);

onMounted(() => {
  if (props.modelValue && props.modelValue.length > 0)
    try {
      fileList.value = JSON.parse(props.modelValue) as UploadUserFile[];
    } catch {
      fileList.value = props.modelValue.split(",").map((x) => {
        return {
          name: x,
          url: x,
        };
      }) as UploadUserFile[];
    }
});

const loading = ref<any>({});

let uploadNum = 0;

const beforeUpload = (e) => {
  uploadNum++;
  loading.value = ElLoading.service({
    fullscreen: true,
    text: "正在上传中",
  });
};

const success = (e) => {
  if (uploadNum) uploadNum--;
  if (uploadNum == 0) loading.value.close();
  else {
    loading.value.close();
    loading.value = ElLoading.service({
      fullscreen: true,
      text: `正在上传中，剩余文件${uploadNum}`,
    });
  }
  if (e["message"] == "成功") {
    if (uploadNum == 0)
      ElMessage({
        message: "上传成功",
        type: "success",
      });
    fileList.value = fileList.value.concat([e.data]);
  } else {
    ElMessage({
      message: "上传" + e.message,
      type: "error",
    });
  }
};

const download = (file) => {
  Download(VITE_PROXY_DOMAIN_REAL + "/cult/sysFile/download", file.name, {
    fileName: file.name,
    fileUrl: file.url,
  });
};

const remove = (index) => {
  fileList.value = fileList.value.filter((x, ii) => ii != index);
};

const emit = defineEmits(["update:modelValue"]);

watchEffect(() => {
  if (fileList.value && fileList.value.length > 0) {
    emit("update:modelValue", JSON.stringify(fileList.value));
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
    >
      <el-button icon="upload"> 上传文件 </el-button>
    </el-upload>
    <div class="flexBox" v-for="(file, i) in fileList">
      <div>{{ file.name }}</div>
      <div class="btnList">
        <el-button
          size="small"
          class="btn"
          type="primary"
          icon="Download"
          @click="download(file)"
        >
          下载
        </el-button>
        <el-button
          size="small"
          class="btn"
          type="danger"
          icon="Delete"
          @click="remove(i)"
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
  padding: 0px 12px;
  .btnList {
    width: auto;
    .btn {
      margin-left: 3px;
    }
  }
}
</style>
