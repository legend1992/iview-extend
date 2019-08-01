<template>
  <CheckboxGroup :value="value" @input="$emit('input', $event)">
    <Checkbox v-for="(oValue, key) in options" :key="oValue" :label="formatLabel(key)">{{ oValue }}</Checkbox>
  </CheckboxGroup>
</template>
<script>
export default {
  name: 'ive-checkbox-group',
  props: {
    value: {
      type: Array,
      default: () => [],
    },
    options: {
      type: [Array, Object],
      default: () => ({}),
    },
    parseIntKey: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    formatLabel(value) {
      if (this.parseIntKey) {
        value = parseInt(value, 10);
      }
      return value;
    },
  },
}
</script>

