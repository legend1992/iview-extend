<template>
  <div class="ui-list">
    <ive-filter-form
      @query="query"
      :formConfig="formConfig"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      formConfig: [
        {
          prop: 'x1',
          label: 'x1',
        }
      ]
    };
  },
  methods: {
    query(e) {
      console.log(e);
    },
  },
};
</script>

<style>
@import "styles/iview-extends2.css";
</style>
