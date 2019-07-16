export default {
  props: {
    formConfig: {
      type: Array,
      default: () => [],
      required: true
    },
    labelWidth: {
      type: Number,
      default: 80
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
          tagName: 'Input',
          props: {
            placeholder: `请输入${label}`,
          }
        };
      } else {
        config = Object.assign({
          tagName: 'Input',
        }, config);
        
        if (config.props === undefined) {
          config.props = {
            placeholder: `请输入${label}`,
          };
        } else {
          config.props = Object.assign({
            placeholder: `请输入${label}`,
          }, config.props);
        }
      }
      return config;
    },
  },
};
