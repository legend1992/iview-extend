import { expect } from 'chai';
import { mount } from '@vue/test-utils';
import { Upload } from 'iview';
import '../utils';
import iveUpload from '../../src/components/ive-upload.vue';

describe('ive-upload.vue', () => {
  it('renders the correct markup & check props', () => {
    const imgUrl = 'http://www.xxx.com/image.png';
    const wrapper = mount(iveUpload, {
      propsData: {
        action: '//jsonplaceholder.typicode.com/posts/',
        value: imgUrl,
      },
    });
    expect(wrapper.classes()).to.include('ive-upload');
    expect(wrapper.find(Upload).exists()).to.equal(true);
    // value & fileUrl
    expect(wrapper.vm.fileUrl).to.equal(imgUrl);
  });
  it('check method: pickFile & checkFormat & checkResolutionRatio', async () => {
    const wrapper = mount(iveUpload, {
      propsData: {
        action: '//jsonplaceholder.typicode.com/posts/',
      },
    });
    const file = new File([], 'file');
    await wrapper.vm.pickFile(file);
    const emitted = wrapper.emitted();
    expect(emitted['format-error'].length).to.equal(1);
  });
});
