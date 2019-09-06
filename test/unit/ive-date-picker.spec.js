import { expect } from 'chai';
import { mount } from '@vue/test-utils';
import moment from 'moment';
import '../utils';
import iveDatePicker from '../../src/components/ive-date-picker.vue';

describe('ive-date-picker.vue', () => {
  it('renders the correct markup & check props', () => {
    const wrapper = mount(iveDatePicker, {
      propsData: {
        value: new Date(),
        placeholder: '请选择',
        disabled: true,
      },
    });
    expect(wrapper.classes()).to.include('ivu-date-picker');
    const input = wrapper.find('input[type="text"]');
    expect(input.classes()).to.include('ivu-input');
    const {
      placeholder,
      disabled,
    } = input.attributes();
    expect(wrapper.props('type')).to.equal('date');
    expect(input.element.value).to.equal(moment(new Date()).format('YYYY-MM-DD'));
    expect(placeholder).to.equal('请选择');
    expect(disabled).to.equal('disabled');
  });
  it('check disabledDate', () => {
    const wrapper = mount(iveDatePicker, {
      propsData: {
        disabledDate: new Date(),
      },
    });
    const { disabledDate } = wrapper.vm.options;
    expect(disabledDate(new Date())).to.equal(false);
    expect(disabledDate(new Date() - 24 * 60 * 60 * 1000)).to.equal(true);
    wrapper.setProps({ disabledDate() {} });
    expect(wrapper.vm.options.disabledDate).to.equal(wrapper.vm.disabledDate);
    wrapper.setProps({ disabledDate: null });
    expect(wrapper.vm.options.disabledDate(new Date())).to.equal(undefined);
  });
  it('formatValue', () => {
    const wrapper = mount(iveDatePicker, {
      propsData: {
        value: '2019年8月15',
      },
    });
    const inputEle = wrapper.find('input[type="text"]');
    expect(inputEle.element.value).to.equal('');
    wrapper.setProps({ value: null });
    expect(inputEle.element.value).to.equal('');
    wrapper.setProps({ value: '2019-8-15' });
    expect(moment(inputEle.element.value).format('YYYY-MM-DD')).to.equal('2019-08-15');
  });
  it('emit input event', () => {
    const wrapper = mount(iveDatePicker, {
      propsData: {
        value: '2019-8-15',
        disabledDate: null,
      },
    });
    wrapper.find('span.ivu-date-picker-cells-cell-selected + span').trigger('click');
    const emitted = wrapper.emitted();
    expect(moment(emitted.input[0][0]).format('YYYY-MM-DD')).to.deep.equal('2019-08-16');
  });
});
