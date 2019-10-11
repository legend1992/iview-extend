<template>
  <vue-context ref="menu" class="ive-contextmenu" :close-on-scroll="true">
    <template slot-scope="child">
      <li
        v-for="(option, index) in lastOptions"
        :key="option.name"
        @click="onClick(index, option, child.data)"
      ><a href="javascript:;">{{ option.name }}</a></li>
    </template>
  </vue-context>
</template>
<script>
import { VueContext } from 'vue-context';

export default {
  name: 'ive-contextmenu',
  props: {
    options: {
      type: Array,
      required: true,
    },
  },
  components: {
    VueContext,
  },
  data() {
    return {
      newOptions: null,
    };
  },
  computed: {
    lastOptions() {
      const { newOptions, options } = this;
      return newOptions || options;
    },
  },
  methods: {
    open($event, data, options) {
      this.newOptions = options;
      this.$refs.menu.open($event, data);
    },
    onClick(index, option, data) {
      if (option.onClick && option.onClick instanceof Function) {
        option.onClick(data, index);
      } else {
        this.$emit('click', data, index, option);
      }
    },
  },
};
</script>
