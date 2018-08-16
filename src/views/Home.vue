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
import * as colorData from "../util/ColorData";
import * as api from "../util/api";
import { RGB, XYZ, Spectrum } from "../util/ColorSpace";

@Component({
  components: {
    SpecGraph,
    ColorBlock
  }
})
export default class App extends Vue {
  protected selectedLight: Spectrum = Object.values(colorData.lights)[0];
  protected selectedReflectance: Spectrum = colorData.reflectance[0];
  protected selectComputed!: Spectrum;
  private lights: Spectrum[] = Object.values(colorData.lights);
  private reflectance: string[] = [];
  private computedRGB = new RGB(0, 0, 0);
  private rawXYZ = new XYZ(0, 0, 0);
  private elSelectLight: number = 0;
  private elSelectRef: number = 0;
  private xyzScaleRatio: number = 1;
  private inputSpectrum: string = "";
  private util = utilLib;
  private loading: boolean = false;

  public async updateReflectance(val: number) {
    this.loading = true;
    const seleted = this.reflectance[val];
    const reflectanceGot = await api.getSpecByName(seleted);
    this.selectedReflectance = new Spectrum(reflectanceGot);
    this.updateChange();
    this.loading = false;
  }
  public updateLight(val: number) {
    this.selectedLight = this.lights[val];
    this.updateChange();
  }
  public updateChange() {
    const computedData = arrayMulti(
      this.selectedLight.data,
      this.selectedReflectance.data
    );
    const result: Spectrum = Spectrum.makeFromValue(computedData, "computed");
    this.selectComputed = result;
    const xyz = result.toXYZ();
    this.rawXYZ = xyz;
    this.computedRGB = xyz.toRGB();
  }

  private async created() {
    this.loading = true;
    this.selectedLight = this.lights[0];
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

