<template>
  <div class="container">
    <SpecGraph :spec="spectrum"></SpecGraph>
    <div style="display:flex;flex-direction:column;">
      <ColorBlock :color="xyz"></ColorBlock>
      <el-button @click="download">Download Spectrum</el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import SpecGraph from "../components/SpecGraph.vue";
import ColorBlock from "../components/ColorBlock.vue";
import { RGB, XYZ } from "../util/ColorSpace";
import { Spectrum } from "../util/ColorSpace";
import { downloadJson } from "../util";

@Component({
  components: {
    SpecGraph,
    ColorBlock
  }
})
export default class DetailedGraph extends Vue {
  @Prop() private spectrum!: Spectrum;
  private get xyz(): XYZ {
    return this.spectrum.toXYZ();
  }
  private download() {
    downloadJson(JSON.stringify(this.spectrum), this.spectrum.name);
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
