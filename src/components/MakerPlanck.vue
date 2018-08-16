<template>
  <div>
    <div class="control">
      <span>Color Temperature:
      </span>
      <el-input-number @change="computePlankian" v-model="temp" :step="500" :min="1500"></el-input-number>
      <el-button style="margin-left:1em;" @click="generateAll">Generate All</el-button>
    </div>
    <DetailedGraph v-if="loading===false" :spectrum="spectrum"></DetailedGraph>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { spectrumAtTemp } from "../util/PlanckianLocus";
import { RGB, Spectrum, SPECTYPE, ISpecValue } from "@/util/ColorSpace";
import DetailedGraph from "@/components/DetailedGraph.vue";
import range from "lodash/range";
import { downloadJson } from "@/util";

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
    this.spectrum = spectrumAtTemp(this.temp);
    this.loading = false;
  }
  private generateAll() {
    const tempRange = range(2000, 10000, 400);
    const specs = tempRange.map(val => {
      return spectrumAtTemp(val);
    });
    downloadJson(JSON.stringify(specs), "PlanckianLocusAll");
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
