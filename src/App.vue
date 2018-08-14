<template>
  <div id="app" style=" display:flex;flex-direction:column;height:100vh;">
    <el-menu :router="true" :default-active="activeIndex" mode="horizontal" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
      <li style="color: rgb(255, 255, 255); border-bottom-color: transparent; background-color: rgb(84, 92, 100);" class="el-menu-item">🌈 Ultra Spectrum 🌈</li>
      <el-menu-item index="/">Home</el-menu-item>
      <el-menu-item index="/rgb">RGB to Spectrum</el-menu-item>
      <el-menu-item index="/maker">Spectrum Maker</el-menu-item>
    </el-menu>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

export default class App extends Vue {
  private get activeIndex(): string {
    return this.$route.path;
  }
}
</script>
<style>
#app {
  /* font-family: "Avenir", Helvetica, Arial, sans-serif; */
  font-family: "游ゴシック", YuGothic, "ヒラギノ角ゴ Pro",
    "Hiragino Kaku Gothic Pro", "メイリオ", Meiryo, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
