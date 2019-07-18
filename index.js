import components from './src/components/index';
import iveModal from './src/plugins/ive-modal';

export default {
  components,
  install(Vue) {
    // 注册组件
    Object.keys(this.components).forEach((name) => {
      Vue.component(name, this.components[name]);
    });

    // 安装插件
    Vue.prototype.$iveModal = iveModal;
  }
}
