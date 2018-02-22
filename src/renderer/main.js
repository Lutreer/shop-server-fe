import Vue from "vue";
import Axios from "axios";
import VueAxios from "vue-axios";
import ElementUI from "element-ui";
import "element-ui/lib/theme-default/index.css";
import "../../node_modules/ag-grid/dist/styles/ag-grid.css";
import "../../node_modules/ag-grid/dist/styles/ag-theme-fresh.css";

// need if you use ag-grid enterprise features
import "ag-grid-enterprise";


import "./assets/css/index.scss";

import App from "./App";
import router from "./router";
import store from "./store";
import Utils from './assets/js';

Vue.use(VueAxios, Axios);
Vue.use(ElementUI);

router.beforeEach((to, from, next) => {

  let token = localStorage.getItem('token') || '';

  //配置接口信息
  // Axios.defaults.baseURL = 'https://www.thankni.com/admin/';
  Axios.defaults.baseURL = process.env.NODE_ENV !== 'development' ? 'https://www.thankni.com/admin/' : 'http://127.0.0.1:8360/admin/';
  Axios.defaults.headers.common['X-Thanknishop-Token'] = token;

  if (!token && to.name !== 'login') {
    next({
      path: '/login',
      query: {redirect: to.fullPath}
    })
  } else {
    next()
  }
});

if (!process.env.IS_WEB) {
  Vue.use(require('vue-electron'))
}
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
})
