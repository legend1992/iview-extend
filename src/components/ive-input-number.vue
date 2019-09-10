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
    };
  },
  watch: {
    value() {
      this.intValue();
    },
  },
  methods: {
    intParser(value) {
      return this.parseIntValue && value ? `${parseInt(value, 10)}` : value;
    },
    intValue(e) {
      const { value } = this;
      if ((!value && value !== 0) || Number.isNaN(value)) {
        this.cValue = null;
      } else {
        this.cValue = this.parseIntValue ? parseInt(value, 10) : value;
      }
    }
  },
  created() {
    this.intValue();
  },
};
</script>
