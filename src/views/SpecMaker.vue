<template>
  <div>
    <el-input type="textarea" :rows="20" placeholder="Please input" v-model="userInput">
    </el-input>
    <el-button @click="parseInput">Parse</el-button>
    <div>
      <SpecGraph v-if="parsedSpec!=={}" :id="'parsed'" :spec="parsedSpec"></SpecGraph>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { numers2spec, ISpecValue } from "../util";
import SpecGraph from "../components/SpecGraph.vue";

@Component({
  components: {
    SpecGraph
  }
})
export default class SpecMaker extends Vue {
  private userInput: string = "";
  private parsedInput: number[] = [];
  private parsedSpec: ISpecValue = {} as ISpecValue;
  private parseInput() {
    const values = this.userInput
      .split(/[\s,;\n]/)
      .filter(item => item)
      .map(item => parseFloat(item));
    const spectrum = numers2spec(values);
    console.log(spectrum);
    this.parsedSpec = spectrum;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
