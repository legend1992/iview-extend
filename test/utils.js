import Vue from 'vue';
import iView from 'iview';
import moment from 'moment';

Vue.use(iView);
export const oneDay = 24 * 60 * 60 * 1000;
export function momentFormatYYYYMMDD(date) {
  return moment(new Date(date)).format('YYYY-MM-DD');
}
