<template>
  <Modal
    class="ive-edit-modal"
    :class="{ loading }"
    :value="modal"
    :width="width"
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
      :hideConfig="hideConfigCopy"
      @update:formConfig="$emit('update:formConfig', $event)"
      @update:hideConfig="$emit('update:hideConfig', $event)"
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
import _ from 'lodash';

export default {
  name: 'ive-edit-modal',
  props: {
    width: {
      type: Number,
      default: 570,
    },
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
    hideConfig: {
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
    },
  },
  data() {
    return {
      loading: true,
      submitLoading: false,
      formConfigCopy: _.cloneDeep(this.formConfig),
      hideConfigCopy: _.cloneDeep(this.hideConfig),
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
    },
    hideConfig: {
      handler(e) {
        this.hideConfigCopy = _.cloneDeep(e);
      },
      deep: true,
    },
  },
  created() {
    this.init();
  },
  computed: {
    formSlots() {
      const {
        prepend, append, default: defaulta, ...formSlots
      } = this.$scopedSlots;
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
      }
    },
    async getDetail(id) {
      try {
        this.loading = true;
        const { data: { data } } = await this.getDetailApi(id);
        this.setFormConfig('formConfig', data);
        this.setFormConfig('hideConfig', data);
      } catch (e) {
        this.$Message.error(e);
        throw (e);
      } finally {
        this.loading = false;
      }
    },
    // 设置请求参数
    setReqData(reqData) {
      if (this.id) {
        reqData.id = this.id;
      }

      return reqData;
    },
    setFormConfig(config, data = {}) {
      const configName = `${config}Copy`;
      this[configName] = this[configName].map((item) => {
        const value = data[item.prop];
        if (item.itemConfig && item.itemConfig instanceof Object) {
          item.itemConfig.value = value;
        } else {
          item.itemConfig = {
            value,
          };
        }
        this.$nextTick(() => {
          const { on } = item.itemConfig;
          if (on && on.input && on.input instanceof Function) {
            on.input(value);
          }
        });
        return item;
      });
      this.$emit(`update:${config}`, this[configName]);
    },
    async submit(formModel) {
      try {
        this.submitLoading = true;
        await this.editApi(formModel);
        this.submitLoading = false;
        this.$Message.success('操作成功');
        this.$emit('success', formModel);
      } catch (e) {
        this.submitLoading = false;
        this.$Message.error(e);
      }
    },
    validateField(prop) {
      return this.$refs.baseForm.validateField(prop);
    },
    async handleSubmit() {
      const reqData = await this.$refs.baseForm.getData();
      if (reqData) {
        if (this.editApi) {
          this.submit(this.setReqData(reqData));
        } else {
          this.$emit('submit', reqData);
        }
      }
    },
  },
};
</script>
