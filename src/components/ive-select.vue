<template>
  <Select
    :value="currentValue"
    :filterable="filterable"
    :multiple="multiple"
    :clearable="clearable"
    :placeholder="placeholder"
    :disabled="disabled"
    :max-tag-count="maxTagCount"
    :max-tag-placeholder="maxTagPlaceholder"
    :placement="placement"
    @input="handleInput"
    @on-query-change="queryChanged"
  >
    <Option
      v-for="(value, key) in options"
      :key="key"
      :value="formatValue(key)"
    >{{ value }}</Option>
  </Select>
</template>
<script>
import _ from 'lodash';

export default {
  name: 'ive-select',
  props: {
    value: {
      default: '',
    },
    options: {
      type: [Array, Object],
      default: () => [],
    },
    filterable: {
      type: Boolean,
      default: false,
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    clearable: {
      type: Boolean,
      default: true,
    },
    placeholder: {
      type: String,
      default: '请选择',
    },
    /**
     * parseIntKey: 是否需要将key转换为整型
     * 当将 id为1(整型), name为'名称' 的数据组合为 options: {1: '名称'} 时
     * id由整型变成了对象options中的字符串，在组件中无法正确被选中
    */
    parseIntKey: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    maxTagCount: {
      type: Number,
    },
    maxTagPlaceholder: {
      type: Function,
    },
    maxTagSelect: {
      type: Number,
    },
    placement: {
      type: String,
      default: 'bottom',
    },
  },
  data() {
    return {
      currentValue: [],
    };
  },
  watch: {
    value: {
      handler(val) {
        this.currentValue = _.cloneDeep(val);
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    queryChanged(e) {
      this.$emit('queryChanged', e);
    },
    formatValue(value) {
      if (this.parseIntKey) {
        value = parseInt(value, 10);
      }
      return value;
    },
    handleInput(e) {
      const { multiple, maxTagSelect: maxTag } = this;
      let { currentValue } = this;
      currentValue = e;
      if (multiple && maxTag && currentValue.length > maxTag) {
        currentValue.length = maxTag;
        this.$Message.warning(`最多可选择${maxTag}条数据`);
      }
      this.$emit('input', currentValue);
    },
  },
};
</script>
