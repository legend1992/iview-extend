<template>
  <Input :value="value" @input="$emit('input', $event)" type="textarea" :autosize="autosize" :placeholder="placeholder"/>
</template>
<script>
export default {
  name: 'BaseTextarea',
  props: {
    value: {
      type: String,
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
