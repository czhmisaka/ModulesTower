<!--
 * @Date: 2021-12-30 11:00:24
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-11-07 23:23:55
 * @FilePath: \ConfigForDesktopPage\src\App.vue
-->
<template>
  <el-container class="wholePage">
    <el-header style="padding: 0px; z-index: 1000" v-if="meta.headerMenu">
      <czhHeader />
    </el-header>
    <el-container>
      <el-aside style="padding: 0px; z-index: 100" v-if="meta.asideMenu">
        <czhMenu :name="menu" />
      </el-aside>
      <el-main style="padding: 0px; z-index: 10">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
  <lineSlideExchange
    ref="lineSlideExchange"
    :linesNumber="linesNumber"
    :rotate="rotate"
    :start-color="sColor"
    :end-color="eColor"
    :speed="1.3"
  />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import czhHeader from "./components/header/header.vue";
import czhMenu from "./components/menu/menu.vue";
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
  computed: {
    meta() {
      return this.$route.meta;
    },
  },
  mounted() {
    console.log(this.$router.options.routes,'qwe')
    this.$refs["lineSlideExchange"].start();
    this.$refs["lineSlideExchange"].finish();
  },
  methods: {},
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
