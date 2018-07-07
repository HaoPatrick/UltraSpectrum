<template>
  <div id="app">
    <div>
      <el-select @change="updateChange" placeholder="Select" v-model="selectedLight">
        <el-option v-for="(item,index) in lights" :key="item.name" :label="item.name" :value="index">
        </el-option>
      </el-select>
      <el-select @change="updateChange" placeholder="Select" v-model="selectedReflectance">
        <el-option v-for="(item,index) in reflectance" :key="item.name" :label="item.name" :value="index"></el-option>
      </el-select>
    </div>
    <div class="graph-column">
      <SpecGraph v-if="selectedLight.name!==''" :id="'light'" :spec='lights[selectedLight]'></SpecGraph>
      <SpecGraph v-if="selectedReflectance.name!==''" :id="'reflectance'" :spec='reflectance[selectedReflectance]'></SpecGraph>
      <SpecGraph v-if="selectComputed.name!==''" :id="'computed'" :spec='selectComputed'></SpecGraph>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import SpecGraph from "./components/SpecGraph.vue";
import { specMulti, SpecValue } from "./util";

@Component({
  components: {
    SpecGraph
  }
})
export default class App extends Vue {
  lights: SpecValue[] = [
    require("./assets/spec_lights/d50.json"),
    require("./assets/spec_lights/illA.json")
  ];
  reflectance: SpecValue[] = [
    require("./assets/spec_reflectance/black_dry_leaf.json"),
    require("./assets/spec_reflectance/green_leaf.json"),
    require("./assets/spec_reflectance/red_flower.json"),
    require("./assets/spec_reflectance/yellow_flower.json")
  ];

  mounted() {
    this.updateChange();
  }
  selectedLight: number = 0;
  selectedReflectance: number = 0;
  selectComputed: SpecValue = {} as SpecValue;

  updateChange() {
    const computedData = specMulti(
      this.lights[this.selectedLight].data,
      this.reflectance[this.selectedReflectance].data
    );
    const example = this.lights[this.selectedLight];
    const result: SpecValue = {
      name: "computed",
      type: "computed",
      type_max: example.type_max * this.selectComputed.type_max,
      start_nm: example.start_nm,
      end_nm: example.end_nm,
      resolution: example.resolution,
      data: computedData
    };
    this.selectComputed = result;
  }
}
</script>
<style scoped>
.graph-column {
  display: flex;
}
</style>

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
