<script>
import _ from 'lodash';
import baseForm_mixin from '../mixins/baseForm_mixin';

export default {
  name: 'BaseForm',
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
        required: 是否必填,
        rules: 控件校验规则
        [
          {
            required: true,
            message: ''
          },
          ...
        ]
      }

     *  */
    /**
     * hideConfig: 配置同formConfig，其内设置的控件将默认隐藏
     */
    hideConfig: {
      type: Array,
      default: () => [],
    },
    inline: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      // 是否展示更多
      moreIsShow: false,
    };
  },
  computed: {
    allConfig() {
      return this.formConfig.concat(this.hideConfig);
    },
    // 校验规则
    rules() {
      return this.allConfig.reduce((prev, cur) => {
        if (cur.required) {
          if (!cur.rules || !(cur.rules instanceof Array)) {
            cur.rules = [
              {
                required: true,
                message: `${cur.label}不为空`
              }
            ]
          } else {
            const [requiredRule] = cur.rules.filter((rule) => {
              return rule.required;
            });
            if (!requiredRule) {
              cur.rules.unshift({
                required: true,
                message: `${cur.label}不为空`,
              });
            } else if (requiredRule.message === undefined) {
              requiredRule.message = `${cur.label}不为空`;
            }
          }
        }

        if (cur.rules) {
          prev[cur.prop] = cur.rules;
        }
        
        return prev;
      }, {});
    },
  },
  methods: {
    updateModel(prop, value) {
      this.model[prop] = value;
    },
    initModel() {
      this.allConfig.forEach(({prop, itemConfig}) => {
        this.$set(this.model, prop, (itemConfig && itemConfig.value) || '');
      });
    },
    getData(needValidate = true) {
      if (needValidate) {
        if (this.validate()) {
          return _.cloneDeep(this.model);
        } else {
          this.$Message.warning('请将表单填写完整');
        }
      } else {
        return _.cloneDeep(this.model);
      }
    },
    validate() {
      let validate;
      this.$refs.form.validate((valid) => {
        validate = valid;
      });
      return validate;
    },
    reset() {
      this.moreIsShow = false;
      this.$refs.form.resetFields();
    },
  },
  render(h) {
    // 渲染展示更多按钮
    const renderShowMoreButton = () => h('div', {
      domProps: {
        innerHTML: '点击查看更多内容',
      },
      class: {
        'toggle-button': true,
        hide: this.moreIsShow,
      },
      on: {
        click: () => {
          this.moreIsShow = true;
        },
      },
    });
    // 渲染收起按钮
    const renderHideMoreButton = () => h('div', {
      domProps: {
        innerHTML: '收起',
      },
      class: 'toggle-button',
      on: {
        click: () => {
          this.moreIsShow = false;
        },
      },
    });
    // 渲染Form默认展示部分
    const renderDefaultShowPart = () => this.formConfig.map(item => this.renderFormItem(h, item));
    // 渲染Form默认隐藏部分
    const renderDefaultHidePart = () => this.hideConfig.map(item => this.renderFormItem(h, item));
    // 渲染Form默认隐藏部分和收起按钮
    const renderDefaultHidePartAndHideMoreButton = () => h(
      'div',
      {
        class: {
          'hidePart-wrapper': true,
          show: this.moreIsShow,
        },
      },
      [
        renderDefaultHidePart(),
        renderHideMoreButton(),
      ],
    );
    const renderFormChilds = () => {
      const formChild = [renderDefaultShowPart()];
      if (this.hideConfig.length) {
        formChild.push(renderShowMoreButton(), renderDefaultHidePartAndHideMoreButton());
      }
      return formChild;
    };
    const {
      model, rules, labelWidth, inline,
    } = this;
    return h(
      'Form',
      {
        props: {
          model,
          labelWidth,
          inline,
        },
        ref: 'form',
      },
      renderFormChilds(),
    );
  },
};
</script>
<style lang='scss' scoped>
.toggle-button {
  text-align: center;
  cursor: pointer;
  &:hover {
    color: #57a3f3;
  }
  &.hide {
    display: none;
  }
}
.hidePart-wrapper {
  display: none;
  &.show {
    display: block;
  }
}
/deep/ {
  .ivu-form-item-label:after {
    content: '：';
    display: inline-block;
    line-height: 1;
  }
  .ivu-form-item-label {
    padding-right: 0;
  }
}
</style>
