import Vue from 'vue';
import iView from 'iview';
import 'iview/dist/styles/iview.css';
import App from './App.vue';
import components from './components/index';

Vue.config.productionTip = false;

Vue.use(iView);

// 注册组件
Object.keys(components).forEach((name) => {
  Vue.component(name, components[name]);
});

new Vue({
  render: h => h(App),
}).$mount('#app');
