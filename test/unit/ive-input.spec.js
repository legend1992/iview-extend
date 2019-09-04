import { expect } from 'chai';
import { mount } from '@vue/test-utils';
import '../utils';
import iveInput from '../../src/components/ive-input.vue';

describe('iveInput.vue', () => {
  it('iveInput renders the correct markup', () => {
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
    expect(wrapper.contains('input')).to.equal(true);
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
});
