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
    <div v-if="computedXYZ !== NaN">
      <p>
        computed: x {{computedXYZ.x}} y {{computedXYZ.y}} z {{computedXYZ.z}}
      </p>
      <p>
        computed: r {{computedRGB.r}} g {{computedRGB.g}} b {{computedRGB.b}}
      </p>
      <div :style="`backgroundColor:rgb(${computedRGB.r*255},${computedRGB.g*255},${computedRGB.b*255})`" style="width:2em;height:2em; background-color:#eee;" id="color-block"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import SpecGraph from "./components/SpecGraph.vue";
import { arrayMulti, SpecValue } from "./util";
import { Breadcrumb } from "element-ui";

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
  colorMatch: { x: SpecValue; y: SpecValue; z: SpecValue } = {
    x: require("./assets/spec_color_match/x.json"),
    y: require("./assets/spec_color_match/y.json"),
    z: require("./assets/spec_color_match/z.json")
  };
  computedXYZ: { x: number; y: number; z: number } = { x: 0, y: 0, z: 0 };
  computedRGB: { r: number; g: number; b: number } = { r: 0, g: 0, b: 0 };
  mounted() {
    this.updateChange();
  }
  selectedLight: number = 0;
  selectedReflectance: number = 0;
  selectComputed: SpecValue = {} as SpecValue;

  updateChange() {
    const computedData = arrayMulti(
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
    this.colorMatching(result);
  }
  accumulator(x: number, y: number) {
    if (x !== NaN && y !== NaN) {
      return x + y;
    } else {
      return x;
    }
  }
  colorMatching(spec: SpecValue) {
    const xData = arrayMulti(spec.data, this.colorMatch.x.data);
    const yData = arrayMulti(spec.data, this.colorMatch.y.data);
    const zData = arrayMulti(spec.data, this.colorMatch.z.data);
    const xSum = xData.filter(item => item).reduce((a, b) => a + b);
    const ySum = yData.filter(item => item).reduce((a, b) => a + b);
    const zSum = zData.filter(item => item).reduce((a, b) => a + b);
    this.computedXYZ = {
      x: xSum / (xSum + ySum + zSum),
      y: ySum / (xSum + ySum + zSum),
      z: zSum / (xSum + ySum + zSum)
    };
    this.computedRGB = this.xyz2rgb(this.computedXYZ);
  }
  xyz2rgb(xyz: {
    x: number;
    y: number;
    z: number;
  }): { r: number; g: number; b: number } {
    const r = 3.2406 * xyz.x - 1.5372 * xyz.y - 0.4986 * xyz.z;
    const g = -0.9689 * xyz.x + 1.8758 * xyz.y + 0.0415 * xyz.z;
    const b = 0.0557 * xyz.x - 0.204 * xyz.y + 1.057 * xyz.z;
    return {
      r: this.gammaCorrection(r),
      g: this.gammaCorrection(g),
      b: this.gammaCorrection(b)
    };
  }
  gammaCorrection(v: number): number {
    if (v <= 0.0031308) {
      return 12.92 * v;
    } else {
      return (1 + 0.055) * Math.pow(v, 1 / 2.4) - 0.055;
    }
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
