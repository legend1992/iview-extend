import Vue from 'vue';
import { createLocalVue } from '@vue/test-utils';
import iView from 'iview';
import moment from 'moment';
import _ from 'lodash';
import iveInput from '../src/components/ive-input.vue';
import iveCheckboxGroup from '../src/components/ive-checkbox-group.vue';
import iveDatePicker from '../src/components/ive-date-picker.vue';
import iveDateRangePicker from '../src/components/ive-date-range-picker.vue';
import iveInputNumber from '../src/components/ive-input-number.vue';
import iveRadio from '../src/components/ive-radio.vue';
import iveSelect from '../src/components/ive-select.vue';
import iveTextarea from '../src/components/ive-textarea.vue';
import iveUpload from '../src/components/ive-upload.vue';
import iveToolTip from '../src/components/ive-icon-tooltip.vue';
import iveSpin from '../src/components/ive-spin';

export const components = {
  'ive-input': iveInput,
  'ive-checkbox-group': iveCheckboxGroup,
  'ive-date-picker': iveDatePicker,
  'ive-date-range-picker': iveDateRangePicker,
  'ive-input-number': iveInputNumber,
  'ive-radio': iveRadio,
  'ive-select': iveSelect,
  'ive-textarea': iveTextarea,
  'ive-upload': iveUpload,
  'ive-icon-tooltip': iveToolTip,
  'ive-spin': iveSpin,
};
export const localVue = createLocalVue();
Object.keys(components).forEach((name) => {
  localVue.component(name, components[name]);
});
Vue.use(iView);

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
  }, []);
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
