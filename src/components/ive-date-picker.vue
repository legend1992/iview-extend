<template>
  <DatePicker
    :class="pickerClass"
    :value="formatValue"
    @on-change="handleInput"
    :type="type"
    :options="options"
    :placeholder="placeholder"
    :disabled="disabled"
    :transfer="transfer"
  ></DatePicker>
</template>

<script>
export default {
  name: 'ive-date-picker',
  props: {
    value: {
      type: [Date, String, Number, Array],
      default: null,
    },
    placeholder: {
      type: String,
      default: '请选择日期',
    },
    type: {
      type: String,
      default: 'date',
    },
    disabledDate: {
      default: () => new Date(new Date() - 24 * 60 * 60 * 1000),
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    transfer: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    isRange() {
      return ['daterange', 'datetimerange'].includes(this.type);
    },
    formatValue() {
      let formatValue = this.formatDate(this.value);
      if (this.isRange) {
        formatValue = [];
        if (Array.isArray(this.value)) {
          this.value.forEach((item) => {
            formatValue.push(this.formatDate(item));
          });
        } else {
          formatValue = [null, null];
        }
      }

      return formatValue;
    },
    options() {
      let disabledDateFn;
      if (this.disabledDate instanceof Function) {
        disabledDateFn = this.disabledDate;
      } else {
        disabledDateFn = (date) => {
          let disabledDate;
          if (date) {
            const value = date && date.valueOf();
            if (this.disabledDate && this.disabledDate instanceof Date) {
              disabledDate = value < this.disabledDate;
            }
          }

          return disabledDate;
        };
      }
      return {
        disabledDate: disabledDateFn,
      };
    },
    pickerClass() {
      return {
        'range-picker': this.isRange,
      };
    },
  },
  methods: {
    formatDate(value) {
      let formatValue = new Date(value);
      if (!value || formatValue.toString() === 'Invalid Date') {
        formatValue = null;
      }
      return formatValue;
    },
    handleInput($event) {
      let value = $event || null;
      if (Array.isArray(value)) {
        value[0] = value[0] ? value[0] : null;
        value[1] = value[1] ? value[1] : null;
        if (!value[0] && !value[1]) {
          value = null;
        }
      }
      this.$emit('input', value);
    },
  },
};
</script>
