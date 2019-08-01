<template>
  <CheckboxGroup v-if="optionsLength" :value="value" @input="$emit('input', $event)">
    <Checkbox v-for="(oValue, key) in options" :key="oValue" :label="formatLabel(key)">{{ oValue }}</Checkbox>
  </CheckboxGroup>
  <span v-else class="ive-no-data">{{ noDataMessage }}</span>
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
    noDataMessage: {
      type: String,
      default: '无可选数据',
    },
  },
  computed: {
    optionsLength() {
      let length = 0;
      if (this.options instanceof Array) {
        length = this.options.length;
      } else {
        length = Object.keys(this.options).length;
      }
      return length;
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

