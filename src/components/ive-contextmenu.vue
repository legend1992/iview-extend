<template>
  <vue-context-menu
    ref="menu"
    class="ive-contextmenu"
    @ctx-cancel="$emit('cancel')"
    @ctx-close="$emit('close')"
  >
    <li
      v-for="(option, index) in lastOptions"
      :key="option.name"
      @click="onClick(index, option)"
    ><a href="javascript:;">{{ option.name }}</a></li>
  </vue-context-menu>
</template>
<script>
import vueContextMenu from 'vue-context-menu';

export default {
  name: 'ive-contextmenu',
  props: {
    options: {
      type: Array,
      required: true,
    },
  },
  components: {
    vueContextMenu,
  },
  data() {
    return {
      newOptions: null,
      menuData: null,
    };
  },
  computed: {
    lastOptions() {
      const { newOptions, options } = this;
      return newOptions || options;
    },
  },
  methods: {
    /**
     * @param { Event } $event 用来给contextmenu定位
     */
    open($event, data, options) {
      this.newOptions = options;
      this.$refs.menu.open($event, data);
      this.menuData = data;
    },
    onClick(index, option) {
      const { menuData } = this;
      if (option.onClick && option.onClick instanceof Function) {
        option.onClick(menuData, index);
      } else {
        this.$emit('click', menuData, index, option);
      }
    },
  },
};
</script>
