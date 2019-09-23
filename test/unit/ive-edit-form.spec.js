import { expect } from 'chai';
import { mount } from '@vue/test-utils';
import sinon from 'sinon';
import { FormItem } from 'iview';
import {
  formConfig,
  hideConfig,
  tagNameList,
} from '../utils';
import iveEditForm from '../../src/components/ive-edit-form';
import iveInput from '../../src/components/ive-input.vue';
import iveTooltip from '../../src/components/ive-icon-tooltip.vue';

describe('ive-edit-form.vue', () => {
  it('renders the correct markup & check props', async () => {
    const wrapper = mount(iveEditForm, {
      propsData: {
        formConfig,
        hideConfig,
      },
    });
    expect(wrapper.classes()).to.include.members(['ivu-form', 'ive-edit-form']);
    // formConfig length
    const formItems = wrapper.findAll('.ivu-form-item');
    expect(formItems.length).to.equal(wrapper.props('formConfig').length + wrapper.props('hideConfig').length);
    // formConfig tagName
    const { length: tagNameListLength } = tagNameList;
    Array.from({ length: formItems.length }).forEach((formItem, index) => {
      expect(formItems.at(index).find('.ivu-form-item-content > *').name()).to.equal(tagNameList[index % tagNameListLength]);
    });
    // model
    const { model, formConfig: config, hideConfig: hConfig } = wrapper.vm;
    const allConfig = [...config, ...hConfig];
    expect(Object.keys(model).length).to.equal(allConfig.length);
    allConfig.forEach((item) => {
      const itemValue = item.itemConfig && item.itemConfig.value;
      expect(model[item.prop]).to.deep.equal(itemValue);
    });
    // labelWidth
    const ivuFormItemLabel = wrapper.find('.ivu-form-item-label').element;
    expect(ivuFormItemLabel.style.width).to.equal('80px');
    wrapper.setProps({
      labelWidth: 90,
    });
    await wrapper.vm.$nextTick();
    expect(ivuFormItemLabel.style.width).to.equal('90px');
  });
  it('check props: formConfig - tip & inlineTip', () => {
    const wrapper = mount(iveEditForm, {
      propsData: {
        formConfig: [{
          prop: 'prop',
          label: 'label',
          tip: '提示语',
        }, {
          prop: 'prop2',
          label: 'label2',
          inlineTip: '行内提示',
        }],
      },
    });
    const formItems = wrapper.findAll('.ivu-form-item');
    // tip
    expect(formItems.at(0).find(iveTooltip).exists()).to.equal(true);
    expect(formItems.at(1).find(iveTooltip).exists()).to.equal(false);
    // inlineTip
    expect(formItems.at(0).find('.inline-tip').exists()).to.equal(false);
    expect(formItems.at(1).find('.inline-tip').text()).to.equal('行内提示');
  });
  it('check props: hideConfig', () => {
    const wrapper = mount(iveEditForm, {
      propsData: {
        formConfig,
        hideConfig,
      },
    });
    expect(wrapper.vm.moreIsShow).to.equal(false);
    const hidePartWrapper = wrapper.find('.hidePart-wrapper');
    expect(hidePartWrapper.exists()).to.equal(true);
    expect(wrapper.findAll('.toggle-button').length).to.equal(2);
    const showMoreButton = wrapper.findAll('.toggle-button').at(0);
    expect(showMoreButton.classes()).to.not.include('hide');
    // showMoreButton.trigger('click')
    showMoreButton.trigger('click');
    expect(wrapper.vm.moreIsShow).to.equal(true);
    wrapper.vm.$forceUpdate();
    expect(showMoreButton.classes()).to.include('hide');
    expect(hidePartWrapper.classes()).to.include('show');
    // hideMoreButton.trigger('click')
    const hideMoreButton = wrapper.findAll('.toggle-button').at(1);
    hideMoreButton.trigger('click');
    expect(wrapper.vm.moreIsShow).to.equal(false);
    wrapper.vm.$forceUpdate();
    expect(showMoreButton.classes()).to.not.include('hide');
    expect(hidePartWrapper.classes()).to.not.include('show');
  });
  it('check formItem input event change model', () => {
    const spy = sinon.spy();
    const wrapper = mount(iveEditForm, {
      propsData: {
        formConfig: [{
          prop: 'prop',
          label: 'label',
          itemConfig: {
            on: {
              input: spy,
            },
          },
        }],
      },
    });
    wrapper.find(iveInput).vm.$emit('input', '输入值');
    expect(wrapper.vm.model.prop).to.equal('输入值');
    expect(spy.calledWith('输入值')).to.equal(true);
  });
  it('check method: setDefaultItemConfig', () => {
    const wrapper = mount(iveEditForm, {
      propsData: {
        formConfig: [{
          prop: 'prop1',
          label: 'label1',
        }, {
          prop: 'prop2',
          label: 'label2',
          itemConfig: {},
        }, {
          prop: 'prop3',
          label: 'label3',
          itemConfig: {
            props: {},
          },
        }, {
          prop: 'prop4',
          label: 'label4',
          itemConfig: {
            tagName: 'ive-date-range-picker',
          },
        }, {
          prop: 'prop5',
          label: 'label5',
          itemConfig: {
            props: {
              placeholder: 'placeholder5',
            },
          },
        }],
      },
    });
    const { formConfigFormat } = wrapper.vm;
    expect(formConfigFormat[0].itemConfig.tagName).to.equal('ive-input');
    expect(formConfigFormat[0].itemConfig.props.placeholder).to.equal('请输入label1');
    expect(formConfigFormat[1].itemConfig.tagName).to.equal('ive-input');
    expect(formConfigFormat[1].itemConfig.props.placeholder).to.equal('请输入label2');
    expect(formConfigFormat[2].itemConfig.tagName).to.equal('ive-input');
    expect(formConfigFormat[2].itemConfig.props.placeholder).to.equal('请输入label3');
    expect(formConfigFormat[3].itemConfig.props.placeholder).to.equal(undefined);
    expect(formConfigFormat[4].itemConfig.tagName).to.equal('ive-input');
    expect(formConfigFormat[4].itemConfig.props.placeholder).to.equal('placeholder5');
  });
  it('check method: setDefaultRules', () => {
    const wrapper = mount(iveEditForm, {
      propsData: {
        formConfig: [
          // branuch1: required == true
          {
            prop: 'prop1-1',
            label: 'label1-1',
            required: true,
          },
          {
            prop: 'prop1-2',
            label: 'label1-2',
            required: true,
            rules: [{
              type: 'email',
            }],
          },
          {
            prop: 'prop1-3',
            label: 'label1-3',
            required: true,
            rules: [
              {
                required: false,
              },
            ],
          },
          // branuch2: required !== true && item.rules && item.rules instanceof Array
          {
            prop: 'prop2-1',
            label: 'label2-1',
            rules: [
              {
                required: 'test',
              },
            ],
          },
          {
            prop: 'prop2-2',
            label: 'label2-2',
            rules: [],
          },
          // branuch3: else
          {
            prop: 'prop3',
            label: 'label3',
          },
        ],
      },
    });
    const { formConfigFormat } = wrapper.vm;
    expect(formConfigFormat[0].rules).to.deep.equal([{ required: true, message: 'label1-1不为空' }]);
    expect(formConfigFormat[1].rules).to.deep.equal([{ required: true, message: 'label1-2不为空' }, { type: 'email' }]);
    expect(formConfigFormat[2].rules).to.deep.equal([{ required: true, message: 'label1-3不为空' }]);
    expect(formConfigFormat[3].rules).to.deep.equal([{ required: false }]);
    expect(formConfigFormat[4].rules).to.deep.equal([{ required: false }]);
    expect(formConfigFormat[5].rules).to.deep.equal([{ required: false }]);
  });
  it('check method: cleaningModel & validateField', async () => {
    const formConfig1 = [{
      prop: 'prop1',
      label: 'label1',
      tip: '提示语',
      itemConfig: {
        value: '',
      },
      required: true,
    }, {
      prop: 'prop2',
      label: 'label2',
      itemConfig: {
        value: 'value2',
      },
    }];
    const wrapper = mount(iveEditForm, {
      propsData: {
        formConfig: formConfig1,
      },
    });
    expect(wrapper.vm.model).to.deep.equal({ prop1: '', prop2: 'value2' });
    const validateResult = await wrapper.vm.validate();
    expect(validateResult).to.equal(false);
    expect(wrapper.findAll(FormItem).at(0).vm.validateState).to.equal('error');
    formConfig1.splice(0, 1);
    wrapper.setProps({
      formConfig: [...formConfig1],
    });
    await wrapper.vm.$nextTick();
    expect(wrapper.findAll(FormItem).at(0).vm.validateState).to.equal('success');
    expect(wrapper.vm.model).to.deep.equal({ prop2: 'value2' });
  });
  it('check method: getData', async () => {
    const formConfig1 = [{
      prop: 'prop1',
      label: 'label1',
      tip: '提示语',
      required: true,
    }, {
      prop: 'prop2',
      label: 'label2',
      itemConfig: {
        value: 'value2',
      },
    }];
    const wrapper = mount(iveEditForm, {
      propsData: {
        formConfig: formConfig1,
      },
    });
    let data = await wrapper.vm.getData();
    expect(data).to.equal(undefined);
    expect(wrapper.findAll(FormItem).at(0).vm.validateState).to.equal('error');
    data = await wrapper.vm.getData(false);
    expect(data).to.deep.equal({ prop1: undefined, prop2: 'value2' });
  });
  it('renders slots', () => {
    const wrapper = mount(iveEditForm, {
      propsData: {
        formConfig: [{
          prop: 'prop',
          label: 'label',
        }],
      },
      slots: {
        prop: '<Button slot="prepend" class="slot-prepend">slot测试prepend</Button><Button slot="append" class="slot-append">slot测试append</Button>',
      },
    });
    // render
    expect(wrapper.find('.ivu-form-item .ivu-input-group-prepend').exists()).to.equal(true);
    expect(wrapper.find('.ivu-form-item .ivu-input-group-prepend + i + .ivu-input').exists()).to.equal(true);
    expect(wrapper.find('.ivu-form-item .ivu-input-group-prepend + i + .ivu-input + .ivu-input-group-append').exists()).to.equal(true);
    expect(wrapper.find('.ivu-form-item .ivu-input-group-prepend .slot-prepend').text()).to.equal('slot测试prepend');
    expect(wrapper.find('.ivu-form-item .ivu-input-group-append .slot-append').text()).to.equal('slot测试append');
    // click: 暂未找到模拟slot上触发click事件的方法
  });
  it('check method: reset', () => {
    const wrapper = mount(iveEditForm, {
      propsData: {
        formConfig: [{
          prop: 'prop',
          label: 'label',
        }],
        hideConfig: [{
          prop: 'prop-hide',
          label: 'label-hide',
          required: true,
        }],
      },
    });
    // change formConfig & hideConfig
    wrapper.find(iveInput).vm.$emit('input', 'input-value');
    expect(wrapper.vm.model.prop).to.equal('input-value');
    // change validateState
    wrapper.findAll(iveInput).at(1).find('input').trigger('focus');
    wrapper.findAll(iveInput).at(1).find('input').trigger('blur');
    expect(wrapper.findAll(FormItem).at(1).vm.validateState).to.equal('error');
    // change moreIsShow
    wrapper.findAll('.toggle-button').at(0).trigger('click');
    expect(wrapper.vm.moreIsShow).to.equal(true);
    wrapper.vm.$forceUpdate();
    expect(wrapper.find('.hidePart-wrapper').classes()).to.include('show');
    wrapper.vm.reset();
    // reset formConfig & hideConfig
    const emitted = wrapper.emitted();
    const resetFormConfig = emitted['update:formConfig'][0][0];
    const resetHideConfig = emitted['update:hideConfig'][0][0];
    resetFormConfig.forEach((item) => {
      const oItem2 = wrapper.vm.formConfigOriginal.find(oItem => oItem.prop === item.prop) || {};
      expect(item.itemConfig.value).to.equal(oItem2.itemConfig && oItem2.itemConfig.value);
    });
    resetHideConfig.forEach((item) => {
      const oItem2 = wrapper.vm.hideConfigOriginal.find(oItem => oItem.prop === item.prop) || {};
      expect(item.itemConfig.value).to.equal(oItem2.itemConfig && oItem2.itemConfig.value);
    });
    // reset validateState
    expect(wrapper.findAll(FormItem).at(1).vm.validateState).to.equal('');
    // reset moreIsShow
    expect(wrapper.vm.moreIsShow).to.equal(false);
    expect(wrapper.find('.hidePart-wrapper').classes()).to.not.include('show');
  });
});
