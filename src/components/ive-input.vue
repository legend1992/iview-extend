<template>
  <Input
    :value="value"
    :placeholder="placeholder"
    :maxlength="maxlength"
    :type="formatType"
    :disabled="disabled"
    @input="$emit('input', $event)"
    @on-blur="handleBlur"
  />
</template>
<script>
export default {
  name: 'ive-input',
  props: {
    value: {
      type: [String, Number],
      default: '',
    },
    placeholder: {
      type: String,
      default: '请输入内容',
    },
    maxlength: {
      type: Number,
      default: 128,
    },
    type: {
      type: String,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    formatType() {
      return this.type === 'letter' ? undefined : this.type;
    },
  },
  methods: {
    handleBlur() {
      let newValue = this.value && this.value.trim();
      if (this.type === 'letter') {
        newValue = newValue.replace(/[^a-zA-Z]/g, '');
      }
      this.$emit('on-blur', newValue);
      this.$emit('input', newValue);
    },
  },
};
</script>
