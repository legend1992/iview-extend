<template>
  <Modal
    :value="modal"
    :mask-closable="false"
    :title="title"
    @on-cancel="$emit('close')"
  >
    <span v-show="loading && id"><ive-spin /></span>
    <Icon slot="close" type="ios-close"/>

    <slot name="prepend" />
    <ive-edit-form
      ref="baseForm"
      :labelWidth="labelWidth"
      :formConfig="formConfigCopy"
      @update:formConfig="$emit('update:formConfig', $event)"
    >
      <template v-for="(slot, key) in formSlots" :slot="key">
        <slot :name="key" />
      </template>
    </ive-edit-form>
    <slot />
    <slot name="append" />

    <div slot="footer">
      <Button @click="$emit('close')">取消</Button>
      <Button type="primary" @click="handleSubmit()" :loading="submitLoading">确定</Button>
    </div>
  </Modal>
</template>

<script>
import _ from "lodash";

export default {
  name: 'ive-edit-modal',
  props: {
    id: {
      type: [String, Number],
      default: '',
    },
    modal: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '编辑弹框',
    },
    formConfig: {
      type: Array,
      default: () => [],
    },
    getDetailApi: {
      type: Function,
      default: null,
    },
    editApi: {
      type: Function,
      default: null,
    },
    labelWidth: {
      type: Number,
      default: 80,
    }
  },
  data() {
    return {
      loading: true,
      submitLoading: false,
      formConfigCopy: _.cloneDeep(this.formConfig),
    };
  },
  watch: {
    modal(modal) {
      if (!modal) {
        this.reset();
      } else {
        this.init();
      }
    },
    formConfig: {
      handler(e) {
        this.formConfigCopy = _.cloneDeep(e);
      },
      deep: true,
    }
  },
  created() {
    this.init();
  },
  computed: {
    formSlots() {
      let { prepend, append, default: defaulta, ...formSlots } = this.$scopedSlots;
      return formSlots;
    },
  },
  methods: {
    reset() {
      this.$refs.baseForm.reset();
    },
    async init() {
      if (this.id && this.getDetailApi) {
        await this.getDetail(this.id);
        this.loading = false;
      } else {
        this.loading = false;
      }
    },
    async getDetail(id) {
      try {
        this.loading = true;
        const { data: { data } } = await this.getDetailApi(id);
        this.setFormConfig(data);
      } catch (e) {
        this.$Message.error(e);
      }
    },
    // 设置请求参数
    setReqData(reqData) {
      if (this.id) {
        reqData.id = this.id;
      }

      return reqData;
    },
    setFormConfig(data = {}) {
      this.formConfigCopy = this.formConfigCopy.map((item) => {
        if (item.itemConfig && item.itemConfig instanceof Object) {
          item.itemConfig.value = data[item.prop];
        } else {
          item.itemConfig = {
            value: data[item.prop]
          };
        }
        return item;
      });
      this.$emit('update:formConfig', this.formConfigCopy);
    },
    async submit(formModel) {
      try {
        this.submitLoading = true;
        await this.editApi(formModel);
        this.submitLoading = false;
        this.$Message.success('操作成功');
        this.$emit('success');
      } catch (e) {
        this.submitLoading = false;
        this.$Message.error(e);
      }
    },
    validateField(prop) {
      return this.$refs.baseForm.validateField(prop);
    },
    handleSubmit() {
      if (this.editApi) {
        const reqData = this.$refs.baseForm.getData();
        if (reqData) {
          this.submit(this.setReqData(reqData));
        }
      } else {
        this.$emit('close');
      }
    },
  },
};
</script>
