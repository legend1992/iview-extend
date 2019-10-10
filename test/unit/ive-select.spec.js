import { expect } from 'chai';
import { mount } from '@vue/test-utils';
import '../utils';
import iveSelect from '../../src/components/ive-select.vue';

describe('ive-select.vue', () => {
  it('renders the correct markup when options.length === 0', () => {
    const wrapper = mount(iveSelect, {
      propsData: {
        placeholder: '请选择选项',
        disabled: true,
      },
    });
    expect(wrapper.classes()).to.include.members(['ivu-select', 'ivu-select-single', 'ivu-select-disabled']);
    expect(wrapper.find('.ivu-select-placeholder').text()).to.equal('请选择选项');
    expect(wrapper.find('.ivu-select-not-found').find('li').text()).to.equal('无匹配数据');
  });
  it('renders the correct markup when options.length > 0', async () => {
    const wrapper = mount(iveSelect, {
      propsData: {
        value: 1,
        options: [0, 1, 2],
      },
      attachToDocument: true,
    });
    expect(wrapper.findAll('.ivu-select-item').length).to.equal(3);
    expect(wrapper.find('.ivu-select-selected-value').text()).to.equal('1');
  });
  it('check props: parseIntKey & options is Object & clearable', async () => {
    const wrapper = mount(iveSelect, {
      propsData: {
        value: 1,
        options: {
          0: '选项1',
          1: '选项2',
          2: '选项3',
          3: '选项4',
        },
        clearable: true,
      },
    });
    // parseIntKey
    expect(wrapper.findAll('.ivu-select-item').length).to.equal(4);
    expect(wrapper.find('.ivu-select-selected-value').exists()).to.equal(false);
    wrapper.setProps({
      parseIntKey: true,
      value: 2,
    });
    expect(wrapper.find('.ivu-select-selected-value').text()).to.equal('选项3');
    // clearable
    wrapper.vm.$children[0].clearSingleSelect();
    expect(wrapper.find('.ivu-select-selected-value').exists()).to.equal(false);
    const emitted = wrapper.emitted();
    expect(emitted.input[0][0]).to.equal(undefined);
  });
  it('check props: multiple', async () => {
    const wrapper = mount(iveSelect, {
      propsData: {
        value: [1, 2],
        options: {
          0: '选项1',
          1: '选项2',
          2: '选项3',
        },
        multiple: true,
        parseIntKey: true,
      },
    });
    expect(wrapper.findAll('.ivu-tag-checked').length).to.equal(2);
    expect(wrapper.findAll('.ivu-tag-text').at(0).text()).to.equal('选项2');
    expect(wrapper.findAll('.ivu-tag-text').at(1).text()).to.equal('选项3');
  });
  it('check props: maxTagCount & maxTagPlaceholder & maxTagSelect', async () => {
    const wrapper = mount(iveSelect, {
      propsData: {
        value: [0, 1, 2, 3],
        options: [0, 1, 2, 3, 4],
        multiple: true,
        maxTagCount: 2,
      },
    });
    // maxTagCount
    expect(wrapper.findAll('.ivu-tag-checked').length).to.equal(3);
    expect(wrapper.findAll('.ivu-tag-text').at(0).text()).to.equal('0');
    expect(wrapper.findAll('.ivu-tag-text').at(1).text()).to.equal('1');
    expect(wrapper.findAll('.ivu-tag-text').at(2).text()).to.equal('+ 2...');
    // maxTagPlaceholder
    wrapper.setProps({
      maxTagPlaceholder: e => `more ${e}`,
    });
    expect(wrapper.findAll('.ivu-tag-text').at(2).text()).to.equal('more 2');
    // maxTagSelect
    wrapper.setProps({
      value: [0, 1, 2, 3, 4],
      maxTagSelect: 3,
    });
    const emitted = wrapper.emitted();
    await wrapper.vm.$nextTick();
    expect(emitted.input[1][0]).to.deep.equal([0, 1, 2]);
  });
  it('check props: filterable', async () => {
    const wrapper = mount(iveSelect, {
      propsData: {
        options: [0, 1, 2],
        filterable: true,
      },
    });
    wrapper.vm.$children[0].setQuery('1');
    expect(wrapper.find('.ivu-select-input').element.value).to.equal('1');
    const selectItems = wrapper.findAll('.ivu-select-item').wrappers.map(item => item.text()).join();
    const filterOptions = wrapper.vm.options.filter(option => (`${option}`).indexOf(1) > -1).join();
    expect(selectItems).to.equal(filterOptions);
  });
});
