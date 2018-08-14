<template>
    <div>
        <div>
            <span>Color Temperature:
            </span>
            <el-input-number @change="computePlankian" v-model="temp" :step="500" :min="1500"></el-input-number>
        </div>
        <div v-if="loading===false" style="display:flex;">
            <SpecGraph :id="'parsed'" :spec="spectrum"></SpecGraph>
            <ColorBlock :color="rgb"></ColorBlock>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { spectrumAtTemp } from "../util/PlanckianLocus";
import SpecGraph from "../components/SpecGraph.vue";
import ColorBlock from "../components/ColorBlock.vue";
import { numers2spec, ISpecValue } from "../util";
import * as utilLib from "../util";
import { RGB } from "@/util/ColorSpace";

@Component({
  components: {
    SpecGraph,
    ColorBlock
  }
})
export default class MakerPlanck extends Vue {
  private temp: number = 3000;
  private loading: boolean = true;
  private spectrum: ISpecValue = {} as ISpecValue;
  private rgb: RGB = new RGB(0, 0, 0);
  private mounted() {
    this.computePlankian();
  }
  private computePlankian() {
    const values = spectrumAtTemp(this.temp);
    this.spectrum = numers2spec(values, `Planckian-${this.temp}K`);
    const xyz = utilLib.spec2xyz(this.spectrum);
    const xyzNormed = xyz.norm();
    this.rgb = xyzNormed.toRGB();
    this.loading = false;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
