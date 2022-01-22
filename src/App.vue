<!--
 * @Date: 2021-12-30 11:00:24
 * @LastEditors: CZH
 * @LastEditTime: 2022-01-22 19:21:11
 * @FilePath: /configforpagedemo/src/App.vue
-->
<template>
  <el-container class="wholePage">
    <el-header style="padding: 0px" height="50">
      <czhHeader />
    </el-header>
    <el-main style="padding: 6px">
      <el-aside style="padding: 0px">
        <czhMenu />
      </el-aside>
      <el-main>
        <router-view />
      </el-main>
    </el-main>
  </el-container>
</template>

<script>
import czhHeader from "./components/header/header.vue";
import czhMenu from "./components/menu/menu";
export default {
  components: { czhHeader, czhMenu },
  data: () => {
    return {};
  },
  async onLoad() {
    return null;
  },
  methods: {},
};
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
