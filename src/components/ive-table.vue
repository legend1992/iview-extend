<template>
  <div class="ive-table">
    <Row v-if="topActions" class="add-button-wrapper" type="flex" justify="start">
      <Button v-if="actions.add" type="primary" @click="$emit('showEditModal')">新增</Button>
      <Button v-if="actions.export" type="primary" @click="exportData">导出</Button>
      <Button v-if="actions.import" type="primary" @click="importData">导入</Button>
      <Button v-if="actions.batchRemove" type="primary" @click="batchRemove">批量删除</Button>
      <Button v-if="actions.batchEdit" type="primary" @click="batchEdit">批量修改</Button>
    </Row>

    <ive-import-data
      v-if="actions.import"
      :importModal="importModal"
      :importApi="importApi"
      @upload-success="uploadSuccess"
      @close="handleClose"
    />
    
    <Table border ref="table" :columns="(actions.export || actions.batchEdit || actions.batchRemove) ? checkboxColumns : columns" :data="list" :loading="tableLoading" @on-selection-change="changeChoose">
      <template slot-scope="{ row }" slot="action">
        <Button v-if="actions.edit" type="primary" size="small" @click="handleShowEditModal(row)">编辑</Button>
        <Button v-if="actions.remove" type="error" size="small" @click="handleRemove(row)">删除</Button>
      </template>
      <template v-for="(slot, key) in tableSlots" slot-scope="{ row }" :slot="key">
        <slot :name="key" :row="row"></slot>
      </template>
    </Table>

    <ive-page
      :total="pager.count"
      :pageIndex="pager.pageIndex"
      @on-page-size-change="onPageSizeChanged"
      @on-change="onPageChanged"
    />
  </div>
</template>

<script>
import _ from 'lodash';

export default {
  name: 'ive-table',
  props: {
    importApi: {
      type: Function,
    },
    filename: {
      type: String,
      default: '导出数据',
    },
    columns: {
      type: Array,
      default: () => [],
    },
    getListApi: {
      type: Function,
      required: true,
    },
    deleteApi: {
      type: Function,
      default: null,
    },
    actions: {
      type: Object,
      default: () => ({
        add: true,
        edit: true,
        remove: true,
        export: false,
        import: false,
        batchRemove: false,
        batchEdit: false,
      }),
    },
    idKey: {
      type: [String, Number],
      default: '_id',
    },
    deleteKey: {
      type: String,
      default: 'title',
    },
  },
  data() {
    return {
      list: [],
      tableLoading: true,
      queryParams: {},
      selectionData: [],
      importModal: false,
      pager: {
        pageIndex: 1,
        pageSize: 30,
        count: 0,
      },
    }
  },
  computed: {
    tableSlots() {
      const slots = _.cloneDeep(this.$scopedSlots);
      delete slots.topButtons;
      return slots;
    },
    checkboxColumns() {
      const columns = _.cloneDeep(this.columns);
      columns.unshift({type: 'selection', width: 50});
      return columns;
    },
    topActions() {
      return this.actions.add || this.actions.export || this.actions.import;
    },
  },
  mounted() {
    if (this.getListApi) {
      this.getList();
    }
  },
  methods: {
    async getList(queryParams) {
      if (queryParams && queryParams instanceof Object) {
        this.queryParams = { ...queryParams };
      } else {
        queryParams = { ...this.queryParams };
      }

      try {
        this.tableLoading = true;
        const reqParams = {
          pageIndex: this.pager.pageIndex,
          pageSize: this.pager.pageSize,
          ...queryParams,
        };
        const {
          data: {
            data,
            count,
          },
        } = await this.getListApi(reqParams);

        this.tableLoading = false;
        this.list = data;
        this.pager.count = count;
      } catch (e) {
        this.tableLoading = false;
        console.error(e);
        this.$Message.error(e);
      }
    },
    onPageSizeChanged(size) {
      this.pager.pageIndex = 1;
      this.pager.pageSize = size;
      this.getList();
    },
    onPageChanged(index) {
      this.pager.pageIndex = index;
      this.getList();
    },
    handleShowEditModal(row) {
      const id = row[this.idKey] || row.id;
      this.$emit('showEditModal', id, row);
    },
    async remove(confirm, id, row) {
       if (confirm && this.deleteApi && this.deleteApi instanceof Function) {
        try {
          await this.deleteApi(id);
          this.$Message.success('删除成功');
          confirm.remove();
          this.getList();
        } catch (e) {
          confirm.remove();
          console.error(e);
          this.$Message.error(e);
        }
      } else if (confirm) {
        this.$emit('remove', id, confirm, row);
      }
    },
    async handleRemove(row) {
      const id = row[this.idKey] || row.id;
      const title = row[this.deleteKey] || '';
      const confirm = await this.$iveModal.confirm(`确定删除<b>${ title }</b>吗？`);
      this.remove(confirm, id, row);
    },
    changeChoose(selectionData) {
      this.selectionData = selectionData;
    },
    exportData() {
      if (this.selectionData.length === 0) {
        this.$Message.warning('至少选择一条内容导出！')
        return;
      }
      this.$refs.table.exportCsv({
        filename: this.filename,
        columns: this.columns,
        data: this.selectionData,
      });
      this.$refs.table.selectAll(false);
    },
    importData() {
      this.importModal = true;
    },
    handleClose() {
      this.importModal = false;
    },
    uploadSuccess() {
      this.handleClose();
      this.getList();
      this.$emit('upload-success');
    },
    async batchRemove(row) {
      if (this.selectionData.length === 0) {
        this.$Message.warning('至少选择一条内容删除！')
        return;
      }
      const idList = this.selectionData.map(item => item.id);
      const confirm = await this.$iveModal.confirm(`确定删除要这${idList.length}条内容吗？`);
      this.remove(confirm, idList, row);
    },
    batchEdit() {
      if (this.selectionData.length === 0) {
        this.$Message.warning('至少选择一条内容修改！')
        return;
      }
      this.$emit('showBatchEditModal');
    },
  }
};
</script>
