<template>
  <div>
    <DatePicker
      type="date"
      :value="value[0]"
      :options="options1()"
      :placeholder="placeholder[0]"
      @on-change="change($event, 0)"
    />
    <span class="separator">-</span>
    <DatePicker
      type="date"
      :value="value[1]"
      :options="options2()"
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
    options1() {
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
    options2() {
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
 