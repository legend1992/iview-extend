import { expect } from 'chai';
import { mount } from '@vue/test-utils';
import { Upload } from 'iview';
import '../utils';
import iveUpload from '../../src/components/ive-upload.vue';

describe('ive-upload.vue', () => {
  it('renders the correct markup', () => {
    const wrapper = mount(iveUpload, {
      propsData: {
        action: '//jsonplaceholder.typicode.com/posts/',
      },
    });
    expect(wrapper.classes()).to.include('ive-upload');
    expect(wrapper.find(Upload).exists()).to.equal(true);
  });
  it('methods: pickFile', () => {
    const wrapper = mount(iveUpload, {
      propsData: {
        action: '//jsonplaceholder.typicode.com/posts/',
      },
    });
    let file = new File(['plain/text'], 'file', { type: 'plain/text' });
    wrapper.vm.pickFile(file);
    let emitted = wrapper.emitted();
    console.log('emitted', emitted);
    // expect(emitted['format-error']).to.equal(true);
    file = new File([new Image(100, 200)], 'file.jpg', { type: 'image/jpeg' });
    wrapper.vm.pickFile(file);
    emitted = wrapper.emitted();
    console.log('emitted', emitted);
    // expect().to.include('ive-upload');
    // expect(wrapper.find(Upload).exists()).to.equal(true);
  });
});
