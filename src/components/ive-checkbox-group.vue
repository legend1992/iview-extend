<template>
  <CheckboxGroup :value="value" @input="$emit('input', $event)">
    <Checkbox v-for="(oValue, key) in options" :key="oValue" :label="key">{{ oValue }}</Checkbox>
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
  },
}
</script>

