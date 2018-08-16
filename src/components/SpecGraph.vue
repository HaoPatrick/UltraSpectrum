<template>
  <div>
    <div :id="`echart-${id}`" style="width:600px;height:400px;"> </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import * as echarts from "echarts";
import range from "lodash/range";
import { Spectrum } from "../util/ColorSpace";

@Component
export default class SpecGraph extends Vue {
  @Prop() private spec!: Spectrum;
  private id: string = Math.random()
    .toString(36)
    .substr(2, 7);
  private chart!: echarts.ECharts;
  private mounted() {
    this.chart = echarts.init(document.getElementById(
      `echart-${this.id}`
    ) as HTMLDivElement);
    this.chart.setOption(this.generateOptions(this.spec));
  }
  @Watch("spec")
  private onSpecChanged(newSpec: Spectrum) {
    const option = this.generateOptions(newSpec);
    this.chart.setOption(option);
  }
  private generateOptions(newSpec: Spectrum) {
    const option = {
      title: {
        text: newSpec.name
      },
      tooltip: {
        trigger: "axis"
      },
      legend: {
        data: ["value"]
      },
      xAxis: {
        type: "category",
        name: "nm",
        data: range(newSpec.start, newSpec.end, newSpec.resolution)
      },
      yAxis: {
        type: "value"
      },
      series: [
        {
          type: "line",
          data: newSpec.data,
          showSymbol: false
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
