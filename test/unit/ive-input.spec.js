import { expect } from 'chai';
import { mount } from '@vue/test-utils';
import '../utils';
import iveInput from '../../src/components/ive-input.vue';

describe('iveInput.vue', () => {
  it('renders the correct markup', () => {
    const wrapper = mount(iveInput, {
      propsData: {
        value: '值',
        placeholder: '请输入文字',
        maxlength: 100,
        type: 'text',
        disabled: true,
      },
    });
    expect(wrapper.classes()).to.include('ivu-input-wrapper');
    const input = wrapper.find('input');
    expect(input.classes()).to.include('ivu-input');
    const {
      placeholder,
      maxlength,
      type,
      disabled,
    } = input.attributes();
    expect(input.element.value).to.equal('值');
    expect(placeholder).to.equal('请输入文字');
    expect(maxlength).to.equal('100');
    expect(type).to.equal('text');
    expect(disabled).to.equal('disabled');
  });
  it('on-blur formatValue', () => {
    const wrapper = mount(iveInput, {
      propsData: {
        value: ' 值 ',
      },
    });
    wrapper.vm.handleBlur();
    const emitted = wrapper.emitted();
    expect(emitted['on-blur'][0][0]).to.equal('值');
    expect(emitted.input[0][0]).to.equal('值');
  });
  it('type is letter', () => {
    const wrapper = mount(iveInput, {
      propsData: {
        type: 'letter',
        value: ' 值only letter ',
      },
    });
    wrapper.vm.handleBlur();
    const emitted = wrapper.emitted();
    expect(emitted['on-blur'][0][0]).to.equal('only letter');
    expect(emitted.input[0][0]).to.equal('only letter');
  });
});
