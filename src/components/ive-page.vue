<template>
  <Row class="ive-pager" type="flex" justify="end">
    <Page
      :total="total"
      :current="pageIndex"
      :page-size="pageSize"
      :page-size-opts="pageSizeOpts"
      :show-total="showTotal"
      :show-elevator="showElevator"
      :show-sizer="showSizer"
      @on-page-size-change="$emit('on-page-size-change', $event)"
      @on-change="$emit('on-change', $event)"/>
  </Row>
</template>
<script>
export default {
  name: 'ive-page',
  props: {
    total: {
      type: Number,
      default: null,
    },
    pageIndex: {
      type: Number,
      default: 1,
    },
    pageSize: {
      type: Number,
      default: 30,
    },
    pageSizeOpts: {
      type: Array,
      default: () => [30, 50, 100],
    },
    showTotal: {
      type: Boolean,
      default: true,
    },
    showElevator: {
      type: Boolean,
      default: true,
    },
    showSizer: {
      type: Boolean,
      default: true,
    },
  },
};
</script>
