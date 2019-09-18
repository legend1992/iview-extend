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
  it('emit format-error', async () => {
    const wrapper = mount(iveUpload, {
      propsData: {
        action: '//jsonplaceholder.typicode.com/posts/',
      },
    });
    // format & emit format-error
    const file = new File(['plain/text'], 'file');
    await wrapper.vm.pickFile(file);
    const emitted = wrapper.emitted();
    expect(emitted['format-error'].length).to.equal(1);
  });
});
