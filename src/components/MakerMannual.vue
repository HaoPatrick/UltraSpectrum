<template>
  <div>
    <div>
      <el-input style="width:100% !important;" type="textarea" :rows="10" placeholder="Please input" v-model="userInput">
      </el-input>
    </div>
    <el-button @click="parseInput">Parse</el-button>
    <DetailedGraph v-if="loading===false" :spectrum="parsedSpec"></DetailedGraph>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { ISpecValue } from "../util";
import * as utilLib from "../util";
import { RGB, Spectrum } from "@/util/ColorSpace";
import DetailedGraph from "@/components/DetailedGraph.vue";

@Component({
  components: {
    DetailedGraph
  }
})
export default class MakerMannual extends Vue {
  private userInput: string = "";
  private parsedInput: number[] = [];
  private parsedSpec: Spectrum = {} as Spectrum;
  private loading: boolean = true;
  private rgb: RGB = new RGB(0, 0, 0);
  private parseInput() {
    const values = this.userInput
      .split(/[\s,;\n]/)
      .filter(item => item)
      .map(item => parseFloat(item));
    const spectrum = Spectrum.makeFromValue(values, "UserInput");
    this.parsedSpec = spectrum;
    this.loading = false;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
