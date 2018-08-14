<template>
  <div style="display:flex;">
    <SpecGraph :spec="spectrum"></SpecGraph>
    <div style="display:flex;flex-direction:column;">
      <ColorBlock :color="rgb"></ColorBlock>
      <el-button @click="download">Download Spectrum</el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import SpecGraph from "../components/SpecGraph.vue";
import ColorBlock from "../components/ColorBlock.vue";
import { numers2spec, ISpecValue } from "../util";
import { RGB } from "../util/ColorSpace";
import * as utilLib from "../util";

@Component({
  components: {
    SpecGraph,
    ColorBlock
  }
})
export default class DetailedGraph extends Vue {
  @Prop() private spectrum!: ISpecValue;
  private get rgb() {
    const xyz = utilLib.spec2xyz(this.spectrum);
    const xyzNormed = xyz.norm();
    return xyzNormed.toRGB();
  }
  private download() {
    const element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:application/json;charset=utf-8," +
        encodeURIComponent(JSON.stringify(this.spectrum))
    );
    element.setAttribute("download", `${this.spectrum.name}.json`);
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
