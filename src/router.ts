import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import RGBMatch from "./views/RGBMatch.vue";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
    }, {
      path: "/rgb",
      name: "rgb",
      component: RGBMatch
    }
  ],
});
