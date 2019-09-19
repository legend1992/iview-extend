import Vue from 'vue';
import iView from 'iview';
import moment from 'moment';
import _ from 'lodash';
import components from '../src/components/index';
import iveModal from '../src/plugins/ive-modal';

Vue.use(iView);
// 注册组件
Object.keys(components).forEach((name) => {
  Vue.component(name, components[name]);
  // 安装插件
  Vue.prototype.$iveModal = iveModal(Vue);
});

export const oneDay = 24 * 60 * 60 * 1000;
export function momentFormatYYYYMMDD(date) {
  return moment(new Date(date)).format('YYYY-MM-DD');
}

export const tagNameList = [
  'ive-input',
  'ive-checkbox-group',
  'ive-date-picker',
  'ive-date-range-picker',
  'ive-input-number',
  'ive-radio',
  'ive-select',
  'ive-textarea',
  'ive-upload',
];
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
export const hideConfig = formConfig.map((config) => {
  const prop = `${config.prop}hide`;
  const label = `${config.label}hide`;
  return _.cloneDeep({
    ...config,
    prop,
    label,
  });
});
export function formatFormConfig(config, formatFn) {
  return config.map((item) => {
    item.itemConfig = formatFn(item.label, item.itemConfig);
    return item;
  });
}
