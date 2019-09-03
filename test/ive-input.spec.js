import { expect } from 'chai';
import { shallowMount } from '@vue/test-utils';
import iveInput from '../src/components/ive-input.vue';

describe('iveInput.vue', () => {
  it('renders the correct markup', () => {
    const wrapper = shallowMount(iveInput);
    expect(wrapper.contains('input')).to.equal(true);
    expect(wrapper.find('input').props('placeholder')).to.equal('请输入内容');
  });
});
