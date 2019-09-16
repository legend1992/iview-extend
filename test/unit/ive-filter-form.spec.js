import { expect } from 'chai';
import { mount } from '@vue/test-utils';
import { formConfig, tagNameList } from '../utils';
import iveFilterForm from '../../src/components/ive-filter-form';

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
  });
});
