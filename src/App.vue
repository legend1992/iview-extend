<template>
  <div class="ui-list">
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
    >
      <template slot="appkey">
        <span slot="prepend">xxx</span>
      </template>
    </ive-edit-modal>
    <Button @click="modal = true">弹窗</Button>
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
          slot: 'appkey',
          itemConfig: {
            tagName: 'ive-input-number',
            props: {
              maxlength: 512,
              parseIntValue: true,
            },
          },
          required: true,
        },
      ],
    };
  },
  methods: {
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
    },
    editSuccess() {
      this.modal = false;
    },
  },
};
</script>

<style lang="scss">
  @import 'styles/iview-extends2';
</style>
