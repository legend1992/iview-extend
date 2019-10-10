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
const cleanCSV = str => str.split('\n').map(s => s.trim()).filter(Boolean).join('\n');
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
        importApi: () => {},
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
      wrapper.find({ ref: 'table' }).vm.$emit('on-selection-change', [{ id: 1 }]);
      expect(allButton.at(1).attributes('disabled')).equal(undefined);
      expect(allButton.at(4).attributes('disabled')).equal(undefined);
      expect(allButton.at(5).attributes('disabled')).equal(undefined);
    });
    it('renders ivu-table', async () => {
      expect(wrapper.find('.top-button-wrapper + .ivu-table-wrapper').exists()).to.equal(true);
    });
    it('renders ive-pager', async () => {
      expect(wrapper.find('.top-button-wrapper + .ivu-table-wrapper + .ive-pager').exists()).to.equal(true);
    });
  });
  it('check computed', () => {
    const wrapper = mount(iveTable, {
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
        exportAllApi: '/testApi',
        getListApi: () => {},
      },
    });
    const {
      tableSlots, columns, checkboxColumns, formatColumns, topActions, batchDisabled,
      queryParamsChange,
    } = wrapper.vm;
    // tableSlots
    const { $scopedSlots: slots } = wrapper.vm;
    delete slots.topButtons;
    expect(tableSlots).eql(slots);
    // checkboxColumns
    columns.forEach((column) => {
      // eslint-disable-next-line no-underscore-dangle
      delete column.__id;
    });
    columns.unshift({ type: 'selection', width: 50 });
    checkboxColumns.forEach((column, index) => {
      expect(column).eql(columns[index]);
    });
    // formatColumns
    expect(formatColumns).eql(columns);
    wrapper.setProps({
      actions: {
        export: true,
      },
    });
    expect(formatColumns).eql(checkboxColumns);
    // topActions
    expect(topActions).equal(true);
    // batchDisabled
    expect(batchDisabled).equal(true);
    wrapper.find({ ref: 'table' }).vm.$emit('on-selection-change', [{ id: 1 }]);
    expect(wrapper.vm.batchDisabled).equal(false);
    // queryParamsChange
    // eslint-disable-next-line no-script-url
    expect(queryParamsChange).equal('/testApi');
    wrapper.vm.queryParams = { a: 1, b: 2 };
    expect(wrapper.vm.queryParamsChange).equal('/testApi?a=1&b=2');
  });
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
    it('importData & handleClose & uploadSuccess', async () => {
      wrapper.setProps({
        actions: {
          import: true,
        },
        importApi: () => {},
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
    it('changeChoose', () => {
      const selectionData = [{ id: 1 }];
      expect(wrapper.vm.selectionData).eql([]);
      wrapper.find({ ref: 'table' }).vm.$emit('on-selection-change', selectionData);
      expect(wrapper.vm.selectionData).eql(selectionData);
    });
    it('exportData', async () => {
      const str = `"id";"列2"
        "1";""`;
      wrapper.find({ ref: 'table' }).vm.$emit('on-selection-change', [{ id: 1 }]);
      wrapper.vm.$refs.table.exportCsv({
        columns: wrapper.vm.columns,
        data: wrapper.vm.selectionData,
        separator: ';',
        quoted: true,
        callback: (exportData) => {
          expect(cleanCSV(exportData)).to.equal(cleanCSV(str));
          expect(cleanCSV(exportData).length > 0).to.equal(true);
        },
      });
    });
    it('batchEdit', async () => {
      wrapper.setProps({
        actions: {
          batchEdit: true,
        },
      });
      const emitted = wrapper.emitted();
      wrapper.find('.top-button-wrapper').findAll('button').at(0).trigger('click');
      expect(Object.keys(emitted).length).to.equal(0);
      wrapper.find({ ref: 'table' }).vm.$emit('on-selection-change', [{ id: 1 }]);
      wrapper.find('.top-button-wrapper').findAll('button').at(0).trigger('click');
      expect(emitted.showEditModal.length).to.equal(1);
      expect(emitted.showEditModal[0][0]).to.equal(1);
      wrapper.find({ ref: 'table' }).vm.$emit('on-selection-change', [{ id: 1 }, { id: 2 }]);
      wrapper.find('.top-button-wrapper').findAll('button').at(0).trigger('click');
      expect(emitted.showBatchEditModal.length).to.equal(1);
      expect(emitted.showBatchEditModal[0][0]).to.eql([{ id: 1 }, { id: 2 }]);
    });
    it('emit showEditModal', () => {
      expect(wrapper.emitted().showEditModal === undefined).to.equal(true);
      wrapper.find('.top-button-wrapper').findAll('button').at(0).trigger('click');
      expect(wrapper.emitted().showEditModal.length).to.equal(1);
    });
    it('loadingMessage', () => {
      wrapper.setProps({
        actions: {
          exportAll: true,
        },
        exportAllApi: '/xxx',
      });
      wrapper.find('.top-button-wrapper').findAll('button').at(0).trigger('click');
      const messageNode = document.querySelectorAll('.ivu-message')[document.querySelectorAll('.ivu-message').length - 1];
      expect(messageNode !== undefined).to.equal(true);
      expect(messageNode.querySelector('.ivu-message-loading.ivu-message-custom-content span').textContent).to.equal('下载文件内容太大请耐心等待...');
    });
    it('handleRemove & batchRemove & remove & deleteKey', async () => {
      const row = data[0];
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
      const emitted = wrapper.emitted();
      const removeSpy = sinon.spy();
      const confirm = { remove: removeSpy };
      const confirmSpy = sinon.spy();
      wrapper.vm.$iveModal.confirm = (content) => {
        confirmSpy(content);
        return Promise.resolve(confirm);
      };
      // handleRemove
      wrapper.vm.handleRemove(row);
      await wrapper.vm.$nextTick();
      expect(Object.keys(emitted.remove).length).to.equal(1);
      expect(emitted.remove[0][0]).to.equal(row.id);
      expect(emitted.remove[0][1]).to.equal(confirm);
      // batchRemove
      wrapper.find({ ref: 'table' }).vm.$emit('on-selection-change', [{ id: 1 }, { id: 2 }]);
      wrapper.vm.batchRemove();
      await wrapper.vm.$nextTick();
      expect(Object.keys(emitted.remove).length).to.equal(2);
      expect(emitted.remove[1][0]).to.eql(wrapper.vm.selectionData.map(item => item.id));
      expect(emitted.remove[1][1]).to.equal(confirm);
      // remove: deleteApi !== undefined
      const deleteSpy = sinon.spy();
      wrapper.setProps({
        deleteApi: deleteSpy,
      });
      wrapper.vm.handleRemove(row);
      await wrapper.vm.$nextTick();
      expect(Object.keys(emitted.remove).length).to.equal(2);
      expect(deleteSpy.calledOnceWith(row.id)).to.equal(true);
      expect(removeSpy.calledOnce).to.equal(true);
      // deleteKey
      const { idKey, deleteKey } = wrapper.vm;
      const id = row[idKey] || row.id;
      const title = row[deleteKey] || id;
      expect(confirmSpy.calledOnceWith(`确定删除<b>${title}</b>吗？`));
    });
  });
});
