<template>
  <div class="container">
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
import { RGB } from "../util/ColorSpace";
import { Spectrum } from "../util/ColorSpace";

@Component({
  components: {
    SpecGraph,
    ColorBlock
  }
})
export default class DetailedGraph extends Vue {
  @Prop() private spectrum!: Spectrum;
  private get rgb() {
    const xyz = this.spectrum.toXYZ();
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
.container {
  display: flex;
  border: 2px solid rgb(255, 208, 75);
  padding: 1em 1em 1em 1em;
  background-color: rgba(255, 255, 255, 0.2);
}
</style>
