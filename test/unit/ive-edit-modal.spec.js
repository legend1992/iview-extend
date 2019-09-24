import { expect } from 'chai';
import { mount } from '@vue/test-utils';
import sinon from 'sinon';
import flushPromises from 'flush-promises';
import { FormItem, Modal, Input } from 'iview';
import {
  formConfig,
  hideConfig,
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
    const newConfig = [{
      prop: 'newProp',
      label: 'newLabel',
    }];
    wrapper.setProps({
      formConfig: newConfig,
      hideConfig: newConfig,
    });
    wrapper.vm.$forceUpdate();
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.formConfigCopy).to.deep.equal(newConfig);
    expect(wrapper.vm.hideConfigCopy).to.deep.equal(newConfig);
  });
  it('renders slot', async () => {
    const wrapper = mount(iveEditModal, {
      propsData: {
        modal: true,
        formConfig: [{
          prop: 'prop',
          label: 'label',
        }],
      },
      slots: {
        default: '<span class="default">default</span>',
        prepend: '<span class="prepend">prepend</span>',
        append: '<span class="append">append</span>',
        prop: '<Button slot="prepend" class="formItem-prepend">slot测试prepend</Button><Button slot="append" class="formItem-append">slot测试append</Button>',
      },
    });
    // exists
    expect(wrapper.find('span.default').exists()).to.equal(true);
    expect(wrapper.find('span.prepend').exists()).to.equal(true);
    expect(wrapper.find('span.append').exists()).to.equal(true);
    expect(wrapper.find(Input).vm.$slots.prepend !== undefined).to.equal(true);
    expect(wrapper.find(Input).vm.$slots.append !== undefined).to.equal(true);
    // position
    expect(wrapper.find('span.prepend + form').exists()).to.equal(true);
    expect(wrapper.find('span.prepend + form + span.default').exists()).to.equal(true);
    expect(wrapper.find('span.prepend + form + span.default + span.append').exists()).to.equal(true);
  });
  it('check method: init & getDetail & setFormConfig', async () => {
    const spy = sinon.spy();
    const data = {
      prop1: 'value1',
      'hide-prop1': 'hide-value1',
    };
    const wrapper = mount(iveEditModal, {
      propsData: {
        id: '1',
        formConfig: [{
          prop: 'prop1',
          label: 'label1',
        }],
        hideConfig: [{
          prop: 'hide-prop1',
          label: 'hide-label1',
          itemConfig: {
            on: {
              input: spy,
            },
          },
        }],
        getDetailApi: () => Promise.resolve({
          data: {
            data,
          },
        }),
      },
    });
    expect(wrapper.vm.loading).to.equal(true);
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.loading).to.equal(false);
    // setFormConfig
    const { formConfigCopy, hideConfigCopy } = wrapper.vm;
    formConfigCopy.forEach((item) => {
      expect(item.itemConfig.value).to.equal(data[item.prop]);
    });
    hideConfigCopy.forEach((item) => {
      expect(item.itemConfig.value).to.equal(data[item.prop]);
    });
    expect(spy.called).to.equal(true);
    const emitted = wrapper.emitted();
    expect(Object.keys(emitted).length).to.equal(2);
    expect(emitted['update:formConfig'][0][0]).to.equal(formConfigCopy);
    expect(emitted['update:hideConfig'][0][0]).to.equal(hideConfigCopy);
  });
  it('check method: handleSubmit & submit & setReqData & reset & validateField', async () => {
    const wrapper = mount(iveEditModal, {
      propsData: {
        id: '1',
        formConfig: [{
          prop: 'prop1',
          label: 'label1',
          required: true,
        }],
        hideConfig: [{
          prop: 'hide-prop1',
          label: 'hide-label1',
        }],
      },
    });
    const submitButton = wrapper.findAll('.ivu-modal-footer button').at(1);
    submitButton.trigger('click');
    expect(wrapper.find(FormItem).vm.validateState).to.equal('error');
    // reset
    wrapper.vm.reset();
    expect(wrapper.find(FormItem).vm.validateState).to.equal('');
    wrapper.vm.validateField('prop1');
    expect(wrapper.find(FormItem).vm.validateState).to.equal('error');
    wrapper.vm.reset();
    expect(wrapper.find(FormItem).vm.validateState).to.equal('');
    // getDetailApi
    wrapper.setProps({
      getDetailApi: () => Promise.resolve({
        data: {
          data: {
            prop1: 'value1',
          },
        },
      }),
    });
    await wrapper.vm.getDetail();
    submitButton.trigger('click');
    const reqData = await wrapper.vm.$refs.baseForm.getData();
    const emitted = wrapper.emitted();
    expect(emitted.submit[0][0]).to.deep.equal(reqData);
    // editApi
    let required2;
    wrapper.setProps({
      editApi: (data) => {
        required2 = data;
      },
    });
    expect(emitted.success).to.equal(undefined);
    submitButton.trigger('click');
    await flushPromises();
    const formData = {
      id: '1',
      'hide-prop1': undefined,
      prop1: 'value1',
    };
    expect(required2).to.deep.equal(formData);
    expect(emitted.success[0][0]).to.deep.equal(formData);
  });
  it('check emit event: cancel', async () => {
    const wrapper = mount(iveEditModal, {
      propsData: {
        modal: true,
      },
    });
    const emitted = wrapper.emitted();
    wrapper.find(Modal).vm.$emit('on-cancel');
    expect(emitted.close.length).to.equal(1);
    wrapper.find('.ivu-modal-close').trigger('click');
    expect(emitted.close.length).to.equal(2);
    wrapper.find('.ivu-modal-footer button').trigger('click');
    expect(emitted.close.length).to.equal(3);
  });
  it('check emit event: ive-edit-form update:formConfig', async () => {
    const wrapper = mount(iveEditModal, {
      propsData: {
        modal: true,
      },
    });
    const emitted = wrapper.emitted();
    const data1 = {
      prop1: 'value1',
      prop2: 'value2',
    };
    const data2 = {
      hprop1: 'hvalue1',
      hprop2: 'hvalue2',
    };
    wrapper.find({ ref: 'baseForm' }).vm.$emit('update:formConfig', data1);
    wrapper.find({ ref: 'baseForm' }).vm.$emit('update:hideConfig', data2);
    expect(emitted['update:formConfig'][0][0]).to.deep.equal(data1);
    expect(emitted['update:hideConfig'][0][0]).to.deep.equal(data2);
  });
});
