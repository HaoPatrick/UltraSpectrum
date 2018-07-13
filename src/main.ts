import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "./assets/reset.css";
import router from "./router";


Vue.config.productionTip = false;

Vue.use(ElementUI);
new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
