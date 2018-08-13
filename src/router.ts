import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import RGBMatch from './views/RGBMatch.vue';
import Maker from './views/SpecMaker.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {path: '/rgb', name: 'rgb', component: RGBMatch},
    {path: '/maker', name: 'maker', component: Maker}
  ],
});
