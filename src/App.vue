<template>
  <div id="app">
    <el-menu style="margin-bottom:1em;" :router="true" default-active="/" mode="horizontal" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
      <!-- <el-menu-item index="/">Ultra Spectrum</el-menu-item> -->
      <li style="color: rgb(255, 255, 255); border-bottom-color: transparent; background-color: rgb(84, 92, 100);" class="el-menu-item">🌈 Ultra Spectrum 🌈</li>
      <el-menu-item index="/">Home</el-menu-item>
      <el-menu-item index="/rgb">RGB to Spectrum</el-menu-item>
      <el-menu-item index="/maker">Spectrum Maker</el-menu-item>
    </el-menu>
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

export default class App extends Vue {
  private activeIndex: string = "2";
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
