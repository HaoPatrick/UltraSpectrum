<template>
  <div>
    <div class="control">
      <span>Color Temperature:
      </span>
      <el-input-number @change="computePlankian" v-model="temp" :step="500" :min="1500"></el-input-number>
    </div>
    <DetailedGraph v-if="loading===false" :spectrum="spectrum"></DetailedGraph>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { spectrumAtTemp } from "../util/PlanckianLocus";
import * as utilLib from "../util";
import { RGB, Spectrum, SPECTYPE, ISpecValue } from "@/util/ColorSpace";
import DetailedGraph from "@/components/DetailedGraph.vue";

@Component({
  components: {
    DetailedGraph
  }
})
export default class MakerPlanck extends Vue {
  private temp: number = 3000;
  private loading: boolean = true;
  private spectrum: Spectrum = {} as Spectrum;
  private mounted() {
    this.computePlankian();
  }
  private computePlankian() {
    const values = spectrumAtTemp(this.temp);
    this.spectrum = Spectrum.makeFromValue(
      values,
      `Planckian-${this.temp}K`,
      SPECTYPE.Illuminant
    );
    this.loading = false;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
div {
  text-align: left;
}
.control {
  margin-bottom: 1em;
}
</style>
