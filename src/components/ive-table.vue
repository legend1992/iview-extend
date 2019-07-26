<template>
  <div class="ive-table">
    <Row v-if="actions.add" class="add-button-wrapper" type="flex" justify="start">
      <Button type="primary" @click="$emit('showEditModal')">新增</Button>
      <slot name="topButtons" />
    </Row>
    <Table border :columns="columns" :data="list" :loading="tableLoading">
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
    async handleRemove(row) {
      const id = row[this.idKey] || row.id;
      const title = row[this.deleteKey] || '';
      const confirm = await this.$iveModal.confirm(`确定删除<b>${ title }</b>吗？`);
      if (confirm && this.deleteApi && this.deleteApi instanceof Function) {
        try {
          await this.deleteApi(id);
          this.$Message.success('删除成功');
          confirm.remove();
          this.getList();
        } catch (e) {
          confirm.remove();
          this.$Message.error(e);
        }
      } else if (confirm) {
        this.$emit('remove', id, confirm, row);
      }
    },
  }
};
</script>
