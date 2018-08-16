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
    <div v-if="loading===false" class="graph-column">
      <SpecGraph v-if="selectedLight.name!==''" :id="'light'" :spec='selectedLight'></SpecGraph>
      <SpecGraph v-if="selectedReflectance.name!==''" :id="'reflectance'" :spec='selectedReflectance'></SpecGraph>
    </div>
    <div v-if="loading===false" class="graph-column">
      <DetailedGraph :spectrum="selectComputed"></DetailedGraph>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import SpecGraph from "../components/SpecGraph.vue";
import ColorBlock from "../components/ColorBlock.vue";
import DetailedGraph from "../components/DetailedGraph.vue";
import { arrayMulti } from "../util/ColorMath";
import * as colorData from "../util/ColorData";
import * as api from "../util/api";
import { RGB, XYZ, Spectrum, ISpecValue } from "../util/ColorSpace";

@Component({
  components: {
    SpecGraph,
    ColorBlock,
    DetailedGraph
  }
})
export default class App extends Vue {
  protected selectedLight: Spectrum = Object.values(colorData.lights)[0];
  protected selectedReflectance: Spectrum = colorData.reflectance[0];
  protected selectComputed!: Spectrum;
  private lights: Spectrum[] = Object.values(colorData.lights);
  private reflectance: string[] = [];
  private computedRGB = new RGB(0, 0, 0);
  private computedXYZ = new XYZ(0, 0, 0);
  private elSelectLight: number = 0;
  private elSelectRef: number = 0;
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
    this.updateChange();
  }
  public updateChange() {
    const computedData = arrayMulti(
      this.selectedLight.data,
      this.selectedReflectance.data
    );
    const result: Spectrum = Spectrum.makeFromValue(computedData, "computed");
    this.selectComputed = result;
    this.computedXYZ = result.toXYZ().norm();
    this.computedRGB = this.computedXYZ.toRGB();
  }

  private async created() {
    this.loading = true;
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
  justify-content: center;
}
p {
  margin-top: 0.4em;
}
red-text {
  color: #da3f3f;
}
</style>

