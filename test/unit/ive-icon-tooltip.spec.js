import { expect } from 'chai';
import { mount } from '@vue/test-utils';
import '../utils';
import iveIconTooltip from '../../src/components/ive-icon-tooltip.vue';

describe('ive-icon-tooltip.vue', () => {
  it('renders the correct markup & check props', () => {
    const wrapper = mount(iveIconTooltip, {
      propsData: {
        content: '提示语',
      },
    });
    expect(wrapper.classes()).to.include.members(['ive-tooltip', 'ivu-tooltip']);
    const inner = wrapper.find('.ivu-tooltip-inner');
    expect(inner.text()).to.equal('提示语');
  });
});
