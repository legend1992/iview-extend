import { expect } from 'chai';
import { mount } from '@vue/test-utils';
import sinon from 'sinon';
import flushPromise from 'flush-promises';
import { createImage } from '../utils';
import iveEditor from '../../src/components/ive-editor.vue';

describe('ive-editor.vue', () => {
  let wrapper;
  const inputSpy = sinon.spy();
  const uploadSpy = sinon.spy();
  const url = 'http://image.com/test.jpg';
  beforeEach(() => {
    wrapper = mount(iveEditor, {
      propsData: {
        value: 'editorValue',
        uploadApi: async (img) => {
          uploadSpy(img);
          return url;
        },
      },
      listeners: {
        input: (e) => {
          inputSpy(e);
        },
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
  it('emit change', async () => {
    await wrapper.vm.$nextTick();
    const emitted = wrapper.emitted();
    expect(emitted.change[0][0]).to.equal('editorValue');
    expect(emitted.change[0][1].trim()).to.equal('<p>editorValue</p>');
  });
  it('methods: onImgAdd', async () => {
    const image = await createImage();
    wrapper.find('.v-left-item').vm.$imgFileAdd(image);
    // 存疑，是碰巧3次flushPromise时间够长还是？
    await flushPromise();
    await flushPromise();
    await flushPromise();
    expect(uploadSpy.called).to.equal(true);
    expect(wrapper.find('.v-note-panel textarea').element.value).to.equal('editorValue![testImage.png](http://image.com/test.jpg)');
  });
});
