<template>
  <div>
    <Row type="flex" justify="space-between">
      <Button type="primary" @click="modal = true">新增</Button>
    </Row>
    <Table border :columns="columns" :data="list" :loading="tableLoading">
      <template slot-scope="{ row }" slot="action">
        <Button type="primary" size="small" @click="$emit('showEditModal', row._id)">编辑</Button>
        <Button type="error" size="small" @click="remove(row._id, row.Name)">删除</Button>
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
export default {
  name: 'ive-table',
  props: {
    columns: {
      type: Array,
      default: () => [],
    },
    queryParams: {
      type: Object,
      default: () => ({}),
    },
    getListApi: {
      type: Function,
      default: null,
    }
  },
  data() {
    return {
      list: [],
      tableLoading: true,
      pager: {
        pageIndex: 1,
        pageSize: 30,
        count: 0,
      },
    }
  },
  created() {
    if (this.getListApi) {
      this.getList();
    }
  },
  methods: {
    async getList() {
      try {
        this.tableLoading = true;
        const reqParams = {
          pageIndex: this.pager.pageIndex,
          pageSize: this.pager.pageSize,
          ...this.queryParams,
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
    async remove(id, Title) {
      const confirm = await this.$promiseModal.confirm(`确定删除《${Title}》吗？`);
      if (confirm) {
        try {
          await this.deleteApi()(id);
          this.$Message.success('删除成功');
          confirm.remove();
          this.getList();
        } catch (e) {
          confirm.remove();
          this.$Message.error(e);
        }
      }
    },
  }
};
</script>
<style lang="scss" scoped>
</style>
