<template>
  <Select
    :value="value"
    :filterable="filterable"
    :multiple="multiple"
    :clearable="clearable"
    :placeholder="placeholder"
    @input="$emit('input', $event)"
    @on-query-change="queryChanged"
  >
    <Option
      v-for="(value, key) in formatOptions"
      :key="key"
      :value="parseIntValue(value, key)"
    >{{value}}</Option>
  </Select>
</template>
<script>
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
      default: false,
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
  },
  computed: {
    formatOptions() {
      let options = {};
      /* 当this.options为数组时，将其转换为object，以在模板中统一 */
      if (this.options instanceof Array) {
        this.options.forEach((option) => {
          options[option] = option;
        });
      } else {
        options = { ...this.options };
      }

      return options;
    },
  },
  methods: {
    queryChanged(e) {
      this.$emit('queryChanged', e);
    },
    parseIntValue(value, key) {
      let newKey = key;
      if (this.options instanceof Array) {
        newKey = value;
      } else if (this.parseIntKey) {
        newKey = parseInt(key, 10);
      }
      return newKey;
    },
  },
};
</script>
