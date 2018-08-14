<template>
  <div>
    
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import SpecGraph from "../components/SpecGraph.vue";
import ColorBlock from "../components/ColorBlock.vue";
import { numers2spec, ISpecValue } from "../util";

@Component({
  components: {
    SpecGraph,
    ColorBlock
  }
})
export default class DetailedGraph extends Vue {
  @Prop() private spectrumValues!: number[];
  private rgb:RGB=new RGB(0,0,0);
  private get spectrum(){
    const spec = numers2spec(this.spectrumValues);

    const xyz = utilLib.spec2xyz(spectrum);
    const xyzNormed = xyz.norm();
    this.rgb = xyzNormed.toRGB();
    return spec;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
