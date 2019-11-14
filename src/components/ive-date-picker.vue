<template>
  <DatePicker
    :value="formatValue"
    @on-change="handleInput"
    :type="type"
    :options="options"
    :placeholder="placeholder"
    :disabled="disabled"
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
  },
  computed: {
    formatValue() {
      let formatValue = this.formatDate(this.value);
      if (['daterange', 'datetimerange'].includes(this.type)) {
        formatValue = [null, null];
        if (Array.isArray(this.value)) {
          this.value.forEach((item) => {
            formatValue.push(this.formatDate(item));
          });
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
      const value = $event || null;
      this.$emit('input', value);
    },
  },
};
</script>
