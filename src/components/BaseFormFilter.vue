<script>
import _ from 'lodash';
import baseForm_mixin from '../mixins/baseForm_mixin';

export default {
  name: "BaseFormFilter",
  mixins: [baseForm_mixin],
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
    inline: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    formConfig: {
      handler() {
        this.initModel();
      },
      deep: true
    },
  },
  methods: {
    handleQuery() {
      this.$emit('query', _.cloneDeep(this.model));
    },
    handleReset() {
      this.$refs.form.resetFields();
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
    // 渲染表单子组件
    const renderFormChilds = () => [
      this.formConfig.map(item => this.renderFormItem(h, item)),
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
