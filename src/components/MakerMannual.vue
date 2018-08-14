<template>
  <div>
    <div>
      <el-input style="width:100% !important;" type="textarea" :rows="10" placeholder="Please input" v-model="userInput">
      </el-input>
    </div>
    <el-button @click="parseInput">Parse</el-button>
    <el-button @click="downloadSpec">Download</el-button>
    <div v-if="loading===false" style="display:flex;">
      <SpecGraph :id="'parsed'" :spec="parsedSpec"></SpecGraph>
      <ColorBlock :color="rgb"></ColorBlock>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { numers2spec, ISpecValue } from "../util";
import * as utilLib from "../util";
import SpecGraph from "../components/SpecGraph.vue";
import { RGB } from "@/util/ColorSpace";
import ColorBlock from "../components/ColorBlock.vue";

@Component({
  components: {
    SpecGraph,
    ColorBlock
  }
})
export default class MakerMannual extends Vue {
  private userInput: string = "";
  private parsedInput: number[] = [];
  private parsedSpec: ISpecValue = {} as ISpecValue;
  private loading: boolean = true;
  private rgb: RGB = new RGB(0, 0, 0);
  private parseInput() {
    const values = this.userInput
      .split(/[\s,;\n]/)
      .filter(item => item)
      .map(item => parseFloat(item));
    const spectrum = numers2spec(values);
    this.parsedSpec = spectrum;

    const xyz = utilLib.spec2xyz(spectrum);
    const xyzNormed = xyz.norm();
    this.rgb = xyzNormed.toRGB();
    this.loading = false;
  }
  private downloadSpec() {
    if (this.loading === true) {
      this.parseInput();
    }
    const element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:application/json;charset=utf-8," +
        encodeURIComponent(JSON.stringify(this.parsedSpec))
    );
    element.setAttribute("download", `${this.parsedSpec.name}.json`);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
