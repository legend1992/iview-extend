# 起步
本项目是基于iview开发，使用前请先在main.js写入语句（使用iview）
```js
import iview from 'iview';
import 'iview/dist/styles/iview.css';
Vue.use(iview);
```
再写入（使用iview-extends2）
```js
import 'iviewExtends2' from 'iview-extends2';
import 'iview-extends2/src/styles/iview-extends2.css';
Vue.use(iviewExtends2);
```
# 配置一个基础的增删改查页面
```html
<template>
  <div>
    <ive-filter-form
      :formConfig="formConfig"
      @query="handleQuery"
    />

    <ive-table
      ref="table"
      :columns="columns"
      :getListApi="getListApi()"
      :deleteApi="deleteApi()"
      @showEditModal="showEditModal"
    />

    <ive-edit-modal
      ref="modal"
      :id="id"
      :modal="modal"
      :formConfig.sync="formConfigEdit"
      :getDetailApi="getDetailApi()"
      :editApi="editApi()"
      @close="hideEditModal"
      @success="editSuccess"
    />
  </div>
</template>
```
```js
<script>
export default {
  name: 'simple-page-demo',
  data() {
    return {
      // ive-filter-form
      formConfig: [
        {
          prop: 'title',
          label: '消息标题',
        },
      ],
      // ive-table
      pager: {
        pageIndex: 1,
        pageSize: 30,
        count: 0,
      },
      columns: [
        {
          title: '消息标题',
          key: 'title',
          minWidth: 120,
        },
        {
          title: '操作',
          slot: 'action',
          align: 'center',
          fixed: 'right',
          minWidth: 130,
        },
      ],
      // ive-edit-modal
      id: '',
      modal: false,
      formConfigEdit: [
        {
          prop: 'title',
          label: '标题',
          required: true,
          itemConfig: {
            props: {
              maxlength: 22,
            },
          },
          rules: [
            {
              validator: function () {},
            },
          ],
        },
      ],
    };
  },
  methods: {
    // ive-filter-form
    handleQuery(queryParams) {
      this.getList(queryParams, 1);
    },
    // ive-table
    getListApi() {
      return axios.getList;
    },
    deleteApi() {
      return axios.delMessage;
    },
    getList(queryParams, pageIndex) {
      this.$refs.table.getList(queryParams, pageIndex);
    },
    // ive-edit-modal
    getDetailApi() {
      return axios.getMessage;
    },
    editApi() {
      return axios.editMessage;
    },
    showEditModal(id) {
      this.id = id;
      this.modal = true;
    },
    hideEditModal() {
      this.modal = false;
      this.id = '';
    },
    editSuccess() {
      this.hideEditModal();
      this.getList();
    },
  },
};
</script>
```