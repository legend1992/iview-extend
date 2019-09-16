import Vue from 'vue';
import iView from 'iview';
import moment from 'moment';
import components from '../src/components/index';
import iveModal from '../src/plugins/ive-modal';

// 注册组件
Object.keys(components).forEach((name) => {
  Vue.component(name, components[name]);
  // 安装插件
  Vue.prototype.$iveModal = iveModal(Vue);
});

Vue.use(iView);
export const oneDay = 24 * 60 * 60 * 1000;
export function momentFormatYYYYMMDD(date) {
  return moment(new Date(date)).format('YYYY-MM-DD');
}

export const tagNameList = ['ive-checkbox-group', 'ive-date-picker', 'ive-date-range-picker', 'ive-input-number', 'ive-radio', 'ive-select', 'ive-textarea', 'ive-upload'];
function createFormConfig() {
  return tagNameList.reduce((acc, tagName, index) => {
    const newIndex = index + 2;
    acc.push({
      prop: `prop${newIndex}`,
      label: `label${newIndex}`,
      itemConfig: {
        tagName,
      },
    });
    return acc;
  }, [
    {
      prop: 'prop1',
      label: 'label1',
    },
  ]);
}
export const formConfig = createFormConfig();
