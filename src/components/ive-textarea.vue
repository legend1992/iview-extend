<template>
  <Input
    :value="value"
    type="textarea"
    :autosize="autosize"
    :placeholder="placeholder"
    :maxlength="maxlength"
    :disabled="disabled"
    @input="$emit('input', $event)"
    @on-blur="handleBlur"
  />
</template>
<script>
export default {
  name: 'ive-textarea',
  props: {
    value: {
      type: [String, Number],
      default: '',
    },
    autosize: {
      type: Object,
      default: () => ({
        minRows: 2,
        maxRows: 5,
      }),
    },
    placeholder: {
      type: String,
      default: '请输入内容',
    },
    maxlength: {
      type: Number,
      default: 255,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    handleBlur() {
      const newValue = this.value && this.value.trim();
      this.$emit('on-blur', this.value);
      this.$emit('input', newValue);
    },
  },
};
</script>
