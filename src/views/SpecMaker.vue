<template>
  <el-tabs tab-position="left" style="flex-grow:2;">
    <el-tab-pane label="Mannual Input">
      <MakerMannual></MakerMannual>
    </el-tab-pane>
    <el-tab-pane label="Planckian Locus">
      <MakerPlanck></MakerPlanck>
    </el-tab-pane>
    <el-tab-pane label="D Series">
      <MakerDSeries></MakerDSeries>
    </el-tab-pane>
  </el-tabs>

</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import MakerMannual from "../components/MakerMannual.vue";
import MakerPlanck from "../components/MakerPlanck.vue";
import MakerDSeries from "../components/MakerDSeries.vue";

@Component({
  components: {
    MakerMannual,
    MakerPlanck,
    MakerDSeries
  }
})
export default class SpecMaker extends Vue {}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.el-tabs {
  margin: 0em 1em 0 1em;
}
.el-tabs .el-tab-pane {
  margin-top: 0.5em;
}
</style>
