import { expect } from 'chai';
import { mount } from '@vue/test-utils';
import sinon from 'sinon';
import {
  formConfig,
  hideConfig,
  tagNameList,
} from '../utils';
import iveEditForm from '../../src/components/ive-edit-form';
import iveInput from '../../src/components/ive-input.vue';
import iveTooltip from '../../src/components/ive-icon-tooltip.vue';

describe('ive-edit-form.vue', () => {
  it('renders the correct markup & check props', () => {
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
  });
  it('check props: formConfig - tip', () => {
    const wrapper = mount(iveEditForm, {
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
  it('check method: cleaningModel', async () => {
    const formConfig1 = [{
      prop: 'prop1',
      label: 'label1',
      tip: '提示语',
      itemConfig: {
        value: 'value1',
      },
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
    expect(wrapper.vm.model).to.deep.equal({ prop1: 'value1', prop2: 'value2' });
    formConfig1.splice(1, 1);
    wrapper.setProps({
      formConfig: [...formConfig1],
    });
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.model).to.deep.equal({ prop1: 'value1' });
  });
});
