import { expect } from 'chai';
import { mount } from '@vue/test-utils';
import { formConfig, tagNameList } from '../utils';
import iveFilterForm from '../../src/components/ive-filter-form';
import iveTooltip from '../../src/components/ive-icon-tooltip.vue';

describe('ive-filter-form.vue', () => {
  it('renders the correct markup & check props', () => {
    const wrapper = mount(iveFilterForm, {
      propsData: {
        formConfig,
      },
    });
    expect(wrapper.classes()).to.include.members(['ivu-form', 'ivu-form-inline', 'ive-filter-form']);
    // formConfig length
    const formItems = wrapper.findAll('.ivu-form-item');
    expect(formItems.length).to.equal(wrapper.props('formConfig').length);
    // formConfig tagName
    tagNameList.unshift('ive-input');
    Array.from({ length: formItems.length }).forEach((formItem, index) => {
      expect(formItems.at(index).find('.ivu-form-item-content > *').name()).to.equal(tagNameList[index]);
    });
    // model
    const { model, formConfig: config } = wrapper.vm;
    expect(Object.keys(model).length).to.equal(config.length);
    config.forEach((item) => {
      let itemValue = item.itemConfig && item.itemConfig.value;
      if (item.itemConfig && item.itemConfig.tagName) {
        if (item.itemConfig.tagName === 'ive-date-range-picker') {
          itemValue = [];
        }
      }
      expect(model[item.prop]).to.deep.equal(itemValue);
    });
  });
  it('emit event: handleQuery', () => {
    const wrapper = mount(iveFilterForm, {
      propsData: {
        formConfig,
      },
    });
    const buttons = wrapper.findAll('.button-wrapper button');
    buttons.at(0).trigger('click');
    buttons.at(1).trigger('click');
    const emitted = wrapper.emitted();
    expect(emitted.query.length).to.equal(2);
    const { model } = wrapper.vm;
    expect(emitted.query[0][0]).to.deep.equal(model);
    expect(emitted.query[1][0]).to.deep.equal(model);
  });
  it('check props: formConfig - tip', () => {
    const wrapper = mount(iveFilterForm, {
      propsData: {
        formConfig: [{
          prop: 'prop',
          label: 'label',
          tip: '提示语',
        }, {
          prop: 'prop2',
          label: 'label2',
        }],
      },
    });
    const formItems = wrapper.findAll('.ivu-form-item');
    expect(formItems.at(0).find(iveTooltip).exists()).to.equal(true);
    expect(formItems.at(1).find(iveTooltip).exists()).to.equal(false);
  });
});
