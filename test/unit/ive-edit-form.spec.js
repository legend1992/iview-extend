import { expect } from 'chai';
import { mount } from '@vue/test-utils';
import sinon from 'sinon';
import {
  formConfig,
  hideConfig,
  tagNameList,
  formatFormConfig,
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
    const formatedConfig = formatFormConfig(wrapper.vm.formConfig, wrapper.vm.setDefaultItemConfig);
    expect(formatedConfig[0].itemConfig.tagName).to.equal('ive-input');
    expect(formatedConfig[0].itemConfig.props.placeholder).to.equal('请输入label1');
    expect(formatedConfig[1].itemConfig.tagName).to.equal('ive-input');
    expect(formatedConfig[1].itemConfig.props.placeholder).to.equal('请输入label2');
    expect(formatedConfig[2].itemConfig.tagName).to.equal('ive-input');
    expect(formatedConfig[2].itemConfig.props.placeholder).to.equal('请输入label3');
    expect(formatedConfig[3].itemConfig.props.placeholder).to.equal(undefined);
    expect(formatedConfig[4].itemConfig.tagName).to.equal('ive-input');
    expect(formatedConfig[4].itemConfig.props.placeholder).to.equal('placeholder5');
  });
  it('emit event: setDefaultRules', () => {
    const wrapper = mount(iveEditForm, {
      propsData: {
        formConfig: [
          {
            prop: 'prop1',
            required: true,
          },
          {
            prop: 'prop2',
            rules: [],
          },
          {
            prop: 'prop3',
          },
        ],
      },
    });
    const buttons = wrapper.findAll('.button-wrapper button');
    buttons.at(0).trigger('click');
    buttons.at(1).trigger('click');
    const emitted = wrapper.emitted();
    expect(emitted.query.length).to.equal(2);
    const { model } = wrapper.vm;
    expect(emitted.query[0][0]).to.deep.equal(model);
    expect(emitted.query[1][0]).to.deep.equal(model);
  });
});
