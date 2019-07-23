<template>
  <Tooltip class="ive-tooltip" ref="tooltip" :content="content" theme="light" placement="top">
    <Icon type="ios-information-circle" />
  </Tooltip>
</template>
<script>
export default {
  name: 'ive-icon-tooltip',
  props: {
    content: {
      type: String,
      default: '请输入提示语',
    },
  },
};
</script>
