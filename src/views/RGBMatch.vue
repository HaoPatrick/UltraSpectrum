<template>
  <div style="margin-left:2em;">
    <div style="display:flex;">
      <ColorBlock :color="matchRGB"></ColorBlock>
      <section>
        <div class="color-input">
          <span>R: </span>
          <el-input-number v-model="numR" :precision="2" :step="0.05" :min="0" :max="1"></el-input-number>
        </div>
        <div class="color-input">
          <span> G: </span>
          <el-input-number v-model="numG" :precision="2" :step="0.05" :min="0" :max="1"></el-input-number>
        </div>
        <div class="color-input">
          <span> B: </span>
          <el-input-number v-model="numB" :precision="2" :step="0.05" :min="0" :max="1"></el-input-number>
        </div>
      </section>
      <section style="margin-left:1em;">
        <el-button @click="findMatch">Find a match</el-button>
      </section>
    </div>

    <DetailedGraph v-if="specReady" :spectrum="bestMatch"></DetailedGraph>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import * as api from "../util/api";
import { RGB, XYZ, ISpecValue, Spectrum } from "../util/ColorSpace";
import { TruncateOptions } from "lodash";
import DetailedGraph from "@/components/DetailedGraph.vue";
import ColorBlock from "../components/ColorBlock.vue";

@Component({
  components: {
    DetailedGraph,
    ColorBlock
  }
})
export default class RGBMatch extends Vue {
  private numR: number = 0.65;
  private numG: number = 0.2;
  private numB: number = 0.35;
  private bestMatch: Spectrum = {} as Spectrum;
  private specReady: boolean = false;
  private pickerColor: string = "";

  private get matchRGB() {
    return new RGB(this.numR, this.numG, this.numB);
  }

  private async findMatch() {
    const result = await api.findRGBMatch(
      new RGB(this.numR, this.numG, this.numB)
    );
    this.bestMatch = result;
    this.specReady = true;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.color-input {
  margin-bottom: 0.5em;
}
</style>
