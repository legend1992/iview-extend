<template>
  <InputNumber
    :max="max"
    :min="min"
    :value="cValue"
    :placeholder="placeholder"
    @input="$emit('input', $event)"
  />
</template>
<script>
export default {
  name: 'ive-input-number',
  props: {
    value: null,
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
  },
  data() {
    return {
      cValue: null,
    };
  },
  watch: {
    value(value) {
      if (!value && value !== 0 && isNaN(value)) {
        this.cValue = null;
      } else {
        this.cValue = value;
      }
    },
  },
};
</script>
