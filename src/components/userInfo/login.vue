<template>
  <cardBg id="login-panel">
    <div class="wrapper">
      <div class="content">
        <div class="top-bar">
          <div class="top-bar-left"></div>
          <div class="top-bar-title"></div>
          <div class="top-bar-eight"></div>
        </div>
        <div v-if="status != loginStatus.success" class="form fade">
          <input
            type="text"
            v-model="userInfo.name"
            placeholder="请输入用户名"
            class="input"
          />
          <div
            @click="onProcessLogin"
            :style="{
              maxWidth: status == loginStatus.loading ? '40px' : '80px',
              borderRadius: status == loginStatus.loading ? '20px' : '5px',
            }"
            class="confirm-button"
          >
            <template v-if="status == loginStatus.loading">
              <div class="spinner"><div class="double-bounce1"></div></div>
            </template>
            <div v-if="status == loginStatus.idle">登陆</div>
          </div>
        </div>
        <div v-if="status == loginStatus.success" class="form fade">
          <div class="avatar">
            <img :src="userInfo.avatarUrl" alt="" />
          </div>
          <div class="user-panel">好！一看就知道《{{ userInfo.name }}》很有精神！</div>
          <div @click="onProcessLogout" class="confirm-button red">注销</div>
        </div>
        <div></div>
      </div>
    </div>
  </cardBg>
</template>
<script setup>
import cardBg from "@/components/basicComponents/cell/card/cardBg";
import { onMounted, ref, getCurrentInstance, defineEmits } from "vue";
import { get, post } from "@/api/requests";

const { proxy } = getCurrentInstance();
var loginStatus = {
  idle: 0,
  loading: 1,
  success: 2,
  error: 3,
};
const status = ref(loginStatus.idle);
const userInfo = ref({
  name: "",
  avatar: "",
});
function onProcessLogin() {
  if (status.value == loginStatus.idle) {
    status.value = loginStatus.loading;
    setTimeout(async () => {
      let getres = await get("/userinfo", { body: { name: userInfo.value.name } });
      if (getres.data.length == 0) {
        let res = await post("/userinfo", {
          name: userInfo.value.name,
          avatar:
            "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg9.doubanio.com%2Fview%2Frichtext%2Flarge%2Fpublic%2Fp23277515.jpg&refer=http%3A%2F%2Fimg9.doubanio.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1664187020&t=448e16291cb2b08d9bff0e22476c3c3c",
        });
        console.log(res);
      } else {
        userInfo.value = getres.data[0];
      }
      status.value = loginStatus.success;
    }, 1000);
  }
}
function onProcessLogout() {
  if (status.value == loginStatus.success) {
    status.value = loginStatus.idle;
  }
}

const emit = defineEmits(["ready", "onChange"]);

onMounted(() => {
  emit("ready");
  window.onkeyup = () => {
    let key = window.event.key;
    if (key == "ArrowDown") {
      // showAnswer.value = false;
    } else if (key == "Enter") {
      onProcessLogin();
    }
  };
});
</script>

<style lang="scss">
#login-panel {
  justify-content: center;
  display: flex;
  width: 100%;
  height: 100%;
}
.wrapper {
  background-color: #fff;
  @keyframes Opacityfade {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
  .fade {
    animation: Opacityfade 1s ease;
  }

  .content {
    // margin: 30px;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: column;
    .top-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      &-title {
        text-align: center;
        font-size: 3%;
      }
    }
    .form {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      .avatar {
        width: 40px;
        height: 40px;
        border-radius: 10px;
        background-color: #eeee;
        margin-right: 10px;
        overflow: hidden;
        box-shadow: -3px 4px 4px rgba(0, 0, 0, 0.1);
        img {
          width: 40px;
          height: 40px;
        }
      }
      .confirm-button {
        margin-left: 10px;
        height: 40px;
        width: 20%;
        max-width: 80px;
        background-color: #42b983;
        color: #fff;
        text-align: center;
        line-height: 40px;
        outline: 2px solid transparent;
        border: 2px solid #fff;
        border-radius: 5px;
        cursor: pointer;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        transition: max-width 0.3s ease;
      }
      .confirm-button:hover {
        border: 2px solid rgba(0, 0, 0, 0.1);
      }

      .red {
        background-color: rgba(241, 134, 130);
      }
      .input {
        margin-top: 4px;
        font-size: 18px;
        outline: 2px solid transparent;
        border: 2px solid #fff;
        width: 70%;
        max-width: 300px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        background-color: #eee;
        border-radius: 5px;
        transition: all 0.3s ease;
      }

      .input:focus {
        border: 2px solid #42b983;
      }
    }
  }
}
.spinner {
  width: 30px;
  height: 30px;

  position: relative;
}

.double-bounce1,
.double-bounce2 {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #fff;
  opacity: 0.6;
  position: absolute;
  top: 0;
  left: 0;

  -webkit-animation: sk-bounce 2s infinite ease-in-out;
  animation: sk-bounce 2s infinite ease-in-out;
}

.double-bounce2 {
  -webkit-animation-delay: -1s;
  animation-delay: -1s;
}

@-webkit-keyframes sk-bounce {
  0%,
  100% {
    -webkit-transform: scale(0);
  }
  50% {
    -webkit-transform: scale(1);
  }
}

@keyframes sk-bounce {
  0%,
  100% {
    transform: scale(0);
    -webkit-transform: scale(0);
  }
  50% {
    transform: scale(1);
    -webkit-transform: scale(1);
  }
}
</style>
