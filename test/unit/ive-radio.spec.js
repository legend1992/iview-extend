import { expect } from 'chai';
import { mount } from '@vue/test-utils';
import '../utils';
import iveRadio from '../../src/components/ive-radio.vue';

describe('ive-radio.vue', () => {
  it('renders the correct markup when options.length === 0', () => {
    const wrapper = mount(iveRadio);
    expect(wrapper.classes()).to.include('ive-no-data');
    expect(wrapper.text()).to.equal('无可选数据');
    wrapper.setProps({ noDataMessage: 'no-data' });
    expect(wrapper.text()).to.equal('no-data');
  });
  it('renders the correct markup when options.length > 0', () => {
    const wrapper = mount(iveRadio, {
      propsData: {
        value: 1,
        options: [0, 1, 2],
      },
    });
    expect(wrapper.vm.optionsLength).to.equal(3);
    expect(wrapper.classes()).to.include('ivu-radio-group');
    const radioGroupItems = wrapper.findAll('label.ivu-radio-group-item');
    expect(radioGroupItems.length).to.equal(3);
    expect(radioGroupItems.at(0).find('.ivu-radio').classes()).to.not.include('ivu-radio-checked');
    expect(radioGroupItems.at(1).find('.ivu-radio').classes()).to.include('ivu-radio-checked');
    expect(radioGroupItems.at(2).find('.ivu-radio').classes()).to.not.include('ivu-radio-checked');
    wrapper.setProps({ disabled: true });
    const disabledRadioItems = wrapper.findAll('.ivu-radio.ivu-radio-disabled');
    expect(disabledRadioItems.length).to.equal(3);
  });
  it('check props: parseIntKey & options is Object', async () => {
    const wrapper = mount(iveRadio, {
      propsData: {
        value: 1,
        options: {
          0: '选项1',
          1: '选项2',
          2: '选项3',
          3: '选项4',
        },
      },
    });
    expect(wrapper.vm.optionsLength).to.equal(4);
    let radioGroupItems = wrapper.findAll('.ivu-radio-checked');
    expect(radioGroupItems.length).to.equal(0);
    wrapper.setProps({
      parseIntKey: true,
      value: 2,
    });
    await wrapper.vm.$nextTick();
    radioGroupItems = wrapper.findAll('.ivu-radio-checked');
    expect(radioGroupItems.length).to.equal(1);
  });
  it('check event: emit input', () => {
    const wrapper = mount(iveRadio, {
      propsData: {
        options: [0, 1, 2],
      },
    });
    const radioGroupItems = wrapper.findAll('label.ivu-radio-group-item');
    radioGroupItems.at(2).find('input[type="radio"]').trigger('change');
    const emitted = wrapper.emitted();
    expect(emitted.input[0][0]).to.equal(2);
  });
});
