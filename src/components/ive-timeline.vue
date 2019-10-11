<template>
  <Timeline class="ive-timeline">
    <TimelineItem
      v-for="item in items"
      :key="item.create_time"
      :color="colorMap[item.status] || 'gray'"
    >
      <slot name="itemSlot" v-bind="item">{{ item.text }}</slot>
    </TimelineItem>
  </Timeline>
</template>
<script>
export default {
  name: 'ive-timeline',
  props: {
    items: {
      type: Array,
      required: true,
    },
    colorMap: {
      type: [Object, Array],
      default: () => ({
        0: 'gray',
        1: 'orange',
        2: 'green',
        3: 'red',
      }),
    },
  },
}
</script>
