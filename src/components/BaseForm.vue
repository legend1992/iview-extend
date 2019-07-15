<script>
import baseForm_mixin from '../mixins/baseForm_mixin';

export default {
  name: 'BaseForm',
  mixins: [baseForm_mixin],
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
  methods: {
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
    const renderDefaultShowPart = () => this.defaultShowPart.map(item => this.renderFormItem(h, item));
    // 渲染Form默认隐藏部分
    const renderDefaultHidePart = () => this.defaultHidePart.map(item => this.renderFormItem(h, item));
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
