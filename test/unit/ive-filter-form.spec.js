import { expect } from 'chai';
import { mount } from '@vue/test-utils';
import { formConfig } from '../utils';
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
    expect(wrapper.findAll('.ivu-form-item').length).to.equal(wrapper.props('formConfig').length);
    console.log(formConfig);
  });
});
