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
    <div v-if="scaledXYZ !== NaN">
      <el-slider @change="computeRGB" :min="(rawXYZ.x+rawXYZ.y+rawXYZ.z)/2" :max="(rawXYZ.x+rawXYZ.y+rawXYZ.z)*5" v-model="xyzScaleRatio"></el-slider>
      <p>
        computed: x {{scaledXYZ.x}} y {{scaledXYZ.y}} z {{scaledXYZ.z}}
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
import { arrayMulti, SpecValue, Ixyz, Irgb } from "./util";
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
  computedRGB: Irgb = { r: 0, g: 0, b: 0 };
  rawXYZ: Ixyz = { x: 0, y: 0, z: 0 };
  scaledXYZ: Ixyz = { x: 0, y: 0, z: 0 };
  xyzScaleRatio: number = 1;
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
    this.rawXYZ = {
      x: xSum,
      y: ySum,
      z: zSum
    };
    this.computeRGB();
  }
  computeRGB() {
    const scaled: Ixyz = {
      x: this.rawXYZ.x / this.xyzScaleRatio,
      y: this.rawXYZ.y / this.xyzScaleRatio,
      z: this.rawXYZ.z / this.xyzScaleRatio
    };
    this.scaledXYZ = scaled;
    const r = 3.2406 * scaled.x - 1.5372 * scaled.y - 0.4986 * scaled.z;
    const g = -0.9689 * scaled.x + 1.8758 * scaled.y + 0.0415 * scaled.z;
    const b = 0.0557 * scaled.x - 0.204 * scaled.y + 1.057 * scaled.z;

    this.computedRGB = {
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
