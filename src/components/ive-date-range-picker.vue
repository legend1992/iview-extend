<template>
  <div>
    <DatePicker
      type="date"
      :value="value[0]"
      :options="startOptions()"
      :placeholder="placeholder[0]"
      @on-change="change($event, 0)"
    />
    <span class="date-range-separator">-</span>
    <DatePicker
      type="date"
      :value="value[1]"
      :options="endOptions()"
      :placeholder="placeholder[1]"
      @on-change="change($event, 1)"
    />
  </div>
</template>

<script>
export default {
  name: 'ive-date-range-picker',
  props: {
    value: {
      type: Array,
      default: () => [],
    },
    placeholder: {
      type: Array,
      default: () => ['开始日期', '结束日期'],
    },
    disabledDate: {
      default: () => new Date(),
    },
  },
  data() {
    return {
      currentValue: [],
    };
  },
  watch: {
    value(value) {
      this.currentValue = this.$utils._.cloneDeep(value);
    },
  },
  methods: {
    change(e, index) {
      this.currentValue[index] = e;
      this.$emit('input', this.currentValue);
    },
    startOptions() {
      return {
        disabledDate: (date) => {
          let disabledDate = date;
          if (date) {
            const value = date && date.valueOf();
            const minValue = new Date(this.currentValue[1]);
            disabledDate = value > minValue || value > this.disabledDate;
          }

          return disabledDate;
        },
      };
    },
    endOptions() {
      return {
        disabledDate: (date) => {
          let disabledDate = date;
          if (date) {
            const value = date && date.valueOf();
            const maxValue = new Date(this.currentValue[0]) - 86400000;
            disabledDate = value < maxValue || value > this.disabledDate;
          }

          return disabledDate;
        },
      };
    },
  },
};
</script>
<style lang='scss' scoped>
.separator {
  margin: 0 10px;
}
</style>
