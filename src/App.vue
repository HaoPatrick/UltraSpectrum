<template>
  <div id="app">
    <div>
      <el-select v-model="selectedSpec" placeholder='select spectrum'>
        <el-option v-for="item in lights" :key="item.name" :label="item.name" :value="item">
        </el-option>
      </el-select>
    </div>
    <div>
      <SpecGraph v-if="selectedSpec.name!==''" ref="spcComponent" :spec='selectedSpec'></SpecGraph>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import SpecGraph from "./components/SpecGraph.vue";

@Component({
  components: {
    SpecGraph
  }
})
export default class App extends Vue {
  lights = [
    require("./assets/spec_lights/d50.json"),
    require("./assets/spec_lights/illA.json")
  ];

  selectedSpec: object = this.lights[0];
  mounted() {}

  $refs!: {
    spcComponent: SpecGraph;
  };
}
</script>

<style>
#app {
  /* font-family: "Avenir", Helvetica, Arial, sans-serif; */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
