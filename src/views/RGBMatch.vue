<template>
  <div style="margin-left:2em;">
    <div style="display:flex;">
      <div :style="`backgroundColor:rgb(${numR*255},${numG*255},${numB*255})`" style="height:8em;width:8em;background-color:#eee;margin-right:2em;"></div>
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
      <div style="display:flex; flex-direction:column;justify-content:space-around;">
        <div style="display:flex;">
          <div :style="`backgroundColor:rgb(${matchRGB.r*255},${matchRGB.g*255},${matchRGB.b*255})`" style="height:8em;width:8em;background-color:#eee;margin-right:2em;"></div>
          <section>
            <div class="color-input">
              <span>R: </span>
              <el-input-number :disabled="true" :value="matchRGB.r" :precision="2" :step="0.05" :min="0" :max="1"></el-input-number>
            </div>
            <div class="color-input">
              <span> G: </span>
              <el-input-number :disabled="true" :value="matchRGB.g" :precision="2" :step="0.05" :min="0" :max="1"></el-input-number>
            </div>
            <div class="color-input">
              <span> B: </span>
              <el-input-number :disabled="true" :value="matchRGB.b" :precision="2" :step="0.05" :min="0" :max="1"></el-input-number>
            </div>
          </section>
        </div>
      </div>
      <SpecGraph :spec="bestMatch" :id="'rgb-match'"></SpecGraph>
    </section>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import SpecGraph from "../components/SpecGraph.vue";
import * as api from "../util/api";
import * as util from "../util";
import { TruncateOptions } from "lodash";

@Component({
  components: {
    SpecGraph
  }
})
export default class RGBMatch extends Vue {
  private numR: number = 0.65;
  private numG: number = 0.20;
  private numB: number = 0.35;
  private bestMatch: util.ISpecValue = {} as util.ISpecValue;
  private specReady: boolean = false;
  private matchRGB: util.Irgb = {} as util.Irgb;

  private async findMatch() {
    const result = await api.findRGBMatch({
      r: this.numR,
      g: this.numG,
      b: this.numB
    });
    this.bestMatch = result;
    this.specReady = true;
    const scale =
      util.norm3([this.numR, this.numG, this.numB]) /
      util.norm3(result.rgb_d65);
    this.matchRGB = {
      r: result.rgb_d65[0] * scale,
      g: result.rgb_d65[1] * scale,
      b: result.rgb_d65[2] * scale
    };
    console.log(this.matchRGB);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.color-input {
  margin-bottom: 0.5em;
}
</style>
