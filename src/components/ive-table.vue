<template>
  <div>
    <Row v-if="actions.add" type="flex" justify="end">
      <Button type="primary" @click="$emit('showEditModal')">新增</Button>
    </Row>
    <Table border :columns="columns" :data="list" :loading="tableLoading">
      <template slot-scope="{ row }" slot="action">
        <Button v-if="actions.edit" type="primary" size="small" @click="$emit('showEditModal', row)">编辑</Button>
        <Button v-if="actions.remove" type="error" size="small" @click="remove(row)">删除</Button>
      </template>
      <template v-for="(slot, key) in $scopedSlots" slot-scope="{ row }" :slot="key">
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
  mounted() {
    if (this.getListApi) {
      this.getList();
    }
    if (this.actions.remove && !this.deleteApi && !(this.deleteApi instanceof Function)) {
      console.error('请传入deleteApi，且必须为函数');
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
    async remove({ id }) {
      const confirm = await this.$iveModal('确定删除吗？');
      if (confirm) {
        try {
          await this.deleteApi(id);
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
.ivu-btn {
  margin-right: 5px;
  &:last-child {
      margin-right: 0;
  }
}
</style>
