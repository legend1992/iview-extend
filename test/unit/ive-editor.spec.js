import { expect } from 'chai';
import { mount } from '@vue/test-utils';
import sinon from 'sinon';
import '../utils';
import iveEditor from '../../src/components/ive-editor.vue';

describe('ive-editor.vue', () => {
  let wrapper;
  const inputSpy = sinon.spy();
  const uploadSpy = sinon.spy();
  beforeEach(() => {
    wrapper = mount(iveEditor, {
      propsData: {
        value: 'editorValue',
        uploadApi: uploadSpy,
      },
      listeners: {
        input: inputSpy,
      },
    });
  });
  afterEach(() => {
    wrapper = null;
  });
  it('renders the correct markup', async () => {
    await wrapper.vm.$nextTick();
    expect(wrapper.classes()).to.eql(['v-note-wrapper', 'markdown-body', 'ive-editor', 'shadow']);
    // toolbars
    const { toolbars } = wrapper.vm;
    const { length } = Object.keys(toolbars).filter(item => toolbars[item]);
    const leftAll = wrapper.find('.v-left-item').findAll('*[type="button"]');
    const rightAll = wrapper.find('.v-right-item').findAll('*[type="button"]');
    expect(length === (leftAll.length + rightAll.length - 1)).to.equal(true);
    // content-input
    expect(wrapper.find('.v-note-panel textarea').element.value).to.equal('editorValue');
  });
  it('emit input', async () => {
    const testContent = 'test-content';
    wrapper.find('.ive-editor').vm.$emit('input', testContent);
    expect(inputSpy.calledWith(testContent)).to.equal(true);
  });
});
