<template>
  <Input :value="value" @input="$emit('input', $event)" type="textarea" :autosize="autosize" :placeholder="placeholder" :maxlength="maxlength"/>
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
      default: 200,
    },
  },
};
</script>
