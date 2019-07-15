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
    initModel() {
      this.model = this.formConfig.reduce((prev, cur) => {
        prev[cur.prop] = (cur.itemConfig && cur.itemConfig.value) || '';
        return prev;
      }, {});
    },
    setDefaultConfig(label, config) {
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
    // 渲染控件
    renderItem(h, { prop, label, itemConfig: config }) {
      config = this.setDefaultConfig(label, config);
      return [
        h(config.tagName, {
          props: {
            ...config.props,
            value: this.model[prop],
          },
          on: {
            ...config.on,
            input: (e) => {
              this.model[prop] = e;
              if (config.on && config.on.input) {
                config.on.input(e);
              }
            },
          },
        }),
      ]
    },
    // 渲染FormItem
    renderFormItem(h, item) {
      return h(
        "FormItem",
        {
          props: {
            label: item.label,
            prop: item.prop,
            rules: this.rules[item.prop],
          }
        },
        this.renderItem(h, item)
      )
    },
  },
  created() {
    this.initModel();
  },
};
