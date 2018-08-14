<template>
  <div v-loading="loading">
    <div>
      <span>Light: </span>
      <el-select @change="updateLight" v-model="elSelectLight" placeholder="Select">
        <el-option v-for="(item,index) in lights" :key="item.name" :label="item.name" :value="index">
        </el-option>
      </el-select>
      <span> Reflectance: </span>
      <el-select filterable @change="updateReflectance" v-model="elSelectRef" placeholder="Select">
        <el-option v-for="(item,index) in reflectance" :key="item" :label="item" :value="index"></el-option>
      </el-select>
    </div>
    <div class="graph-column">
      <SpecGraph v-if="selectedLight.name!==''" :id="'light'" :spec='selectedLight'></SpecGraph>
      <SpecGraph v-if="selectedReflectance.name!==''" :id="'reflectance'" :spec='selectedReflectance'></SpecGraph>
      <SpecGraph v-if="selectComputed.name!==''" :id="'computed'" :spec='selectComputed'></SpecGraph>
    </div>
    <div v-if="loading===false">
      <div style="width:30%;margin:auto;">
        <el-slider @change="updateRGB" :min="(rawXYZ.x+rawXYZ.y+rawXYZ.z)/5" :max="(rawXYZ.x+rawXYZ.y+rawXYZ.z)*5" v-model="xyzScaleRatio"></el-slider>
      </div>
      <div>
        <ColorBlock :color="computedRGB"></ColorBlock>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import SpecGraph from "../components/SpecGraph.vue";
import ColorBlock from "../components/ColorBlock.vue";
import { arrayMulti, ISpecValue } from "../util";
import { Breadcrumb } from "element-ui";
import * as utilLib from "../util";
import * as colorData from "../util/colorData";
import * as api from "../util/api";
import { RGB, XYZ } from "../util/ColorSpace";

@Component({
  components: {
    SpecGraph,
    ColorBlock
  }
})
export default class App extends Vue {
  protected selectedLight: ISpecValue = Object.values(colorData.lights)[0];
  protected selectedReflectance: ISpecValue = {} as ISpecValue;
  protected selectComputed: ISpecValue = {} as ISpecValue;
  private lights: ISpecValue[] = Object.values(colorData.lights);
  private reflectance: string[] = [];
  private colorMatch: {
    x: ISpecValue;
    y: ISpecValue;
    z: ISpecValue;
  } = colorData.colorMatch;
  private computedRGB = new RGB(0, 0, 0);
  private rawXYZ = new XYZ(0, 0, 0);
  private scaledXYZ = new XYZ(0, 0, 0);
  private elSelectLight: number = 0;
  private elSelectRef: number = 0;
  private xyzScaleRatio: number = 1;
  private inputSpectrum: string = "";
  private util = utilLib;
  private lightMaxN: number = 20;
  private loading: boolean = false;

  public async updateReflectance(val: number) {
    this.loading = true;
    const seleted = this.reflectance[val];
    this.selectedReflectance = await api.getSpecByName(seleted);
    this.updateChange();
    this.loading = false;
  }
  public updateLight(val: number) {
    this.selectedLight = this.lights[val];
    this.lightMaxN = utilLib.lightMax(this.selectedLight);
    this.updateChange();
  }
  public updateChange() {
    const computedData = arrayMulti(
      this.selectedLight.data,
      this.selectedReflectance.data
    );
    const testXYZ = {
      x: arrayMulti(this.selectedLight.data, this.colorMatch.x.data)
        .filter(item => item)
        .reduce((a, b) => a + b),
      y: arrayMulti(this.selectedLight.data, this.colorMatch.y.data)
        .filter(item => item)
        .reduce((a, b) => a + b),
      z: arrayMulti(this.selectedLight.data, this.colorMatch.z.data)
        .filter(item => item)
        .reduce((a, b) => a + b)
    };
    // tslint:disable-next-line:no-console
    console.log("light xyz:", testXYZ);
    const example = this.selectedLight;
    const result: ISpecValue = {
      name: "computed",
      type: "computed",
      type_max: example.type_max * this.selectComputed.type_max,
      start_nm: example.start_nm,
      end_nm: example.end_nm,
      resolution: example.resolution,
      data: computedData,
      rgb_d65: []
    };
    this.selectComputed = result;
    const xyz = utilLib.spec2xyz(result);
    this.rawXYZ = xyz;
    this.xyzScaleRatio = this.lightMaxN;
    const rgb = this.xyz2rgb(this.rawXYZ, this.xyzScaleRatio);
    this.computedRGB = rgb;
  }
  public updateRGB() {
    const rgb = this.xyz2rgb(this.rawXYZ, this.xyzScaleRatio);
    this.computedRGB = rgb;
  }
  public xyz2rgb(xyz: XYZ, xyzScale: number): RGB {
    const scaled = new XYZ(
      xyz.x / xyzScale,
      xyz.y / xyzScale,
      xyz.z / xyzScale
    );
    this.scaledXYZ = scaled;
    return scaled.toRGB();
  }

  private async created() {
    this.loading = true;
    this.selectedLight = this.lights[0];
    this.lightMaxN = utilLib.lightMax(this.selectedLight);
    this.selectedReflectance = colorData.reflectance[0];
    this.reflectance = await api.getAllNames();
    await this.updateReflectance(0);

    this.loading = false;
  }
}
</script>
<style scoped>
.graph-column {
  display: flex;
  flex-wrap: wrap;
}
p {
  margin-top: 0.4em;
}
red-text {
  color: #da3f3f;
}
</style>

