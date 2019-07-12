<script>
import _ from 'lodash';
export default {
  name: "BaseFormFilter",
  props: {
    /**
     * formConfig: {
        prop: 用于FormItem的prop,
        label: 用于FormItem的label,
        itemConfig: 用于FormItem子元素，即具体控件如Input/Select等的配置,
        {
          tagName: 控件组件名,
          value: 值,
          props: { 用于控件props
            placeholder: '',
            maxlength: 0,
            ...
          }
        },
      }
     *  */
    formConfig: {
      type: Array,
      default: () => [],
      required: true
    },
    labelWidth: {
      type: Number,
      default: 80
    },
    inline: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      // 表单数据
      model: {},
    };
  },
  watch: {
    formConfig: {
      handler() {
        this.initModel();
      },
      deep: true
    }
  },
  methods: {
    initModel() {
      this.model = this.formConfig.reduce((prev, cur) => {
        prev[cur.prop] = (cur.itemConfig && cur.itemConfig.value) || '';
        return prev;
      }, {});
    },
    handleQuery() {
      this.$emit('query', _.cloneDeep(this.model));
    },
    handleReset() {
      this.$refs.form.resetFields();
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
  },
  created() {
    this.initModel();
  },
  render(h) {
    // 渲染按钮
    const renderButtons = () => [
      h(
        "Row",
        {
          props: {
            type: "flex",
            justify: "end"
          }
        },
        [
          h(
            "Button",
            {
              props: {
                type: "primary"
              },
              on: {
                click: this.handleQuery
              }
            },
            "查询"
          ),
          h(
            "Button",
            {
              on: {
                click: this.handleReset
              }
            },
            "重置"
          )
        ]
      )
    ];
    // 渲染控件
    const renderItem = ({ prop, label, itemConfig: config }) => {
      config = this.setDefaultConfig(label, config);
      return [
        h(config.tagName, {
          props: {
            ...config.props,
            value: this.model[prop]
          },
          on: {
            ...config.on,
            input: e => {
              this.model[prop] = e;
              if (config.on && config.on.input) {
                config.on.input(e);
              }
            }
          }
        })
      ]
    };
    // 渲染FormItem
    const renderFormItem = item =>
      h(
        "FormItem",
        {
          props: {
            label: item.label,
            prop: item.prop
          }
        },
        renderItem(item)
      );
    // 渲染表单子组件
    const renderFormChilds = () => [
      this.formConfig.map(item => renderFormItem(item)),
      renderButtons()
    ];
    const { model, labelWidth, inline } = this;
    return h(
      "Form",
      {
        props: {
          model,
          labelWidth,
          inline
        },
        ref: "form"
      },
      renderFormChilds()
    );
  }
};
</script>
<style lang='scss' scoped>
form {
  padding: 10px 20px;
  background: #eee;
}
/deep/ {
  .ivu-btn-primary {
    margin-right: 5px;
  }
  .ivu-form-item {
    margin-bottom: 12px;
    .ivu-form-item-label:after {
      content: "：";
      display: inline-block;
      line-height: 1;
    }
    .ivu-form-item-label {
      padding-right: 0;
    }
  }
}
</style>
