<template>
  <RadioGroup :value="value" @input="$emit('input', $event)">
    <Radio
      v-for="(value, key) in formatOptions"
      :key="key"
      :label="label(value, key)"
    >{{ value }}</Radio>
  </RadioGroup>
</template>
<script>
export default {
  name: 'ive-radio',
  props: {
    value: {
      default: '',
    },
    options: {
      type: [Array, Object],
      default: () => [],
    },
    /**
     * parseIntKey: 是否需要将key转换为整型
     * 当将 id为1(整型), name为'名称' 的数据组合为 options: {1: '名称'} 时
     * id由整型变成了对象options中的字符串，在radio组件中无法正确被选中
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
    label(value, key) {
      let label = key;
      if (this.options instanceof Array) {
        label = value;
      } else if (this.parseIntKey) {
        label = parseInt(key, 10);
      }
      return label;
    },
  },
};
</script>
