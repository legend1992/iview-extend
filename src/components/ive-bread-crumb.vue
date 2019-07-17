<template>
  <Breadcrumb>
    <BreadcrumbItem v-for="title in titleList" :key="title">{{title}}</BreadcrumbItem>
  </Breadcrumb>
</template>

<script>
export default {
  name: 'ive-bread-crumb',
  computed: {
    titleList() {
      const titleList = [];
      this.$route.matched.forEach((route) => {
        if (route.meta && route.meta.title) {
          titleList.push(route.meta.title);
        }
      });
      return titleList;
    },
  },
};
</script>
<style lang="scss" scoped>
 .ivu-breadcrumb {
    padding: 0 24px;
    margin: 12px 0;
  }
</style>
