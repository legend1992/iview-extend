import { expect } from 'chai';
import { mount } from '@vue/test-utils';
import { Upload } from 'iview';
import sinon from 'sinon';
import '../utils';
import iveImportData from '../../src/components/ive-import-data.vue';

describe('ive-import-data.vue', () => {
  it('renders the correct markup & check props', async () => {
    const wrapper = mount(iveImportData, {
      propsData: {
        modal: true,
        importApi: () => {},
      },
    });
    expect(wrapper.classes()).to.include('ive-import-modal');
    await wrapper.vm.$nextTick();
    // Upload组件
    expect(wrapper.find(Upload).exists()).to.equal(true);
    // 文件列表
    expect(wrapper.find('.file-wrapper').element.style.display).to.equal('none');
    // 上传按钮
    const uploadButton = wrapper.findAll('.ivu-modal-footer button');
    expect(uploadButton.length).to.equal(2);
    expect(uploadButton.at(0).text()).to.equal('覆盖导入：唯一字段相同时直接覆盖');
    expect(uploadButton.at(1).text()).to.equal('跳过导入：唯一字段相同时不导入');
    // accept
    expect(wrapper.props('accept')).to.equal('application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    // format
    expect(wrapper.props('format')).to.eql(['xls', 'xlsx']);
    // modal
    expect(wrapper.props('modal')).to.equal(true);
    const iveModal = wrapper.find('.ivu-modal');
    const iveModalTask = wrapper.find('.ivu-modal-mask');
    const iveModalWrap = wrapper.find('.ivu-modal-wrap');
    expect(iveModalTask.element.style.display).to.equal('');
    expect(iveModalWrap.classes()).to.not.include('ivu-modal-hidden');
    expect(iveModal.element.style.display).to.equal('');
    wrapper.setProps({
      modal: false,
    });
    await wrapper.vm.$nextTick();
    expect(iveModalTask.element.style.display).to.equal('none');
    expect(iveModal.element.style.display).to.equal('none');
  });
  it('check computed: hasFile & exportButtonTitle', () => {
    const wrapper = mount(iveImportData, {
      propsData: {
        importApi: () => {},
      },
    });
    const { hasFile, exportButtonTitle } = wrapper.vm;
    expect(hasFile).to.equal(false);
    expect(exportButtonTitle).to.equal('请先选择文件');
    const uploadButton = wrapper.findAll('.ivu-modal-footer button');
    expect(uploadButton.length).to.equal(2);
    expect(uploadButton.at(0).attributes('title')).to.equal(exportButtonTitle);
    expect(uploadButton.at(1).attributes('title')).to.equal(exportButtonTitle);
  });
  function handleChange(wrapper, file) {
    wrapper.find(Upload).vm.handleChange({ target: { files: [file] } });
  }
  it('check methods: formatCheck & handleUpload & remove', () => {
    const wrapper = mount(iveImportData, {
      propsData: {
        importApi: () => {},
      },
    });
    // handleUpload & formatCheck: 错误格式
    let testFile = new File([JSON.stringify('foo')], 'test.txt');
    handleChange(wrapper, testFile);
    const { uploadFile } = wrapper.vm;
    const fileWrapper = wrapper.find('.file-wrapper');
    expect(uploadFile).to.eql([]);
    expect(fileWrapper.element.style.display).to.equal('none');
    // handleUpload & formatCheck: 正确格式
    testFile = new File([JSON.stringify('foo')], 'test.xlsx', { type: 'application/vnd.ms-excel' });
    handleChange(wrapper, testFile);
    expect(wrapper.vm.uploadFile).to.eql([testFile]);
    expect(fileWrapper.element.style.display).to.equal('');
    expect(fileWrapper.text()).to.include('上传文件: test.xlsx');
    // remove
    fileWrapper.find('button.delete').trigger('click');
    expect(wrapper.vm.uploadFile).to.eql([]);
    expect(fileWrapper.element.style.display).to.equal('none');
  });
  describe('upload', () => {
    let importSpy;
    let wrapper;
    let formData;
    const testFile = new File([JSON.stringify('foo')], 'test.xlsx', { type: 'application/vnd.ms-excel' });
    beforeEach(() => {
      importSpy = sinon.spy();
      wrapper = mount(iveImportData, {
        propsData: {
          importApi: (e) => {
            importSpy(e);
            return 'success';
          },
        },
      });
      handleChange(wrapper, testFile);
      formData = new FormData();
      formData.append('file', testFile);
    });
    it('check methods: upload覆盖导入', () => {
      wrapper.findAll('.ivu-modal-footer button').at(0).trigger('click');
      formData.append('cover', 'yes');
    });
    it('check methods: upload跳过导入', () => {
      wrapper.findAll('.ivu-modal-footer button').at(1).trigger('click');
      formData.append('cover', 'no');
    });
    afterEach(async () => {
      await wrapper.vm.$nextTick();
      expect(importSpy.calledWith(formData)).to.equal(true);
      expect(wrapper.emitted()['upload-success'][0][0]).to.equal('success');
      expect(wrapper.vm.uploadFile).to.eql([]);
      formData = null;
      wrapper = null;
    });
  });
});
