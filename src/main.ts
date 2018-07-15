import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "./assets/reset.css";
import router from "./router";

import locale from "element-ui/lib/locale/lang/en";


Vue.config.productionTip = false;

Vue.use(ElementUI, { locale });
new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
