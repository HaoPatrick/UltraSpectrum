<template>
  <div style="display:flex;" class="block-container">
    <div style="display:block">
      <div class="block" :style="`backgroundColor:rgb(${rgb.r*255},${rgb.g*255},${rgb.b*255})`">
      </div>
    </div>
    <div class="block-text">
      <p :style="`color: ${validRGB?'inherit':'#da3f3f'};`">
        rgb:
        <el-tag type="info" size="small">{{rgb.r|round3}}</el-tag>
        <el-tag type="info" size="small">{{rgb.g|round3}}</el-tag>
        <el-tag type="info" size="small">{{rgb.b|round3}}</el-tag>
      </p>
      <p :style="`color: ${validRGB?'inherit':'#da3f3f'};`">
        rgb:
        <el-tag type="info" size="small">{{rgb.r*255|round}}</el-tag>
        <el-tag type="info" size="small">{{rgb.g*255|round}}</el-tag>
        <el-tag type="info" size="small">{{rgb.b*255|round}}</el-tag>
      </p>
      <p>
        XYZ:
        <el-tag type="info" size="small">{{xyz.x.toExponential(3)}}</el-tag>
        <el-tag type="info" size="small">{{xyz.y.toExponential(3)}}</el-tag>
        <el-tag type="info" size="small">{{xyz.z.toExponential(3)}}</el-tag>
      </p>
      <p>
        xyz:
        <el-tag type="info" size="small">{{xyz.norm().x|round3}}</el-tag>
        <el-tag type="info" size="small">{{xyz.norm().y|round3}}</el-tag>
        <el-tag type="info" size="small">{{xyz.norm().z|round3}}</el-tag>
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { RGB, XYZ } from "../util/ColorSpace";
import { colorMatch } from "@/util/ColorData";

@Component({
  filters: {
    round3(val: number) {
      return Math.round(val * 1000) / 1000;
    },
    round(val: number) {
      return Math.round(val);
    }
  }
})
export default class ColorBlock extends Vue {
  @Prop() private color!: RGB | XYZ;
  private rgb = this.color instanceof RGB ? this.color : this.color.toRGB();
  private xyz = this.color instanceof XYZ ? this.color : this.color.toXYZ();
  private XYz: XYZ = new XYZ(0, 0, 0);
  private get validRGB() {
    return RGB.isValid(this.rgb);
  }
  @Watch("color")
  private onColorChanged(newColor: RGB | XYZ) {
    this.rgb = this.color instanceof RGB ? this.color : this.color.toRGB();
    this.xyz = this.color instanceof XYZ ? this.color : this.color.toXYZ();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.block-container {
  padding: 0.5em 1em 0.5em 1em;
  text-align: left;
}
.block {
  min-width: 7em;
  display: block;
  position: relative;
  padding-bottom: 100%;
}
.el-tag {
  margin-right: 0.3em;
  min-width: 5em;
}
.block-text {
  margin-left: 1em;
}
.block-text p {
  margin-bottom: 0.3em;
}
</style>
