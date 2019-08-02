<template>
  <div class="ui-list">
    <ive-filter-form
      :formConfig="formConfig"
      @query="handleQuery"
    />

    <ive-table
      ref="table"
      :columns="columns"
      :getListApi="getListApi()"
      deleteKey="appkey"
      @showEditModal="showEditModal"
      @remove="handleRemove"
    >
      <template slot="topButtons">
        <Button @click="showEditModal">导入</Button>
        <Button>导出</Button>
      </template>
    </ive-table>

    <ive-edit-modal
      :id="id"
      :modal="modal"
      :labelWidth="110"
      title="配置详情"
      :formConfig.sync="formConfigEdit"
      :getDetailApi="getDetailApi()"
      :editApi="editApi()"
      @close="hideEditModal"
      @success="editSuccess"
    />
    
    <ive-upload
      action="//jsonplaceholder.typicode.com/posts/"
      accept="image/gif, image/jpeg"
      name="name"
      :data="uploadData"
    />

    <ive-spin v-if="false" />

    <ive-edit-form
      ref="baseForm"
      :labelWidth="110"
      :formConfig.sync="formConfigEdit"
    >
    </ive-edit-form>

    <ive-radio />
    <ive-select :value="2" :options="options" :parseIntKey="true"/>
    <ive-checkbox-group v-model="checkboxValue" :options="options1" />
    <Button @click="getCheckBoxValue">获取checkbox值</Button>
    <Button @click="remove">删除测试</Button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      checkboxValue: [0],
      options: {
        0: 'xxx',
        1: 'yyy',
      },
      options1: [0,1,2],
      uploadData: {
        xxx: false,
      },
      id: '',
      modal: false,
      formConfig: [
        {
          prop: 'appkey',
          label: '端appkey',
          itemConfig: {
            props: {
              maxlength: 20,
            },
          },
        },
        {
          prop: 'domain',
          label: '领域名',
          itemConfig: {
            tagName: 'ive-date-range-picker',
            props: {
              // disabledDate: null,
            },
          },
        },
        {
          prop: 'intent',
          label: '意图名',
          itemConfig: {
            tagName: 'ive-date-picker',
            props: {
              type: 'datetime',
              disabledDate: new Date('2019-07-28'),
            },
          },
        },
        {
          prop: 'baseType',
          label: '基础类型',
          tip: '模糊匹配',
          itemConfig: {
            tagName: 'ive-select',
            props: {
              // multiple: true,
              options: {
                0: 'xxx',
                1: 'yyy',
              },
              parseIntKey: true,
            },
          },
        },
        {
          prop: 'templateId',
          label: '模板Id',
        },
      ],
      columns: [
        {
          title: 'id',
          key: 'id',
          minWidth: 100,
        },
        {
          title: 'appkey',
          key: 'appkey',
          minWidth: 100,
        },
        {
          title: '领域名',
          key: 'domain',
          minWidth: 100,
        },
        {
          title: '意图名',
          key: 'intent',
          minWidth: 100,
        },
        {
          title: '基础类型',
          key: 'baseType',
          minWidth: 100,
        },
        {
          title: '模板id',
          key: 'templateId',
          minWidth: 100,
        },
        {
          title: '模板web化Url',
          key: 'templateUrl',
          minWidth: 200,
        },
        {
          title: '操作',
          slot: 'action',
          align: 'center',
          fixed: 'right',
          minWidth: 150,
        },
      ],
      formConfigEdit: [
        {
          prop: 'appkey',
          label: '端appkey',
          itemConfig: {
            props: {
              maxlength: 512,
            },
          },
          required: true,
        },
        {
          prop: 'domain',
          label: '领域名',
          tip: '模糊匹配',
          itemConfig: {
            props: {
              maxlength: 64,
            },
          },
          required: true,
        },
        {
          prop: 'intent',
          label: '意图名',
          itemConfig: {
            props: {
              maxlength: 128,
            },
          },
          required: true,
        },
        {
          prop: 'baseType',
          label: '基础类型',
          itemConfig: {
            props: {
              maxlength: 32,
            },
          },
          required: true,
        },
        {
          prop: 'isChoose',
          label: '使用web化的模板',
          itemConfig: {
            tagName: 'ive-radio',
            value: '',
            props: {
              options: {
                1: '是',
                2: '否',
              },
              parseIntKey: true,
            },
            on: {
              input: (e) => {
                console.log(e)
              },
            },
          },
        },
        {
          prop: 'templateId',
          label: '模板Id',
          itemConfig: {
            tagName: 'ive-select',
            value: 0,
            props: {
              options: {
                0: 'xxx',
                1: 'yyy',
              },
              // options: [1,2,3],
              parseIntKey: true,
            },
            on: {
              input: (e) => {
                console.log(e);
                if (e === '1') {
                  this.formConfigEdit[4].itemConfig.props.disabled = true;
                  this.formConfigEdit[4].inlineTip = '该模板未web化';
                } else {
                  this.formConfigEdit[4].itemConfig.props.disabled = false;
                }
              },
            },
          },
          required: true,
        },
        {
          prop: 'templateUrl',
          label: '模板web化url',
          itemConfig: {
            props: {
              disabled: false,
            },
          },
        },
      ],
      tableData: [{"id":10,"appkey":"5","domain":"5","intent":"5","baseType":"5","templateId":"23","templateUrl":"a"},{"id":9,"appkey":"4","domain":"4","intent":"4","baseType":"4","templateId":"11111","templateUrl":"3"},{"id":8,"appkey":"33","domain":"33","intent":"33","baseType":"33","templateId":"222323wefw","templateUrl":"www.baidu.com"}],
    };
  },
  methods: {
    getCheckBoxValue() {
      console.log(this.checkboxValue)
    },
    handleQuery(e) {
      console.log(e);
    },
    getListApi() {
      return () => {
        return {
          data: {
            data: this.tableData,
          },
        };
      };
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
      console.log(a, b);
      this.modal = true;
      this.id = a;
    },
    hideEditModal() {
      this.modal = false;
    },
    editSuccess() {
      this.modal = false;
    },
    handleRemove(a, b, c) {
      console.log(a, b, c);
      setTimeout(() => {
        b.remove();
      }, 2000);
    },
    handleUpload() {
      console.log('upload')
    },
    handleError($event) {
      console.log($event)
    },
    handleProgress($event) {
      console.log($event)
    },
    handleSuccess($event) {
      console.log($event)
    },
    remove() {
      this.$iveModal.confirm('xxx');
    }
  },
};
</script>

<style lang="scss">
  @import 'styles/iview-extends2';
</style>
