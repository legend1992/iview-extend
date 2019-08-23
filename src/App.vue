<template>
  <div class="ui-list">
    <ive-edit-modal
      ref="modal"
      :id="id"
      :modal="modal"
      :labelWidth="110"
      title="配置详情"
      :formConfig.sync="formConfigEdit"
      :getDetailApi="getDetailApi()"
      :editApi="editApi()"
      @close="hideEditModal"
      @success="editSuccess"
    >
      <template slot="appkey">
        <span slot="prepend">xxx</span>
        <Button type="error" slot="append" @click="xxx">button</Button>
      </template>
    </ive-edit-modal>
    <Button @click="modal = true">弹窗</Button>
    <Table border :columns="columns12" :data="data6">
      <template slot-scope="{ row }" slot="name">
        <strong>{{ row.name }}</strong>
      </template>
      <template slot-scope="{ row, index }" slot="action">
        <Button type="primary" size="small" style="margin-right: 5px" @click="show(index)">View</Button>
        <Button type="error" size="small" @click="remove(index)">Delete</Button>
      </template>
    </Table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      id: '',
      modal: false,
      formConfigEdit: [
        {
          prop: 'appkey',
          label: '端appkey',
          itemConfig: {
            tagName: 'ive-date-picker',
            props: {
              maxlength: 512,
              parseIntValue: true,
            },
          },
          required: true,
        },
      ],
      columns12: [
        {
          title: 'Name',
          slot: 'name'
        },
        {
          title: 'Age',
          key: 'age'
        },
        {
          title: 'Address',
          key: 'address'
        },
        {
          title: 'Action',
          slot: 'action',
          width: 150,
          align: 'center'
        }
      ],
      data6: [
        {
          name: 'John Brown',
          age: 18,
          address: 'New York No. 1 Lake Park'
        },
        {
          name: 'Jim Green',
          age: 24,
          address: 'London No. 1 Lake Park'
        },
        {
          name: 'Joe Black',
          age: 30,
          address: 'Sydney No. 1 Lake Park'
        },
        {
          name: 'Jon Snow',
          age: 26,
          address: 'Ottawa No. 2 Lake Park'
        }
      ]
    };
  },
  methods: {
    xxx() {
      console.log('xxx click')
    },
    getDetailApi() {
      return (id) => {
        return {
          data: {
            data: this.tableData.filter((item) => item.id === id)[0],
          },
        };
      };
    },
    editApi() {
      return () => {};
    },
    showEditModal(a, b) {
      this.modal = true;
      this.id = a;
    },
    hideEditModal() {
      this.modal = false;
      const xxx = this.$refs.modal.$refs.baseForm.getData(false);
      console.log(xxx);
    },
    editSuccess() {
      this.modal = false;
    },
  },
};
</script>

<style lang="scss">
@import "styles/iview-extends2";
</style>
