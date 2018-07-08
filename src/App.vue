<template>
  <div id="app">
    <div>
      <span>Light: </span>
      <el-select @change="updateChange" placeholder="Select" v-model="selectedLight">
        <el-option v-for="(item,index) in lights" :key="item.name" :label="item.name" :value="index">
        </el-option>
      </el-select>
      <span> Reflectance: </span>
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
      <div style="width:30%;margin:auto;">
        <el-slider @change="computeRGB" :min="(rawXYZ.x+rawXYZ.y+rawXYZ.z)/5" :max="(rawXYZ.x+rawXYZ.y+rawXYZ.z)*5" v-model="xyzScaleRatio"></el-slider>
      </div>
      <div style="display:flex;justify-content:center;">
        <div>
          <p>
            xyz: ({{scaledXYZ.x|round3}}, {{scaledXYZ.y|round3}}, {{scaledXYZ.z|round3}})
          </p>
          <p :style="`color: ${validRGB?'inherit':'#da3f3f'};`">
            rgb: ({{computedRGB.r|round3}}, {{computedRGB.g|round3}}, {{computedRGB.b|round3}})
          </p>
          <p :style="`color: ${validRGB?'inherit':'#da3f3f'};`">
            rgb: ({{computedRGB.r*255|round}}, {{computedRGB.g*255|round}}, {{computedRGB.b*255|round}})
          </p>
        </div>
        <div>
          <div :style="`backgroundColor:rgb(${computedRGB.r*255},${computedRGB.g*255},${computedRGB.b*255})`" style="margin-left:1em;width:4em;height:4em;"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import SpecGraph from "./components/SpecGraph.vue";
import { arrayMulti, SpecValue, Ixyz, Irgb } from "./util";
import { Breadcrumb } from "element-ui";
import * as utilLib from "./util";
import * as colorData from "./util/colorData";
@Component({
  components: {
    SpecGraph
  },
  filters: {
    round3(val: number) {
      return Math.round(val * 1000) / 1000;
    },
    round(val: number) {
      return Math.round(val);
    }
  }
})
export default class App extends Vue {
  protected selectedLight: number = 0;
  protected selectedReflectance: number = 0;
  protected selectComputed: SpecValue = {} as SpecValue;
  private lights: SpecValue[] = colorData.lights;
  private reflectance: SpecValue[] = colorData.reflectance;
  private colorMatch: {
    x: SpecValue;
    y: SpecValue;
    z: SpecValue;
  } = colorData.colorMatch;
  private computedRGB: Irgb = { r: 0, g: 0, b: 0 };
  private rawXYZ: Ixyz = { x: 0, y: 0, z: 0 };
  private scaledXYZ: Ixyz = { x: 0, y: 0, z: 0 };
  private xyzScaleRatio: number = 1;
  private util = utilLib;
  private get validRGB() {
    return (
      this.computedRGB.r > 0 &&
      this.computedRGB.r < 1 &&
      this.computedRGB.g > 0 &&
      this.computedRGB.g < 1 &&
      this.computedRGB.b > 0 &&
      this.computedRGB.b < 1
    );
  }

  public updateChange() {
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

  public colorMatching(spec: SpecValue) {
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
    this.xyzScaleRatio = xSum + ySum + zSum;
    this.computeRGB();
  }
  public computeRGB() {
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

  private mounted() {
    this.updateChange();
  }

  private gammaCorrection(v: number): number {
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
p {
  margin-top: 0.4em;
}
red-text {
  color: #da3f3f;
}
</style>

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
