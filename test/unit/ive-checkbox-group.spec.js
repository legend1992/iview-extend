import { expect } from 'chai';
import { mount } from '@vue/test-utils';
import '../utils';
import iveCheckboxGroup from '../../src/components/ive-checkbox-group.vue';

describe('ive-checkbox-group.vue', () => {
  it('renders the correct markup when options.length === 0', () => {
    const wrapper = mount(iveCheckboxGroup);
    expect(wrapper.classes()).to.include('ive-no-data');
    expect(wrapper.text()).to.equal('无可选数据');
    wrapper.setProps({ noDataMessage: 'no-data' });
    expect(wrapper.text()).to.equal('no-data');
  });
  it('renders the correct markup when options.length > 0', () => {
    const wrapper = mount(iveCheckboxGroup, {
      propsData: {
        value: [1, 2],
        options: [0, 1, 2],
      },
    });
    expect(wrapper.classes()).to.include('ivu-checkbox-group');
    const checkboxGroupItems = wrapper.findAll('label.ivu-checkbox-group-item');
    expect(checkboxGroupItems.length).to.equal(3);
    expect(checkboxGroupItems.at(0).find('.ivu-checkbox').classes()).to.not.include('ivu-checkbox-checked');
    expect(checkboxGroupItems.at(1).find('.ivu-checkbox').classes()).to.include('ivu-checkbox-checked');
    expect(checkboxGroupItems.at(2).find('.ivu-checkbox').classes()).to.include('ivu-checkbox-checked');
  });
  it('prop parseIntKey & options is Object', () => {
    const wrapper = mount(iveCheckboxGroup, {
      propsData: {
        value: [0, 1],
        parseIntKey: true,
        options: {
          0: '选项1',
          1: '选项2',
          2: '选项3',
        },
      },
    });
    const checkboxGroupItems = wrapper.findAll('label.ivu-checkbox-group-item');
    expect(checkboxGroupItems.length).to.equal(3);
    expect(checkboxGroupItems.at(0).text()).to.equal('选项1');
    expect(checkboxGroupItems.at(0).find('.ivu-checkbox').classes()).to.include('ivu-checkbox-checked');
    expect(checkboxGroupItems.at(1).find('.ivu-checkbox').classes()).to.include('ivu-checkbox-checked');
    expect(checkboxGroupItems.at(2).find('.ivu-checkbox').classes()).to.not.include('ivu-checkbox-checked');
  });
  it('emit input event', () => {
    const wrapper = mount(iveCheckboxGroup, {
      propsData: {
        value: [1, 2],
        options: [0, 1, 2],
      },
    });
    const checkboxGroupItems = wrapper.findAll('label.ivu-checkbox-group-item');
    checkboxGroupItems.at(0).find('input[type="checkbox"]').trigger('change');
    const emitted = wrapper.emitted();
    expect(emitted.input[0][0]).to.deep.equal([1, 2]);
  });
});
