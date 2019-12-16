<template>
  <Breadcrumb class="ive-bread-crumb">
    <BreadcrumbItem v-for="title in titleList" :key="title">{{title}}</BreadcrumbItem>
  </Breadcrumb>
</template>

<script>
export default {
  name: 'ive-bread-crumb',
  props: {
    titleList: {
      type: Array,
      default() {
        const titleList = [];
        this.$route && this.$route.matched.forEach((route) => {
          titleList.push(route.meta.title || route.path);
        });
        return titleList;
      }
    }
  },
};
</script>
