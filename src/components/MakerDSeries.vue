<template>
  <div>
    <div>
      <span>Color Temperature: </span>
      <el-input-number @change="computeDSeries" v-model="temp" :step="500" :min="1000" :max="25000"></el-input-number>
      <el-button @click="generateAll" style="margin-left:1em;">Generate All</el-button>
    </div>
    <DetailedGraph v-if="loading===false" :spectrum="spectrum"></DetailedGraph>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import DetailedGraph from "@/components/DetailedGraph.vue";
import { getDSeries } from "@/util/SeriesD";
import { Loading } from "element-ui";
import { Spectrum, ISpecValue } from "@/util/ColorSpace";
import range from "lodash/range";
import { downloadJson } from "@/util";

@Component({
  components: {
    DetailedGraph
  }
})
export default class MakerDSeries extends Vue {
  private temp: number = 5000;
  private loading: boolean = true;
  private spectrum: Spectrum = {} as Spectrum;
  private mounted() {
    this.computeDSeries();
  }
  private computeDSeries() {
    const spec = getDSeries(this.temp);
    if (spec === null) {
      this.loading = true;
      return;
    }
    this.spectrum = spec;
    this.loading = false;
  }
  private generateAll() {
    const tempRange = range(4000, 15000, 500);
    const spec = tempRange.map(val => getDSeries(val));
    downloadJson(JSON.stringify(spec), "DSeriesAll");
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
div {
  text-align: left;
}
</style>
