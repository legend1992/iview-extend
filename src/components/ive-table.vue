<template>
  <div class="ive-table">
    <Row v-if="topActions" class="top-button-wrapper" type="flex" justify="start">
      <Button v-if="actions.add" type="primary" @click="$emit('showEditModal')">新增</Button>
      <Button
        v-if="actions.export"
        type="primary"
        :disabled="batchDisabled"
        @click="exportData">批量导出
      </Button>
      <Button v-if="actions.exportAll" type="primary" @click="loadingMessage">
        <a :href="queryParamsChange" target="_blank">全部导出</a>
      </Button>
      <Button v-if="actions.import" type="primary" @click="importData">导入</Button>
      <Button
        v-if="actions.batchRemove"
        :disabled="batchDisabled"
        type="primary"
        @click="batchRemove">批量删除
      </Button>
      <Button
        v-if="actions.batchEdit"
        :disabled="batchDisabled"
        type="primary"
        @click="batchEdit">批量修改
      </Button>
    </Row>

    <ive-import-data
      v-if="actions.import"
      :modal="importModal"
      :importApi="importApi"
      @upload-success="uploadSuccess"
      @close="handleClose"
    />

    <Table
      border
      ref="table"
      :columns="formatColumns"
      :data="list"
      :loading="tableLoading"
      @on-selection-change="changeChoose"
    >
      <template slot-scope="{ row }" slot="action">
        <Button
          v-if="actions.edit"
          type="primary"
          size="small"
          @click="handleShowEditModal(row)">
          编辑
        </Button>
        <Button
          v-if="actions.remove"
          type="error"
          size="small"
          @click="handleRemove(row)">
          删除
        </Button>
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
      required: true,
    },
    exportColumns: {
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
        exportAll: false,
        import: false,
        batchRemove: false,
        batchEdit: false,
      }),
    },
    idKey: {
      type: [String, Number],
      default: '_id',
    },
    exportAllUrl: {
      type: String,
      // eslint-disable-next-line no-script-url
      default: 'javascript:;',
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
    };
  },
  computed: {
    tableSlots() {
      const slots = _.cloneDeep(this.$scopedSlots);
      delete slots.topButtons;
      return slots;
    },
    checkboxColumns() {
      const columns = _.cloneDeep(this.columns);
      columns.unshift({ type: 'selection', width: 50 });
      return columns;
    },
    formatColumns() {
      const { actions, checkboxColumns, columns } = this;
      const { export: exportAlias, batchEdit, batchRemove } = actions;
      return (exportAlias || batchEdit || batchRemove) ? checkboxColumns : columns;
    },
    topActions() {
      const { actions } = this;
      return Object.keys(actions).map(key => actions[key]).some(item => item);
    },
    batchDisabled() {
      return this.selectionData.length < 1;
    },
    queryParamsChange() {
      const query = this.queryParams;
      const queryKey = Object.keys(query).filter(key => query[key] !== '' && query[key] !== undefined && query[key] !== null);
      const queryUrl = queryKey.reduce((acc, currVal, currentIndex) => {
        const connector = currentIndex ? '&' : '?';
        return `${acc + connector + currVal}=${encodeURI(query[currVal])}`;
      }, this.exportAllUrl);
      return queryUrl;
    },
  },
  mounted() {
    if (this.getListApi) {
      this.getList();
    }
  },
  methods: {
    async getList(queryParams, pageIndex) {
      this.selectionData = [];
      if (queryParams && queryParams instanceof Object) {
        this.queryParams = { ...queryParams };
      } else {
        queryParams = { ...this.queryParams };
      }
      if (pageIndex) {
        this.pager.pageIndex = pageIndex;
      }

      try {
        this.tableLoading = true;
        const reqParams = {
          pageIndex: this.pager.pageIndex,
          pageSize: this.pager.pageSize,
          ...queryParams,
        };
        const {
          data: { data, count },
        } = await this.getListApi(reqParams);

        this.tableLoading = false;
        this.list = data;
        this.pager.count = count;
      } catch (e) {
        this.tableLoading = false;
        this.$Message.error(e);
        throw (e);
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
          this.$emit('remove-success', id);
        } catch (e) {
          confirm.remove();
          this.$Message.error(e);
          throw (e);
        }
      } else if (confirm) {
        this.$emit('remove', id, confirm, row);
      }
    },
    async handleRemove(row) {
      const id = row[this.idKey] || row.id;
      const title = row[this.deleteKey] || id;
      const confirm = await this.$iveModal.confirm(
        `确定删除<b>${title}</b>吗？`,
      );
      this.remove(confirm, id, row);
    },
    changeChoose(selectionData) {
      this.selectionData = selectionData;
    },
    async exportData() {
      const exportColumsList = this.exportColumns.length === 0 ? this.columns : this.exportColumns;
      this.$refs.table.exportCsv({
        filename:
        this.filename,
        columns: exportColumsList,
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
    uploadSuccess(resData) {
      this.handleClose();
      this.getList();
      this.$emit('upload-success', resData);
    },
    async batchRemove() {
      const idList = this.selectionData.map(item => item.id);
      const confirm = await this.$iveModal.confirm(
        `确定删除要这${idList.length}条内容吗？`,
      );
      this.remove(confirm, idList);
    },
    batchEdit() {
      const { selectionData } = this;
      if (selectionData.length === 1) {
        this.handleShowEditModal(selectionData[0]);
      } else {
        this.$emit('showBatchEditModal', selectionData);
      }
    },
    loadingMessage() {
      this.$Message.loading({
        content: '下载文件内容太大请耐心等待...',
        duration: 5,
      });
    },
  },
};
</script>
