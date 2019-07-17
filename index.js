import components from './src/components/index';

export default {
  components,
  install(Vue) {
    Object.keys(this.components).forEach((name) => {
      Vue.component(name, this.components[name]);
    });
  }
}
