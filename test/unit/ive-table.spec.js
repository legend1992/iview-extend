import Vue from 'vue';
import { expect } from 'chai';
import { mount } from '@vue/test-utils';
import sinon from 'sinon';
import { localVue } from '../utils';
import iveTable from '../../src/components/ive-table.vue';
import iveModal from '../../src/plugins/ive-modal';
import iveImportData from '../../src/components/ive-import-data.vue';
import ivePage from '../../src/components/ive-page.vue';

localVue.component('ive-import-data', iveImportData);
localVue.component('ive-page', ivePage);
localVue.prototype.$iveModal = iveModal(Vue);
describe('ive-table.vue', () => {
  describe('renders the correct markup', () => {
    let wrapper;
    beforeEach(() => {
      wrapper = mount(iveTable, {
        localVue,
        propsData: {
          columns: [
            {
              title: 'id',
              key: 'id',
            }, {
              title: '列2',
              key: 'sd',
            },
          ],
          getListApi: () => ({
            data: {
              data: [{
                id: 1,
              }, {
                id: 2,
              }, {
                id: 3,
              }],
            },
          }),
        },
      });
    });
    afterEach(() => {
      wrapper = null;
    });
    it('renders top-button-wrapper', async () => {
      expect(wrapper.classes()).to.include('ive-table');
      // 顶部按钮
      expect(wrapper.find('.top-button-wrapper').exists()).to.equal(true);
      expect(wrapper.find('.top-button-wrapper').findAll('button').length).to.equal(1);
      expect(wrapper.find('.top-button-wrapper').findAll('button').at(0).text()).to.equal('新增');
      wrapper.setProps({
        actions: {
          add: true,
          edit: true,
          remove: true,
          export: true,
          exportAll: true,
          import: true,
          batchRemove: true,
          batchEdit: true,
        },
      });
      await wrapper.vm.$nextTick();
      const allButton = wrapper.find('.top-button-wrapper').findAll('button');
      expect(allButton.length).to.equal(6);
      expect(allButton.at(0).text()).to.equal('新增');
      expect(allButton.at(1).text()).to.equal('批量导出');
      expect(allButton.at(2).text()).to.equal('全部导出');
      expect(allButton.at(3).text()).to.equal('导入');
      expect(allButton.at(4).text()).to.equal('批量删除');
      expect(allButton.at(5).text()).to.equal('批量修改');
      // disabled buttons
      expect(allButton.at(1).attributes('disabled')).equal('disabled');
      expect(allButton.at(4).attributes('disabled')).equal('disabled');
      expect(allButton.at(5).attributes('disabled')).equal('disabled');
    });
    it('renders ivu-table', async () => {
      expect(wrapper.find('.top-button-wrapper + .ivu-table-wrapper').exists()).to.equal(true);
    });
    it('renders ive-pager', async () => {
      expect(wrapper.find('.top-button-wrapper + .ivu-table-wrapper + .ive-pager').exists()).to.equal(true);
    });
  });
  describe('check computed', () => {});
  describe('check methods', () => {
    const data = [{
      id: 1,
    }, {
      id: 2,
    }, {
      id: 3,
    }];
    const spy = sinon.spy();
    let wrapper;
    beforeEach(() => {
      wrapper = mount(iveTable, {
        localVue,
        propsData: {
          columns: [
            {
              title: 'id',
              key: 'id',
            }, {
              title: '列2',
              key: 'sd',
            },
          ],
          getListApi: (params) => {
            spy(params);
            return {
              data: {
                count: data.length,
                data,
              },
            };
          },
        },
      });
    });
    afterEach(() => {
      wrapper = null;
    });
    it('getList', async () => {
      await wrapper.vm.getList();
      const {
        list, pager: { count }, selectionData, tableLoading,
      } = wrapper.vm;
      expect(selectionData).to.eql([]);
      expect(tableLoading).to.equal(false);
      expect(list).to.eql(data);
      expect(count).to.eql(data.length);
    });
    it('getList with queryParams', async () => {
      // queryParams instanceof Object
      const queryParams = {
        test: 1,
      };
      const pageIndex = 2;
      const pageSize = 2;
      wrapper.vm.pager.pageSize = pageSize;
      await wrapper.vm.getList(queryParams, pageIndex);
      expect(wrapper.vm.queryParams).to.eql(queryParams);
      expect(spy.calledWith({
        pageIndex,
        pageSize,
        test: 1,
      })).to.equal(true);
      // queryParams not instanceof Object
      wrapper.vm.queryParams = {
        test: 2,
      };
      await wrapper.vm.getList(1);
      expect(spy.calledWith({
        pageIndex: wrapper.vm.pager.pageIndex,
        pageSize: wrapper.vm.pager.pageSize,
        test: 2,
      })).to.equal(true);
    });
    it('onPageSizeChanged', () => {
      const size = 100;
      wrapper.vm.pager.pageIndex = 5;
      wrapper.find('.ive-pager').vm.$emit('on-page-size-change', size);
      const {
        pager: {
          pageIndex,
          pageSize,
        },
      } = wrapper.vm;
      expect(pageIndex).to.equal(1);
      expect(pageSize).to.equal(size);
      expect(spy.called).to.equal(true);
    });
    it('onPageChanged', () => {
      const index = 5;
      wrapper.vm.pager.pageIndex = 1;
      wrapper.find('.ive-pager').vm.$emit('on-change', index);
      const {
        pager: {
          pageIndex,
        },
      } = wrapper.vm;
      expect(pageIndex).to.equal(5);
      expect(spy.called).to.equal(true);
    });
    it('handleShowEditModal & prop: idKey', async () => {
      wrapper.setProps({
        columns: [{
          title: 'id',
          key: 'id',
        }, {
          title: '列2',
          key: 'sd',
        }, {
          title: '操作',
          slot: 'action',
        }],
      });
      await wrapper.vm.$nextTick();
      const row1OperationButton = wrapper.find('.ivu-table-wrapper .ivu-table-body .ivu-table-row td:last-child').findAll('button');
      const editButton = row1OperationButton.at(0);
      editButton.trigger('click');
      const emitted = wrapper.emitted();
      expect(emitted.showEditModal[0][0]).to.equal(data[0].id);
      // idKey
      wrapper.setProps({
        getListApi: () => ({
          data: {
            data: [{
              id: 1,
              _id: '_1',
            }],
          },
        }),
      });
      await wrapper.vm.getList();
      editButton.trigger('click');
      // eslint-disable-next-line no-underscore-dangle
      expect(emitted.showEditModal[1][0]).to.equal('_1');
    });
    // pending
    it('handleRemove & remove & deleteKey', async () => {
      // wrapper.setProps({
      //   columns: [{
      //     title: 'id',
      //     key: 'id',
      //   }, {
      //     title: '列2',
      //     key: 'sd',
      //   }, {
      //     title: '操作',
      //     slot: 'action',
      //   }],
      // });
      // await wrapper.vm.$nextTick();
      // const row1OperationButton = wrapper.find('.ivu-table-wrapper .ivu-table-body .ivu-table-row td:last-child').findAll('button');
      // const removeButton = row1OperationButton.at(1);
      // removeButton.trigger('click');
      // await wrapper.vm.$nextTick();
      // document.querySelectorAll('.ivu-modal-confirm-footer button')[1].click();
      // await wrapper.vm.$nextTick();
      // const emitted = wrapper.emitted();
      // expect(Object.keys(emitted).length).to.equal(1);
      // expect(emitted.remove[0][0]).to.equal(data[0].id);
      // expect(emitted.remove[0][1]).to.equal(true);
    });
    it('importData & handleClose & uploadSuccess', async () => {
      wrapper.setProps({
        actions: {
          import: true,
        },
      });
      await wrapper.vm.$nextTick();
      // importData
      expect(wrapper.vm.importModal).to.equal(false);
      wrapper.findAll('.top-button-wrapper button').at(0).trigger('click');
      expect(wrapper.vm.importModal).to.equal(true);
      // handleClose
      wrapper.vm.handleClose();
      expect(wrapper.vm.importModal).to.equal(false);
      // uploadSuccess
      wrapper.findAll('.top-button-wrapper button').at(0).trigger('click');
      expect(wrapper.vm.importModal).to.equal(true);
      const res = {
        data: {},
      };
      wrapper.vm.uploadSuccess(res);
      expect(wrapper.vm.importModal).to.equal(false);
      expect(spy.called).to.equal(true);
      expect(wrapper.emitted()['upload-success'][0][0]).to.eql(res);
    });
    // pending
    it('changeChoose, exportData, batchRemove, batchEdit, loadingMessage');
  });
});
