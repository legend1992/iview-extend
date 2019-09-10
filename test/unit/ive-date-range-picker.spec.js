import { expect } from 'chai';
import { mount } from '@vue/test-utils';
import { momentFormatYYYYMMDD, oneDay } from '../utils';
import iveDateRangePicker from '../../src/components/ive-date-range-picker.vue';

describe('ive-date-range-picker.vue', () => {
  it('renders the correct markup & check props', () => {
    const wrapper = mount(iveDateRangePicker, {
      propsData: {
        value: [new Date('2019-9-8'), new Date()],
        placeholder: ['请选择开始时间', '请选择结束时间'],
      },
    });
    expect(wrapper.classes()).to.include('ive-date-range');
    const datePickers = wrapper.findAll('.ivu-date-picker');
    expect(datePickers.length).to.equals(2);
    const inputStart = datePickers.at(0).find('input[type="text"]');
    const inputEnd = datePickers.at(1).find('input[type="text"]');
    const { placeholder: placeholderStart } = inputStart.attributes();
    const { placeholder: placeholderEnd } = inputEnd.attributes();
    expect(inputStart.element.value).to.equal(momentFormatYYYYMMDD('2019-09-08'));
    expect(inputEnd.element.value).to.equal(momentFormatYYYYMMDD(new Date()));
    expect(placeholderStart).to.equal('请选择开始时间');
    expect(placeholderEnd).to.equal('请选择结束时间');
  });
  it('check props: disabledDate', () => {
    const now = new Date(momentFormatYYYYMMDD(Date.now())).getTime();
    const wrapper = mount(iveDateRangePicker);
    const { disabledDate: disabledDateStart } = wrapper.vm.startOptions;
    const { disabledDate: disabledDateEnd } = wrapper.vm.endOptions;
    expect(disabledDateStart(new Date(momentFormatYYYYMMDD(now - oneDay)))).to.equal(true);
    expect(disabledDateStart(new Date())).to.equal(false);
    expect(disabledDateEnd(new Date(momentFormatYYYYMMDD(now - oneDay)))).to.equal(true);
    expect(disabledDateEnd(new Date())).to.equal(false);

    wrapper.setProps({ disabledDate: null });
    expect(disabledDateStart(new Date(momentFormatYYYYMMDD(now - oneDay)))).to.equal(false);
    expect(disabledDateEnd(new Date(momentFormatYYYYMMDD(now - oneDay)))).to.equal(false);

    const startDate = new Date(now + oneDay);
    const endDate = new Date(now + oneDay * 2);
    wrapper.setData({
      currentValue: [startDate, endDate],
    });
    expect(disabledDateStart(new Date(momentFormatYYYYMMDD(now + oneDay * 3)), 1)).to.equal(true);
    expect(disabledDateStart(new Date(momentFormatYYYYMMDD(endDate)))).to.equal(false);
    expect(disabledDateEnd(new Date(momentFormatYYYYMMDD(startDate)))).to.equal(false);
    expect(disabledDateEnd(new Date(momentFormatYYYYMMDD(now - oneDay)))).to.equal(true);
  });
  it('check event: emit input', (done) => {
    const wrapper = mount(iveDateRangePicker, {
      propsData: {
        value: ['2019-9-15', '2019-9-16'],
        disabledDate: null,
      },
    });
    wrapper.findAll('span.ivu-date-picker-cells-cell-selected + span').trigger('click');
    wrapper.vm.$nextTick(() => {
      const { input } = wrapper.emitted();
      expect(input.length).equals(2);
      expect(input[0][0][0]).to.equal('2019-09-16');
      expect(input[1][0][1]).to.equal('2019-09-17');
      done();
    });
  });
});
