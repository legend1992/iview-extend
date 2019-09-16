import { expect } from 'chai';
import { mount } from '@vue/test-utils';
import '../utils';
import iveTextarea from '../../src/components/ive-textarea.vue';

describe('ive-textarea.vue', () => {
  it('renders the correct markup', () => {
    const wrapper = mount(iveTextarea, {
      propsData: {
        value: '值',
        placeholder: '请输入文字',
        maxlength: 100,
        disabled: true,
      },
    });
    expect(wrapper.classes()).to.include('ivu-input-wrapper');
    const textarea = wrapper.find('textarea');
    expect(textarea.classes()).to.include.members(['ivu-input', 'ivu-input-disabled']);
    const {
      placeholder,
      maxlength,
      disabled,
    } = textarea.attributes();
    expect(textarea.element.value).to.equal('值');
    expect(placeholder).to.equal('请输入文字');
    expect(maxlength).to.equal('100');
    expect(disabled).to.equal('disabled');
  });
  it('check props: autosize', async () => {
    const wrapper = mount(iveTextarea, {
      attachToDocument: true,
    });
    await wrapper.vm.$nextTick();
    const style = getComputedStyle(wrapper.find('textarea').element);
    const { maxHeight, minHeight } = style;
    const lineheight = 15;
    expect(maxHeight).to.equal(`${lineheight * 5}px`);
    expect(minHeight).to.equal(`${lineheight * 2}px`);
  });
  it('check event: on-blur', () => {
    const wrapper = mount(iveTextarea, {
      propsData: {
        value: ' 值 ',
      },
    });
    wrapper.find('textarea').trigger('blur');
    const emitted = wrapper.emitted();
    expect(emitted['on-blur'][0][0]).to.equal(' 值 ');
    expect(emitted.input[0][0]).to.equal('值');
  });
});
