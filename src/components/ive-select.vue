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
      :value="key"
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
  },
};
</script>
