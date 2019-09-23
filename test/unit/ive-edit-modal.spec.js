import { expect } from 'chai';
import { mount } from '@vue/test-utils';
import {
  formConfig,
  hideConfig,
  // tagNameList,
} from '../utils';
import iveEditModal from '../../src/components/ive-edit-modal.vue';

describe('ive-edit-modal.vue', () => {
  it('renders the correct markup & check props', async () => {
    const wrapper = mount(iveEditModal, {
      propsData: {
        formConfig,
        hideConfig,
      },
    });
    expect(wrapper.classes()).to.include.members(['ive-edit-modal', 'v-transfer-dom']);
    const iveModal = wrapper.find('.ivu-modal');
    // width
    const modalWidth = iveModal.element.style.width;
    expect(modalWidth).to.equal('570px');
    // modal
    const iveModalTask = wrapper.find('.ivu-modal-mask');
    const iveModalWrap = wrapper.find('.ivu-modal-wrap');
    expect(iveModalTask.element.style.display).to.equal('none');
    expect(iveModalWrap.classes()).to.include('ivu-modal-hidden');
    expect(iveModal.element.style.display).to.equal('none');
    wrapper.setProps({
      modal: true,
    });
    await wrapper.vm.$nextTick();
    expect(iveModalTask.element.style.display).to.equal('');
    expect(iveModalWrap.classes()).to.not.include('ivu-modal-hidden');
    expect(iveModal.element.style.display).to.equal('');
    // title
    const ivuModalHeaderInner = wrapper.find('.ivu-modal-header-inner');
    expect(ivuModalHeaderInner.text()).to.equals('编辑弹框');
    wrapper.setProps({
      title: '测试弹框',
    });
    expect(ivuModalHeaderInner.text()).to.equals('测试弹框');
    // labelWidth
    const ivuFormItemLabel = wrapper.find('.ivu-form-item-label').element;
    expect(ivuFormItemLabel.style.width).to.equal('80px');
    wrapper.setProps({
      labelWidth: 90,
    });
    await wrapper.vm.$nextTick();
    expect(ivuFormItemLabel.style.width).to.equal('90px');
    // formConfig & hideConfig
    const { formConfigCopy, hideConfigCopy } = wrapper.vm;
    expect(formConfigCopy).to.deep.equal(formConfig);
    expect(hideConfigCopy).to.deep.equal(hideConfig);
  });
  it('check method: init & getDetail', async () => {
    const wrapper = mount(iveEditModal, {
      propsData: {
        id: '1',
        getDetailApi: () => Promise.resolve({
          data: {
            data: {},
          },
        }),
      },
    });
    expect(wrapper.vm.loading).to.equal(true);
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.loading).to.equal(false);
  });
});
