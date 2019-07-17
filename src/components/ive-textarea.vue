<template>
  <Input :value="value" @input="$emit('input', $event)" type="textarea" :autosize="autosize" :placeholder="placeholder"/>
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
  },
};
</script>
