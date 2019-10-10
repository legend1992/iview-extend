<template>
  <vue-context ref="menu" class="ive-contextmenu">
    <li
      v-for="(option, index) in lastOptions"
      :key="option.name"
      @click="onClick(index, option, lastOptions)"
    ><a href="javascript:;">{{ option.name }}</a></li>
  </vue-context>
</template>
<script>
import { VueContext } from 'vue-context';

export default {
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
    open($event, options) {
      this.newOptions = options;
      this.$refs.menu.open($event);
    },
    onClick(index, option, options) {
      if (option.onClick && option.onClick instanceof Function) {
        option.onClick(index, option, options);
      } else {
        this.$emit('click', index, option, options)
      }
    },
  },
};
</script>
