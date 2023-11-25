<!--
 * @Date: 2023-03-20 14:36:17
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-11-10 16:51:07
 * @FilePath: /lcdp_fe_setup/src/modules/knowledge/page/documentPage.vue
-->
<template>
  <cardBg>
    <div class="btnButton">
      <el-button type="primary" plain @click="goBack">返回</el-button>
      <el-button type="primary" @click="saveEdit">保存</el-button>
    </div>
    <div class="documentPage">
      <div class="leftContent">
        <Toolbar style="border-bottom: 1px solid #e1e4e8" :editor="editorRef" :defaultConfig="toolbarConfig"
          :mode="mode" />
        <div class="editorDiv">
          <Editor style="height: 100%; overflow-y: hidden; background: white" v-model="valueHtml2"
            :defaultConfig="editorConfig" :mode="mode" @onCreated="handleCreated" @onChange="handleChange" />
        </div>
      </div>
      <div class="rightContent">
        <div class="topRight">
          <div class="articleType">
            <div class="imgDiv" v-if="template_local.data.icon" :style="{}">
              <component :is="useRenderIcon(JSON.parse(template_local.data.icon))" />
            </div>
            <span>{{ template_local.data.name }}</span>
          </div>
          <!-- @TODO 等待插入 -->
          <VueForm v-model="formData" :style="{
            textAlign: 'top',
          }" :schema="schema" :ui-schema="uiSchema" :formProps="formProps" @change="formDataChange">
            <div slot-scope="{ formData }" :style="{ textAlign: 'right' }"></div>
          </VueForm>
        </div>
        <div class="bottomRight">
          <el-button type="primary" style="width: calc(100% - 100px)" size="large" :loading="onceClick"
            @click="createArticle()">
            生成文章
          </el-button>
          <el-button type="primary" plain size="large" @click="copyContent">一键复制</el-button>
        </div>
      </div>
    </div>
  </cardBg>
</template>
<script setup lang="ts">
import "@wangeditor/editor/dist/css/style.css"; // 引入 css
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import cardBg from "@/components/basicComponents/cell/card/cardBg.vue";
import {
  onBeforeUnmount,
  ref,
  shallowRef,
  onMounted,
  watchEffect,
  reactive,
  getCurrentInstance,
} from "vue";
import Edit from "@iconify-icons/ep/edit";
import { getDownLoadRequestHeaders } from "@/utils/api/user/header";
import { loadEnv } from "@build/index";
import { getPreUrl, post, get, getFlowUrl } from "@/utils/api/requests";
import { useRouter, useRoute } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import { stringAnyObj, tableCellTemplate } from "@/modules/userManage/types";
import { propertiesMaker } from "@/modules/userManage/component/searchTable/searchTable";

const router = useRouter();
const route = useRoute();
// import type { FormInstance, FormRules } from 'element-plus'

defineOptions({
  name: "Editor",
});
const mode = "default";
let id = ref("");

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef();

// 内容 HTML
let valueObj = reactive({
  articleName: "",
  valueHtmlStr: "",
});
let valueHtml2 = ref("<p></p>");

const toolbarConfig: any = { excludeKeys: "fullScreen" };
const editorConfig = {
  placeholder: "请输入内容...",
} as { [key: string]: any };
editorConfig["MENU_CONF"] = {};
editorConfig["MENU_CONF"]["uploadImage"] = {
  fieldName: "file",
  server: getPreUrl() + "/cult/sysFile/uploadPreview",
  headers: {
    ...getDownLoadRequestHeaders(),
  },
  customInsert(res: any, insertFn: any) {
    if (res.data) insertFn(res.data, "", res.data);
  },
};

let formLabelAlign = reactive({} as stringAnyObj);

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;
  editor.destroy();
});

const getWriteDetail = (id) => {
  get("/web/intelligence/article/detail?id=" + id, {}).then((res) => {
    if (res.data) {
      const str = res.data.content;
      const editor = editorRef.value;
      valueObj.articleName = res.data.name;
      editor.setHtml(str);
      const data = res.data;
      formLabelAlign.id = data.id;
    }
  });
};

// 加载模板信息
import VueForm from "@lljj/vue3-form-element";
import {
  getDataFromUseAbleComponentsModule,
  getUseAbleComponents,
  makeComponents,
  useAbleComponents,
} from "../component/template/useAbleComponents";
import axios from "axios";
import { inUseModulesComponent } from "../component/template/useAbleComponents";
let onceClick = ref(false);
const uiSchema = {};
const formProps = {
  layoutColumn: 1,
  inlineFooter: false,
  labelSuffix: "",
  labelPosition: "top",
  isMiniDes: false,
  defaultSelectFirstOption: true,
  labelWidth: "120px",
};

const formData = ref({} as stringAnyObj);
const schema = reactive({
  type: "object",
  properties: {},
} as stringAnyObj);

const template_local = reactive({
  data: {} as any,
  queryItemTemplate: [] as inUseModulesComponent[],
} as any);

onMounted(async () => {
  if (route.query.templateId) {
    let { data: template } = await get(
      "/web/knowledge//template/detailHomePage?id=" + route.query.templateId,
      {}
    );
    template_local.data = template;
    const queryItemTemplate = JSON.parse(template.condition).queryItemTemplate;
    template_local.queryItemTemplate = queryItemTemplate;
    let properties = await propertiesMaker(
      queryItemTemplate.map((options) => {
        let target = {} as tableCellTemplate;
        target = getUseAbleComponents(options.__name).tableCellMaker;
        return makeComponents(target, options);
      }),
      {},
      true
    );
    if (!valueObj.articleName) {
      valueObj.articleName = template_local.data.name
    }

    schema.properties = properties;
  } else {
    ElMessage.error("请选择正确的生成模板");
  }
});

const formDataChange = (e) => {
  console.log(formData.value, e);
};

// 加在模板信息 - 結束

// 编排模板信息，获取输出
const createArticle = async () => {
  if (onceClick.value) {
    return;
  }
  onceClick.value = true;
  let data = getDataFromUseAbleComponentsModule(
    formData.value,
    template_local.queryItemTemplate,
    schema.properties
  );
  let content = template_local.data.content;
  valueObj.valueHtmlStr = valueHtml2.value;

  Object.keys(data).map((key) => {
    let text = data[key];
    const cell = schema.properties[key];
    if (cell["ui:widget"] == "SelectWidget") {
      text = cell["enumNames"][cell["enum"].indexOf(text)];
    }
    content = content.replace(`{${key}}`, text || "");
  });
  const editor = editorRef.value;
  // 测试
  fetch(getFlowUrl() + "/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(
      {
        query: content,
        stream: true
      }),
  })
    .then((response) => {
      onceClick.value = false;
      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      function processStreamResult(result2) {
        const str = decoder.decode(result2.value, { stream: !result2.done })
        if (str) {
          const array = str.split('}')
          array.forEach(item => {
            console.log(item,'ppppppp')
            if (item !== '') {
              const chunk = JSON.parse(item + '}')
              editor.insertText(chunk.answer)
            }
          })
          return reader.read().then(processStreamResult);
        } else {
          JSON.parse(str)
        }
      }
      return reader.read().then(processStreamResult);
    })
    .catch((error) => {
      //console.error('Error:', error);
    });
  // 测试流式传输接口

  // let res = await post("/web/intelligence/intellectualWrite", {
  //   ...template_local.data,
  //   content: content,
  // })
  //   .then((res) => {
  //     onceClick.value = false;
  //     const value = res.data.info || "";
  //     const trueIndex = value.indexOf("\n") < 0 ? 10 : value.indexOf("\n");
  //     valueObj.articleName = value.substring(0, trueIndex);
  //     const astr = "<p>" + res.data.info + "</p>";
  //     const editor = editorRef.value;
  //     valueHtml2.value = editor.getHtml() + astr;
  //     editor.setHtml(valueHtml2.value);
  //   })
  //   .catch((res) => {
  //     onceClick.value = false;
  //   });
};

// 编排模板信息，获取输出 - 结束
onMounted(async () => {
  if (route.query.id) {
    getWriteDetail(route.query.id);
  }
});

const handleCreated = (editor) => {
  editorRef.value = editor; // 记录 editor 实例，重要！
};
const handleChange = (editor) => {
  console.log(editor, 'i99')
  valueObj.valueHtmlStr = editor.getHtml()

};

const saveEdit = () => {
  console.log(valueObj.articleName, "ppp");
  if (!valueObj.articleName) {
    ElMessage.success("请生成文章");
    return;
  }
  post("/web/intelligence/article/save", {
    ...formLabelAlign,
    content: valueHtml2.value,
    name: valueObj.articleName,
    writeTemplateId: Number(route.query.templateId),
  }).then((res) => {
    if (res.code == 200) {
      ElMessage.success(res.message);
    }
  });
};

const goBack = () => {
  window.history.go(-1);
};

const copyContent = () => {
  const contentDom = document.querySelector('.w-e-text-container [role=textarea]')
  var selection = window.getSelection()
  var range = document.createRange()
  range.selectNodeContents(contentDom)
  selection.removeAllRanges()
  selection.addRange(range)
  setTimeout(() => {
    if (document.execCommand("copy")) {
      document.execCommand("copy"); //复制成功
      ElMessage.success("复制成功");
    }
  }, 50)
};
</script>

<style lang="scss" scoped>
.btnButton {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #e1e4e8;
  padding: 8px 20px;
}

.documentPage {
  text-align: left;
  width: 100%;
  height: calc(100% - 40px);
  overflow: hidden;
  display: flex;

  .leftContent {
    width: 70%;

    .editorDiv {
      background: #e1e4e8;
      padding: 10px;
      height: calc(100% - 82px);
    }
  }

  .rightContent {
    width: 30%;
    height: calc(100% - 40px);

    .topRight {
      padding: 20px;
      height: calc(100% - 50px);
      overflow-y: auto;

      .articleType {
        padding-bottom: 20px;
        display: flex;
        align-items: center;
        border-bottom: 1px solid #e1e4e8;
        margin-bottom: 10px;

        span {
          font-size: 16px;
          font-weight: 600;
        }

        .imgDiv {
          width: 32px;
          height: 32px;
          padding: 7px;
          border-radius: 4px;
          margin-right: 10px;
          border: 1px solid #eee;
          background-color: #fff;
        }
      }
    }

    .bottomRight {
      height: 80px;
      border-top: 1px solid #e1e4e8;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
    }
  }
}
</style>
