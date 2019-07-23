<template>
  <FormItem
    :key="item.prop"
    :label="item.label"
    :prop="item.prop"
    :rules="item.rules"
  >
    <ive-component
      :tagName="item.itemConfig.tagName"
      :props="item.itemConfig.props"
      :value="value"
      @input="$emit('input', $event)"
    />
    <ive-icon-tooltip v-if="item.tip" :content="item.tip" />
  </FormItem>
</template>
<script>
export default {
  name: "ive-form-item",
  props: {
    value: null,
    item: {
      type: Object,
      required: true,
    }
  },
};
</script>
