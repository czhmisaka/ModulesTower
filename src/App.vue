<!--
 * @Date: 2021-12-30 11:00:24
 * @LastEditors: CZH
 * @LastEditTime: 2022-04-08 18:50:19
 * @FilePath: /configforpagedemo/src/App.vue
-->
<template>
  <el-container class="wholePage">
    <el-header style="padding: 0px">
      <czhHeader />
    </el-header>
    <el-main style="padding: 6px">
      <el-aside style="padding: 0px">
        <czhMenu :name="menu" />
      </el-aside>
      <el-main>
        {{ sColor }}
        {{ eColor }}
        <router-view />
      </el-main>
    </el-main>
  </el-container>
  <lineSlideExchange
    ref="lineSlideExchange"
    :linesNumber="linesNumber"
    :rotate="rotate"
    :start-color="sColor"
    :end-color="eColor"
    :speed="1.5"
  />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import czhHeader from "./components/header/header.vue";
import czhMenu from "./components/menu/menu.vue";
import { CreateUser } from "@/api/user/user";
import lineSlideExchange from "@/components/animate/lineSlideExchange.vue";

function getRandomColor(): string {
  return "#" + ((Math.random() * 0xffffff) << 0).toString(16);
}

export default defineComponent({
  components: { czhHeader, czhMenu, lineSlideExchange },
  data() {
    return {
      menu: [],
      sColor: getRandomColor(),
      eColor: getRandomColor(),
      rotate: Math.random() * 360,
      linesNumber: 60,
    };
  },
  mounted() {
    setTimeout(async () => {
      this.sColor = getRandomColor();
      this.eColor = getRandomColor();
      this.rotate = Math.random() * 360;
      await this.$nextTick();
      this.$refs["lineSlideExchange"].start();
    }, 500);
    setTimeout(() => {
      this.$refs["lineSlideExchange"].finish();
    }, 2500);
    setInterval(() => {
      setTimeout(async () => {
        this.sColor = getRandomColor();
        this.eColor = getRandomColor();
        this.rotate = Math.random() * 360;
        await this.$nextTick();
        this.$refs["lineSlideExchange"].start();
      }, 500);
      setTimeout(() => {
        this.$refs["lineSlideExchange"].finish();
      }, 2500);
    }, 5500);
  },
  methods: {
    async createUser() {
      let res: any = await CreateUser({
        name: "admin",
        password: "123456",
        email: "1234@123.12",
      });
      console.log(res);
    },
  },
});
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

.wholePage {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  margin: 0px;
  padding: 0px;
  border: 0px;
}
</style>
