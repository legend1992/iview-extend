import { expect } from 'chai';
import { mount } from '@vue/test-utils';
import '../utils';
import ivePage from '../../src/components/ive-page.vue';

describe('ive-page.vue', () => {
  it('renders the correct markup & check props', async () => {
    const wrapper = mount(ivePage);
    expect(wrapper.classes()).to.include.members(['ive-pager', 'ivu-row-flex', 'ivu-row-flex-end']);
    expect(wrapper.find('.ivu-page').exists()).to.equal(true);
    // total
    expect(wrapper.find('.ivu-page-total').exists()).to.equal(true);
    expect(wrapper.find('.ivu-page-total').text()).to.equal('共  条');
    const total = 61;
    wrapper.setProps({
      total,
    });
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.ivu-page-total').exists()).to.equal(true);
    expect(wrapper.find('.ivu-page-total').text()).to.equal(`共 ${total} 条`);
    // pageIndex
    const pageIndex = parseInt(wrapper.find('.ivu-page-item-active a').text(), 10);
    expect(pageIndex).to.equal(wrapper.props('pageIndex'));
    // pageSize
    const totalPage = wrapper.findAll('.ivu-page-item').length;
    expect(totalPage).to.equal(Math.ceil(total / wrapper.props('pageSize')));
    // pageSizeOpts
    expect(wrapper.findAll('.ivu-select-item').length).to.equal(3);
    wrapper.find('.ivu-select-item-selected + .ivu-select-item').trigger('click');
    const emitted = wrapper.emitted();
    expect(emitted['on-page-size-change'][0][0]).to.equal(50);
    const totalPage2 = wrapper.findAll('.ivu-page-item').length;
    expect(totalPage2).to.equal(Math.ceil(total / 50));
    // showTotal
    expect(wrapper.find('.ivu-page-total').exists()).to.equal(true);
    wrapper.setProps({
      showTotal: false,
    });
    expect(wrapper.find('.ivu-page-total').exists()).to.equal(false);
    // showElevator
    expect(wrapper.find('.ivu-page-options-elevator').exists()).to.equal(true);
    wrapper.setProps({
      showElevator: false,
    });
    expect(wrapper.find('.ivu-page-options-elevator').exists()).to.equal(false);
    // showSizer
    expect(wrapper.find('.ivu-page-options-sizer').exists()).to.equal(true);
    wrapper.setProps({
      showSizer: false,
    });
    expect(wrapper.find('.ivu-page-options-sizer').exists()).to.equal(false);
  });
  it('check events: on-change', () => {
    const wrapper = mount(ivePage, {
      propsData: {
        total: 61,
      },
    });
    wrapper.find('.ivu-page-item-active + .ivu-page-item').trigger('click');
    wrapper.find('.ivu-page-next').trigger('click');
    const emitted = wrapper.emitted();
    expect(emitted['on-change'][0][0]).to.equal(2);
    expect(emitted['on-change'][1][0]).to.equal(3);
  });
});
