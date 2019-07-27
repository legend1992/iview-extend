<template>
  <div class="ive-date-range">
    <DatePicker
      type="date"
      :value="value[0]"
      :options="startOptions"
      :placeholder="placeholder[0]"
      @on-change="change($event, 0)"
    />
    <span class="separator">-</span>
    <DatePicker
      type="date"
      :value="value[1]"
      :options="endOptions"
      :placeholder="placeholder[1]"
      @on-change="change($event, 1)"
    />
  </div>
</template>

<script>
import _ from "lodash";
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
      default: () => new Date(new Date() - 24 * 60 * 60 * 1000),
    },
  },
  data() {
    return {
      currentValue: [],
    };
  },
  computed: {
    startOptions() {
      return {
        disabledDate: (date) => {
          let disabledDate;
          if (date) {
            const value = date && date.valueOf();
            const minValue = new Date(this.currentValue[1]);
            if (this.disabledDate && this.disabledDate instanceof Date) {
              disabledDate = value > minValue || value < this.disabledDate;
            } else {
              disabledDate = value > minValue;
            }
          }

          return disabledDate;
        },
      };
    },
    endOptions() {
      return {
        disabledDate: (date) => {
          let disabledDate;
          if (date) {
            const value = date && date.valueOf();
            const maxValue = new Date(this.currentValue[0]) - 86400000;
            if (this.disabledDate && this.disabledDate instanceof Date) {
              disabledDate = value < maxValue || value < this.disabledDate;
            } else {
              disabledDate = value < maxValue;
            }
          }

          return disabledDate;
        },
      };
    },
  },
  watch: {
    value(value) {
      this.currentValue = _.cloneDeep(value);
    },
  },
  methods: {
    change(e, index) {
      this.currentValue[index] = e;
      this.$emit('input', this.currentValue);
    },
  },
};
</script>
