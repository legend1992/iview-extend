import { expect } from 'chai';
import { mount } from '@vue/test-utils';
import { Upload } from 'iview';
import sinon from 'sinon';
import { createImage } from '../utils';
import iveUpload from '../../src/components/ive-upload.vue';

describe('ive-upload.vue', () => {
  it('renders the correct markup & check props', () => {
    const imgUrl = 'http://www.xxx.com/image.png';
    const wrapper = mount(iveUpload, {
      propsData: {
        action: '//jsonplaceholder.typicode.com/posts/',
        value: imgUrl,
        resolutionRatio: {
          width: '99',
          height: '99',
        },
        maxSize: 1000,
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
    // checkFormat
    const file = new File([], 'file');
    await wrapper.vm.pickFile(file);
    const emitted = wrapper.emitted();
    expect(emitted['format-error'].length).to.equal(1);
    // checkResolutionRatio
    const image = await createImage({
      width: 100,
      height: 200,
    });
    //   branch 1
    wrapper.setProps({
      resolutionRatio: {
        width: 99,
        height: 199,
      },
    });
    await wrapper.vm.pickFile(image);
    expect(emitted['resolution-ratio-error'].length).to.equal(1);
    expect(emitted['resolution-ratio-error'][0][0]).to.equal('图片宽度需等于99');
    //   branch 2
    wrapper.setProps({
      resolutionRatio: {
        width: 100,
        height: 199,
      },
    });
    await wrapper.vm.pickFile(image);
    expect(emitted['resolution-ratio-error'].length).to.equal(2);
    expect(emitted['resolution-ratio-error'][1][0]).to.equal('图片高度需等于199');
    //   branch 3
    wrapper.setProps({
      resolutionRatio: {
        width: {
          max: 99,
        },
      },
    });
    await wrapper.vm.pickFile(image);
    expect(emitted['resolution-ratio-error'].length).to.equal(3);
    expect(emitted['resolution-ratio-error'][2][0]).to.equal('图片最大宽度为99');
    //   branch 4
    wrapper.setProps({
      resolutionRatio: {
        width: {
          min: 101,
        },
      },
    });
    await wrapper.vm.pickFile(image);
    expect(emitted['resolution-ratio-error'].length).to.equal(4);
    expect(emitted['resolution-ratio-error'][3][0]).to.equal('图片最小宽度为101');
    //   branch 5
    wrapper.setProps({
      resolutionRatio: {
        height: {
          max: 199,
        },
      },
    });
    await wrapper.vm.pickFile(image);
    expect(emitted['resolution-ratio-error'].length).to.equal(5);
    expect(emitted['resolution-ratio-error'][4][0]).to.equal('图片最大高度为199');
    //   branch 6
    wrapper.setProps({
      resolutionRatio: {
        height: {
          min: 201,
        },
      },
    });
    await wrapper.vm.pickFile(image);
    expect(emitted['resolution-ratio-error'].length).to.equal(6);
    expect(emitted['resolution-ratio-error'][5][0]).to.equal('图片最小高度为201');
    // image onerror
    await wrapper.vm.pickFile(new File([], 'file.png'));
  });
  it('check before-upload', async () => {
    const spy = sinon.spy();
    const wrapper = mount(iveUpload, {
      methods: {
        pickFile: spy,
      },
    });
    const image = await createImage();
    wrapper.vm.$refs.upload.handleChange({ target: { files: [image] } });
    expect(spy.calledOnce).to.equal(true);
  });
  it('check on-exceeded-size', (done) => {
    const spy = sinon.spy();
    const wrapper = mount(iveUpload, {
      propsData: {
        maxSize: 0.001,
      },
      methods: {
        handleExceededSize: (e) => {
          spy();
          wrapper.vm.$emit('on-exceeded-size', e);
        },
      },
      listeners: {
        'on-exceeded-size': () => {
          expect(spy.calledOnce).to.equal(true);
          done();
        },
      },
    });
    wrapper.vm.$refs.upload.handleChange({ target: { files: [new File([JSON.stringify('foo')], { type: 'image/png' })] } });
  });
  describe('upload', () => {
    let requests; let xhr;
    const file = new File([JSON.stringify('foo')], { type: 'image/png' });
    beforeEach(() => {
      xhr = sinon.useFakeXMLHttpRequest();
      requests = [];
      xhr.onCreate = req => requests.push(req);
    });
    afterEach(() => {
      xhr.restore();
    });
    it('on-success', (done) => {
      const wrapper = mount(iveUpload, {
        propsData: {
          action: '//jsonplaceholder.typicode.com/posts/',
        },
        listeners: {
          'on-success': (ret) => {
            expect(ret).to.eql({ success: true });
            done();
          },
        },
      });
      wrapper.vm.$refs.upload.post(file);
      requests[0].respond(200, {}, '{"success": true}');
    });
    it('on-error', (done) => {
      const wrapper = mount(iveUpload, {
        propsData: {
          action: '//jsonplaceholder.typicode.com/posts/',
        },
        listeners: {
          'on-error': (err) => {
            expect(err instanceof Error).to.equal(true);
            done();
          },
        },
      });
      wrapper.vm.$refs.upload.post(file);
      setTimeout(() => {
        requests[0].respond(400, {}, 'error 400');
      }, 100);
    });
    it('on-progress', (done) => {
      const wrapper = mount(iveUpload, {
        propsData: {
          action: '//jsonplaceholder.typicode.com/posts/',
        },
        listeners: {
          'on-progress': ({ loaded, total }) => {
            expect(loaded).to.equal(20);
            expect(total).to.equal(100);
            done();
          },
        },
      });
      wrapper.vm.$refs.upload.post(file);
      requests[0].uploadProgress({
        total: 100,
        loaded: 20,
      });
    });
  });
});
