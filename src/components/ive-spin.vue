<template>
  <Spin size="large" />
</template>

<script>
export default {
  name: 'ive-spin',
};
</script>
<style lang="scss" scoped>
  .ivu-spin {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    margin: auto;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    z-index: 1;
    background-color: hsla(0,50%,100%,.9);
  }
</style>
