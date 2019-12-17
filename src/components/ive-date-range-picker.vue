
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
import _ from 'lodash';
import moment from 'moment';

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
    disabledDateFnArr: {
      type: Array,
      default: null,
    }
  },
  data() {
    return {
      currentValue: [],
    };
  },
  computed: {
    startOptions() {
      let disabledDateFn;
      const minValue = new Date(this.currentValue[1]);
      if (this.disabledDateFnArr && this.disabledDateFnArr[0] instanceof Function) {
        disabledDateFn = this.disabledDateFnArr[0](minValue);
      } else {
        disabledDateFn = date => {
          let disabledDate;
          if (date) {
            const value = date && date.valueOf();
            if (this.disabledDate && this.disabledDate instanceof Date) {
              disabledDate = value > minValue || value < this.disabledDate;
            } else {
              disabledDate = value > minValue;
            }
          }

          return disabledDate;
        };
      }
      return {
        disabledDate: disabledDateFn,
      };
    },
    endOptions() {
      let disabledDateFn;
      const maxValue = new Date(this.currentValue[0]);
      if (this.disabledDateFnArr && this.disabledDateFnArr[1] instanceof Function) {
        disabledDateFn = this.disabledDateFnArr[1](maxValue);
      } else {
        disabledDateFn = date => {
          let disabledDate;
          if (date) {
            const value = date && date.valueOf();
            if (this.disabledDate && this.disabledDate instanceof Date) {
              disabledDate = value < maxValue || value < this.disabledDate;
            } else {
              disabledDate = value < maxValue;
            }
          }

          return disabledDate;
        };
      }
      return {
        disabledDate: disabledDateFn,
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
      if (e && e instanceof Date) {
        e = new Date(moment(e).format('YYYY-MM-DD'));
      }
      this.currentValue[index] = e;
      this.$emit('input', this.currentValue);
    },
  },
  created() {
    this.currentValue = _.cloneDeep(this.value);
  },
};
</script>
