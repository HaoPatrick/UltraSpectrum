<template>
  <div>
    <div :id="`echart-${id}`" style="width:600px;height:400px;"> </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import * as echarts from "echarts";
import range from "lodash/range";

@Component
export default class SpecGraph extends Vue {
  @Prop() private spec!: any;
  @Prop() private id!: string;
  private chart!: echarts.ECharts;
  private mounted() {
    this.chart = echarts.init(document.getElementById(
      `echart-${this.id}`
    ) as HTMLDivElement);
    this.chart.setOption(this.generateOptions(this.spec));
  }
  @Watch("spec")
  private onSpecChanged(newSpec: any) {
    const option = this.generateOptions(newSpec);
    this.chart.setOption(option);
  }
  private generateOptions(newSpec: any) {
    const option = {
      title: {
        text: newSpec.name
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross"
        }
      },
      xAxis: {
        type: "category",
        data: range(newSpec.start_nm, newSpec.end_nm, newSpec.resolution)
      },
      yAxis: {
        type: "value"
      },
      series: [
        {
          type: "line",
          data: newSpec.data
        }
      ]
    };
    return option;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
