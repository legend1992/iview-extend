<script>
export default {
  name: 'BaseForm',
  props: {
    /**
     * formConfig: {
     *  hide: true, 值为true表明此元素为默认隐藏开始元素
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
    formConfig: {
      type: Array,
      default: () => [],
      required: true,
    },
    labelWidth: {
      type: Number,
      default: 80,
    },
    inline: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      // 表单数据
      model: {},
      // 是否展示更多
      moreIsShow: false,
    };
  },
  computed: {
    // 校验规则
    rules() {
      const rules = {};
      return this.formConfig.reduce((prev, cur) => {
        if (cur.rules) {
          rules[cur.prop] = cur.rules;
        }
        return prev;
      }, rules);
    },
    // 收起的内容开始下标
    hideStartIndex() {
      return this.formConfig.findIndex(item => item.hide);
    },
    defaultShowPart() {
      let showPart;
      if (this.hideStartIndex === -1) {
        showPart = this.formConfig;
      } else {
        showPart = this.formConfig.slice(0, this.hideStartIndex);
      }
      return showPart;
    },
    defaultHidePart() {
      let hidePart;
      if (this.hideStartIndex === -1) {
        hidePart = [];
      } else {
        hidePart = this.formConfig.slice(this.hideStartIndex);
      }
      return hidePart;
    },
  },
  watch: {
    formConfig: {
      handler() {
        this.initModel();
      },
      deep: true,
    },
  },
  methods: {
    initModel() {
      this.model = this.formConfig.reduce((model, cur) => {
        model[cur.prop] = cur.itemConfig.value;
        return model;
      }, {});
    },
    getData() {
      return this.$utils._.cloneDeep(this.model);
    },
    validate(fn) {
      this.$refs.form.validate(fn);
    },
    reset() {
      this.moreIsShow = false;
      this.$refs.form.resetFields();
    },
  },
  created() {
    this.initModel();
  },
  render(h) {
    // 渲染控件
    const renderItem = ({ prop, itemConfig: config }) => [
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
    ];
    // 渲染FormItem
    const renderFormItem = item => h(
      'FormItem',
      {
        props: {
          label: item.label,
          prop: item.prop,
        },
      },
      renderItem(item),
    );
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
    const renderDefaultShowPart = () => this.defaultShowPart
      .filter(item => item.itemConfig.tagName)
      .map(item => renderFormItem(item));
    // 渲染Form默认隐藏部分
    const renderDefaultHidePart = () => this.defaultHidePart.map(item => renderFormItem(item));
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
    const renderFormChild = () => {
      const formChild = [renderDefaultShowPart()];
      if (this.defaultHidePart.length) {
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
          rules,
          labelWidth,
          inline,
        },
        ref: 'form',
      },
      renderFormChild(),
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
