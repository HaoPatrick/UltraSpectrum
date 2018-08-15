<template>
    <div>
        <div>
            <span>Color Temperature</span>
            <el-input-number @change="computeDSeries" v-model="temp" :step="500" :min="4000"></el-input-number>
        </div>
        <DetailedGraph v-if="loading===false" :spectrum="spectrum"></DetailedGraph>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import DetailedGraph from "@/components/DetailedGraph.vue";
import { ISpecValue } from "@/util";
import { getDSeries } from "@/util/SeriesD";
import { Loading } from "element-ui";

@Component({
  components: {
    DetailedGraph
  }
})
export default class MakerDSeries extends Vue {
  private temp: number = 5000;
  private loading: boolean = true;
  private spectrum: ISpecValue = {} as ISpecValue;
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
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
div {
  text-align: left;
}
</style>
