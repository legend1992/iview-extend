import _ from 'lodash';
import baseForm_mixin from '../mixins/baseForm_mixin';

export default {
  name: 'ive-filter-form',
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
      deep: true,
      immediate: true,
    },
  },
  methods: {
    initModel() {
      this.model = this.formConfig.reduce((prev, cur) => {
        if (cur.itemConfig && cur.itemConfig.tagName === 'ive-date-range-picker') {
          prev[cur.prop] = (cur.itemConfig && cur.itemConfig.value) || [];
        } else {
          prev[cur.prop] = (cur.itemConfig && cur.itemConfig.value) || '';
        }
        return prev;
      }, {});
    },
    handleQuery() {
      this.$emit('query', _.cloneDeep(this.model));
    },
    handleReset() {
      this.$refs.form.resetFields();
      this.handleQuery();
    },
  },
  render(h) {
    // 渲染按钮
    const renderButtons = () => [
      h(
        'span',
        {
          class: 'button-wrapper',
          style: {
            marginLeft: this.labelWidth + 'px',
          }
        },
        [
          h(
            'Button',
            {
              props: {
                type: 'primary'
              },
              on: {
                click: this.handleQuery
              }
            },
            '查询'
          ),
          h(
            'Button',
            {
              on: {
                click: this.handleReset
              }
            },
            '重置'
          )
        ]
      )
    ];
    const renderTip = (tip) => {
      if (tip) {
        return h('ive-icon-tooltip', {
          props: {
            content: tip,
          },
        });
      } else {
        return null;
      }
    };
    // 渲染控件
    const renderItem = ({ prop, label, tip, itemConfig: config }) => {
      config = this.setDefaultItemConfig(label, config);
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
        renderTip(tip),
      ]
    };
    // 渲染FormItem
    const renderFormItem = (item) => {
      return h(
        'FormItem',
        {
          props: {
            label: item.label,
            prop: item.prop
          }
        },
        renderItem(item)
      )
    };
    // 渲染表单子组件
    const renderFormChilds = () => [
      this.formConfig.map(item => renderFormItem(item)),
      renderButtons()
    ];
    const { model, labelWidth, inline } = this;
    return h(
      'Form',
      {
        props: {
          model,
          labelWidth,
          inline
        },
        class: 'ive-filter-form',
        ref: 'form'
      },
      renderFormChilds()
    );
  }
};
