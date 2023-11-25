<script setup lang="ts">
import Motion from "./utils/motion";
import { useRouter } from "vue-router";
import { loginRules } from "./utils/rule";
import { initRouter } from "@/router/utils";
import { useNav } from "@/layout/hooks/useNav";
import { message } from "@pureadmin/components";
import type { FormInstance } from "element-plus";
import { useLayout } from "@/layout/hooks/useLayout";
import { useUserStoreHook } from "@/store/modules/user";
import { bg, avatar, illustration } from "./utils/static";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { ref, reactive, toRaw, onMounted, onBeforeUnmount } from "vue";
import { useDataThemeChange } from "@/layout/hooks/useDataThemeChange";
import { useModuleHook } from "@/store/modules/module";
import { Base64 } from "js-base64";
import { post, get } from "@/utils/api/requests";

import dayIcon from "@/assets/svg/day.svg?component";
import darkIcon from "@/assets/svg/dark.svg?component";

defineOptions({
  name: "Login",
});
const router = useRouter();
const loading = ref(false);
const ruleFormRef = ref<FormInstance>();

const { initStorage } = useLayout();
initStorage();

const { dataTheme, dataThemeChange } = useDataThemeChange();
dataThemeChange();
// 使用全局项目名称
// const { title } = useNav();

const title = "集智低代码应用集成平台";

const ruleForm = reactive({
  username: "",
  password: "",
  captcha: "",
});
const imageCode = ref("");
const imageCodeId = ref("");

const onLogin = async (formEl: FormInstance | undefined) => {
  loading.value = true;
  if (!formEl) return;
  try {
    await formEl.validate((valid, fields) => {
      if (valid) {
        const obj = {
          username: ruleForm.username,
          password: Base64.encode(ruleForm.password),
          captchaId: imageCodeId.value,
          captcha: ruleForm.captcha,
        };
        useUserStoreHook()
          .loginByUsername(obj)
          .then((res) => {
            if (res && res["token"]) {
              // 获取后端路由
              initRouter().then(() => {
                message.success("登录成功");
                // 获取访问路径的页面 同时切换模块 ， 或者进入模块首页 @Todo
                const module = useModuleHook();
                router.push("/");
              });
            }
          })
          .catch((err) => {
            if (err.code == 12000 || err.code == 11001) {
              ruleForm.captcha = "";
              reqGetImageCode();
            }
          });
      } else {
        loading.value = false;
        return fields;
      }
    });
  } catch (e) {
  } finally {
    loading.value = false;
  }
};

const reqGetImageCode = async () => {
  let res = await get("/web/usc/createCaptcha", {});
  imageCode.value = `data:image/png;base64,${res.data.image}`;
  imageCodeId.value = res.data.id;
};

/** 使用公共函数，避免`removeEventListener`失效 */
function onkeypress({ code }: KeyboardEvent) {
  if (code === "Enter") {
    onLogin(ruleFormRef.value);
  }
}

onMounted(() => {
  reqGetImageCode();
  window.document.addEventListener("keypress", onkeypress);
});

onBeforeUnmount(() => {
  window.document.removeEventListener("keypress", onkeypress);
});
</script>

<template>
  <div class="select-none">
    <div class="flex-c absolute right-5 top-3">
      <!-- 主题 -->
      <el-switch
        v-model="dataTheme"
        inline-prompt
        :active-icon="dayIcon"
        :inactive-icon="darkIcon"
        @change="dataThemeChange"
      />
    </div>
    <div class="login-container">
      <div class="login-box">
        <div class="login-form">
          <Motion>
            <h2 class="outline-none">{{ title }}</h2>
          </Motion>

          <el-form ref="ruleFormRef" :model="ruleForm" :rules="loginRules" size="large">
            <Motion :delay="100">
              <el-form-item
                class="formItem"
                :rules="[
                  {
                    required: true,
                    message: '请输入账号',
                    trigger: 'blur',
                  },
                ]"
                prop="username"
              >
                <el-input
                  clearable
                  v-model="ruleForm.username"
                  placeholder="账号"
                  :prefix-icon="useRenderIcon('user')"
                />
              </el-form-item>
            </Motion>

            <Motion :delay="150">
              <el-form-item class="formItem" prop="password">
                <el-input
                  clearable
                  show-password
                  v-model="ruleForm.password"
                  placeholder="密码"
                  :prefix-icon="useRenderIcon('lock')"
                />
              </el-form-item>
            </Motion>
            <Motion :delay="200">
              <el-form-item class="formItem" prop="captcha">
                <el-input
                  style="width: 260px"
                  clearable
                  v-model="ruleForm.captcha"
                  placeholder="验证码"
                  :prefix-icon="useRenderIcon('lock')"
                />
                <img
                  style="margin-left: 10px"
                  class="img-code"
                  :src="imageCode"
                  alt="图片验证码"
                  @click="reqGetImageCode"
                />
              </el-form-item>
            </Motion>

            <Motion :delay="250">
              <el-button
                class="w-full mt-4"
                size="default"
                type="primary"
                :loading="loading"
                @click="onLogin(ruleFormRef)"
              >
                登录
              </el-button>
            </Motion>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url("@/style/login.css");
</style>

<style lang="scss" scoped>
:deep(.el-input-group__append, .el-input-group__prepend) {
  padding: 0;
}
.formItem {
  margin-bottom: 12px;
}
</style>
