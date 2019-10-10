import { expect } from 'chai';
import { mount } from '@vue/test-utils';
import '../utils';
import iveInputNumber from '../../src/components/ive-input-number.vue';

describe('ive-input-number.vue', () => {
  it('renders the correct markup', () => {
    const wrapper = mount(iveInputNumber, {
      propsData: {
        value: 99,
        placeholder: '输入数字',
      },
    });
    expect(wrapper.classes()).to.include('ivu-input-number');
    const input = wrapper.find('input');
    expect(input.classes()).to.include('ivu-input-number-input');
    expect(input.element.value).to.equal('99');
    expect(input.attributes().placeholder).to.equal('输入数字');
    wrapper.setProps({
      value: NaN,
    });
    expect(input.element.value).to.equal('');
  });
  it('check props: max & min & step', async () => {
    const wrapper = mount(iveInputNumber, {
      propsData: {
        max: 100,
        min: 99,
      },
    });
    const handleUpEle = wrapper.find('.ivu-input-number-handler-up');
    const handleDownEle = wrapper.find('.ivu-input-number-handler-down');
    const input = wrapper.find('input');
    expect(input.element.value).to.equal('');
    const emitted = wrapper.emitted();
    // max
    handleUpEle.trigger('click');
    await wrapper.vm.$nextTick();
    expect(emitted.input[0][0]).to.equal(99);
    expect(input.element.value).to.equal('99');
    handleUpEle.trigger('click');
    await wrapper.vm.$nextTick();
    expect(emitted.input[1][0]).to.equal(100);
    expect(input.element.value).to.equal('100');
    expect(handleUpEle.classes()).include('ivu-input-number-handler-up-disabled');
    handleUpEle.trigger('click');
    await wrapper.vm.$nextTick();
    expect(input.element.value).to.equal('100');
    // min
    handleDownEle.trigger('click');
    await wrapper.vm.$nextTick();
    expect(emitted.input[2][0]).to.equal(99);
    expect(input.element.value).to.equal('99');
    expect(handleDownEle.classes()).include('ivu-input-number-handler-down-disabled');
    handleDownEle.trigger('click');
    await wrapper.vm.$nextTick();
    expect(input.element.value).to.equal('99');
    // step
    wrapper.setProps({
      value: 99,
      step: 0.1,
    });
    handleUpEle.trigger('click');
    await wrapper.vm.$nextTick();
    expect(emitted.input[3][0]).to.equal(99.1);
  });
  it('check props: parseIntValue', async () => {
    const wrapper = mount(iveInputNumber, {
      propsData: {
        value: 99.1,
        parseIntValue: true,
      },
    });
    const input = wrapper.find('input');
    expect(input.element.value).to.equal('99');
  });
});
