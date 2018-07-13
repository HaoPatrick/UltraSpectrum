<template>
  <div id="app" v-loading="loading">
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
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
  margin-top: 60px;
}
</style>
