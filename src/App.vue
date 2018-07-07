<template>
  <div id="app">
    <div>
      <el-select v-model="selectedLight">
        <el-option v-for="item in lights" :key="item.name" :label="item.name" :value="item">
        </el-option>
      </el-select>
      <el-select v-model="selectedReflectance">
        <el-option v-for="item in reflectance" :key="item.name" :label="item.name" :value="item"></el-option>
      </el-select>
    </div>
    <div>
      <SpecGraph v-if="selectedLight.name!==''" ref="lightGraph" :id="'light'" :spec='selectedLight'></SpecGraph>
      <SpecGraph v-if="selectedReflectance.name!==''" ref="refleComponent" :id="'reflectance'" :spec='selectedReflectance'></SpecGraph>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import SpecGraph from "./components/SpecGraph.vue";

@Component({
  components: {
    SpecGraph
  }
})
export default class App extends Vue {
  lights = [
    require("./assets/spec_lights/d50.json"),
    require("./assets/spec_lights/illA.json")
  ];
  reflectance = [
    require("./assets/spec_reflectance/black_dry_leaf.json"),
    require("./assets/spec_reflectance/green_leaf.json"),
    require("./assets/spec_reflectance/red_flower.json"),
    require("./assets/spec_reflectance/yellow_flower.json")
  ];

  selectedLight: object = this.lights[0];
  selectedReflectance: object = this.reflectance[0];
  mounted() {}

  $refs!: {
    spcComponent: SpecGraph;
    refleComponent: SpecGraph;
  };
}
</script>

<style>
#app {
  /* font-family: "Avenir", Helvetica, Arial, sans-serif; */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
