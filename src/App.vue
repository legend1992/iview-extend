<template>
  <div id="app">
    <BaseFormFilter
      :formConfig="formConfig"
      @query="handleQuery"
    />

    <!-- <BaseForm
      ref="baseForm"
      :formConfig="formConfig"
    /> -->
  </div>
</template>

<script>
export default {
  name: 'app',
  data() {
    return {
      formConfig: [
        {
          prop: 'Name',
          label: '成语名',
          itemConfig: {
            props: {
              maxlength: 20,
            },
          },
        }, 
        {
          prop: 'Antonym',
          label: '反义词',
        },
        {
          prop: 'Construction',
          label: '造句',
        },
        {
          prop: 'Allusion',
          label: '典故',
        },
        {
          prop: 'Source',
          label: '出处',
        },
        {
          prop: 'Label',
          label: '标签',
        },
      ],
    }
  },
  methods: {
    handleQuery(e) {
      console.log(e)
    }
  }
}
</script>
