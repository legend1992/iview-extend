import { expect } from 'chai';
import { mount } from '@vue/test-utils';
import '../utils';
import iveSpin from '../../src/components/ive-spin';

describe('ive-spin.vue', () => {
  it('renders the correct markup & check props', () => {
    const wrapper = mount(iveSpin);
    expect(wrapper.classes()).to.include.members(['ivu-spin', 'ivu-spin-large', 'ive-spin']);
  });
});
