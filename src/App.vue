<!--
 * @Date: 2021-12-30 09:26:46
 * @LastEditors: CZH
 * @LastEditTime: 2021-12-30 09:35:15
 * @FilePath: /configforpagedemo/src/App.vue
-->
<template>
  <div>
    <img src="./assets/logo.png" />

    <p>
      If Element Plus is successfully added to this project, you'll see an
      <code v-text="'<el-button>'"></code>
      below
    </p>
    <el-button type="primary">el-button</el-button>

    <HelloWorld msg="Welcome to Your Vue.js App"></HelloWorld>
  </div>
</template>

<script>
import HelloWorld from "./components/HelloWorld.vue";

export default {
  name: "App",
  components: {
    HelloWorld,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
