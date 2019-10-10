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

function convertImgToBase64(url, width, height) {
  return new Promise((resolve) => {
    let canvas = document.createElement('CANVAS');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      canvas.width = width || img.width;
      canvas.height = height || img.height;
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL('image/png'));
      canvas = null;
    };
    img.onerror = (e) => {
      throw (e);
    };
    img.src = url;
  });
}

function base64toBlob(b64Data, type) {
  const byteCharacters = atob(b64Data.substring(b64Data.indexOf(',') + 1));
  const byteArrays = [];
  const sliceSize = 512;
  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);
    const byteNumbers = new Array(slice.length);
    /* eslint-disable no-plusplus */
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }
  return new Blob(byteArrays, { type });
}

export async function createImage({
  name = 'testImage.png',
  width,
  height,
  url = 'https://tse3-mm.cn.bing.net/th?id=OIP.pk-ZGQhPQ8un_8vHS7G-NgHaE8&w=271&h=179&c=7&o=5&dpr=1.5&pid=1.7',
} = {}) {
  const dataURL = await convertImgToBase64(url, width, height);
  const image = base64toBlob(dataURL, 'image/png');
  image.name = name;
  return image;
}
