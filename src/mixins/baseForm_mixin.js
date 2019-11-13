export default {
  props: {
    formConfig: {
      type: Array,
      default: () => [],
      required: true,
    },
    labelWidth: {
      type: Number,
      default: 80,
    },
  },
  data() {
    return {
      // 表单数据
      model: {},
    };
  },
  methods: {
    setDefaultItemConfig(label, config) {
      if (config === undefined) {
        config = {
          tagName: 'ive-input',
          props: {
            placeholder: `请输入${label}`,
          },
        };
      } else {
        config = Object.assign({
          tagName: 'ive-input',
        }, config);

        let defaultProps = {
          placeholder: config.tagName === 'ive-select' ? `请选择${label}` : `请输入${label}`,
        };
        if (config.tagName === 'ive-date-range-picker') {
          defaultProps = {};
        }
        if (config.props === undefined) {
          config.props = defaultProps;
        } else {
          config.props = Object.assign(defaultProps, config.props);
        }
      }
      return config;
    },
  },
};
