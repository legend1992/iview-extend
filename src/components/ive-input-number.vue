<template>
  <InputNumber
    :max="max"
    :min="min"
    :step="step"
    :value="cValue"
    :placeholder="placeholder"
    :formatter="formatter"
    :parser="parser || intParser"
    @input="$emit('input', $event)"
  />
</template>
<script>
export default {
  name: 'ive-input-number',
  props: {
    value: {
      default: null,
    },
    max: {
      type: Number,
      default: Infinity,
    },
    min: {
      type: Number,
      default: -Infinity,
    },
    placeholder: {
      type: String,
      default: '请输入数字',
    },
    parseIntValue: {
      type: Boolean,
      default: false,
    },
    step: {
      type: Number,
      default: 1,
    },
    formatter: {
      type: Function,
    },
    parser: {
      type: Function,
    },
  },
  data() {
    return {
      cValue: null,
    }
  },
  watch: {
    value(value) {
      if (!value && value !== 0 || isNaN(value)) {
        this.cValue = null;
      } else {
        this.cValue = value;
      }
    },
  },
  methods: {
    intParser(value) {
      return this.parseIntValue ? parseInt(value, 10) + '' : value;
    },
  },
};
</script>
