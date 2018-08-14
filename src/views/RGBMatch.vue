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

    <section v-if="specReady" style="display:flex;margin-top:2em;">
      <ColorBlock :color="resultRGB"></ColorBlock>
      <SpecGraph :spec="bestMatch" :id="'rgb-match'"></SpecGraph>
    </section>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import SpecGraph from "../components/SpecGraph.vue";
import * as api from "../util/api";
import { RGB, XYZ } from "../util/ColorSpace";
import * as util from "../util";
import { TruncateOptions } from "lodash";
import ColorBlock from "../components/ColorBlock.vue";

@Component({
  components: {
    SpecGraph,
    ColorBlock
  }
})
export default class RGBMatch extends Vue {
  private numR: number = 0.65;
  private numG: number = 0.2;
  private numB: number = 0.35;
  private bestMatch: util.ISpecValue = {} as util.ISpecValue;
  private specReady: boolean = false;
  private pickerColor: string = "";
  private resultRGB = new RGB(0, 0, 0);

  private get matchRGB() {
    return new RGB(this.numR, this.numG, this.numB);
  }

  private async findMatch() {
    const result = await api.findRGBMatch(
      new RGB(this.numR, this.numG, this.numB)
    );
    this.bestMatch = result;
    this.specReady = true;
    const scale =
      util.norm3([this.numR, this.numG, this.numB]) /
      util.norm3(result.rgb_d65);
    this.resultRGB = new RGB(
      result.rgb_d65[0] * scale,
      result.rgb_d65[1] * scale,
      result.rgb_d65[2] * scale
    );
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.color-input {
  margin-bottom: 0.5em;
}
</style>
