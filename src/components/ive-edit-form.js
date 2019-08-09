import _ from "lodash";
import baseForm_mixin from '../mixins/baseForm_mixin';

export default {
  name: "ive-form",
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
        hide: 是否隐藏,
        tip: 右侧图标提示,
        inlineTip: 直接行内提示,
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
      default: () => []
    },
    inline: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formConfigOriginal: _.cloneDeep(this.formConfig),
      hideConfigOriginal: _.cloneDeep(this.hideConfig),
      // 是否展示更多
      moreIsShow: false,
    };
  },
  computed: {
    formConfigFormat() {
      return this.configFormat(_.cloneDeep(this.formConfig));
    },
    hideConfigFormat() {
      return this.configFormat(_.cloneDeep(this.hideConfig));
    },
  },
  methods: {
    configFormat(configs) {
      configs.forEach((item) => {
        const { prop, label, itemConfig } = item;
        item.itemConfig = this.setDefaultItemConfig(label, itemConfig);
        item.rules = this.setDefaultRules(item);
        this.$set(this.model, prop, itemConfig && itemConfig.value);
      });

      return configs;
    },
    setDefaultRules(item) {
      if (item.required) {
        if (!item.rules || !(item.rules instanceof Array)) {
          item.rules = [
            {
              required: true,
              message: `${item.label}不为空`
            }
          ];
        } else {
          const [requiredRule] = item.rules.filter(rule => {
            return rule.required !== undefined;
          });
          if (!requiredRule) {
            item.rules.unshift({
              required: true,
              message: `${item.label}不为空`
            });
          } else {
            requiredRule.required = true;
            if (requiredRule.message === undefined) {
              requiredRule.message = `${item.label}不为空`;
            }
          }
        }
      } else if (item.required === false) {
        const index = item.rules ? item.rules.findIndex(rule => rule.required) : -1;
        if (index > -1) {
          item.rules[index].required = false;
          this.$nextTick(() => {
            this.validateField(item.prop);
          });
        }
      }

      return item.rules;
    },
    // 为formConfig/hideConfig设置默认itemConfig
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
        
        let defaultProps = {
          placeholder: `请输入${label}`,
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
    getData(needValidate = true) {
      if (needValidate) {
        if (this.validate()) {
          return _.cloneDeep(this.model);
        } else {
          this.$Message.warning("请将表单填写完整");
        }
      } else {
        return _.cloneDeep(this.model);
      }
    },
    validate() {
      let validate;
      this.$refs.form.validate(valid => {
        validate = valid;
      });
      return validate;
    },
    validateField(prop) {
      return this.$refs.form.validateField(prop);
    },
    reset() {
      this.moreIsShow = false;
      const resetFormConfig = this.formConfigFormat.map((item) => {
        let originalItem = this.formConfigOriginal.find((oItem) => {
          return oItem.prop === item.prop;
        }) || {};
        item.itemConfig.value = originalItem.itemConfig && originalItem.itemConfig.value;
        return item;
      });
      const resetHideConfig = this.hideConfigFormat.map((item) => {
        let originalItem = this.hideConfigOriginal.find((oItem) => {
          return oItem.prop === item.prop;
        }) || {};
        item.itemConfig.value = originalItem.itemConfig && originalItem.itemConfig.value;
        return item;
      });
      this.$emit('update:formConfig', resetFormConfig);
      this.$emit('update:hideConfig', resetHideConfig);
      this.$refs.form.resetFields();
    },
  },
  render(h) {
    // 渲染表单子组件
    const renderFormChilds = () => {
      // 渲染FormItem
      const renderFormItem = (item, type = 'formConfig') => {
        // 渲染控件
        const renderItem = ({ prop, inlineTip, tip, itemConfig: config, slot }, type) => {
          const renderInlineTip = (inlineTip) => h('span', {
            class: 'inline-tip',
          }, inlineTip);
          const renderTip = (tip) => h('ive-icon-tooltip', {
            props: {
              content: tip,
            },
          });
          const renderSlots = () => {
            const defaultSlots = this.$slots[slot];
            let slots = [];
            if (defaultSlots && defaultSlots.length) {
              defaultSlots.forEach((defaultSlot) => {
                const {
                  tag,
                  text,
                  children,
                  data: {
                    slot: slotName,
                  },
                } = defaultSlot;
                if (children || text) {
                  slots.push(
                    h(
                      tag,
                      {
                        slot: slotName,
                      },
                      children || text,
                    )
                  );
                }
              });
            }
            return slots;
          };
          return [
            h(config.tagName, {
              props: {
                ...config.props,
                value: this.model[prop],
              },
              on: {
                ...config.on,
                input: (value) => {
                  this.model[prop] = value;
                  config.value = value;
                  this.$emit(`update:${type}`, this[`${type}Format`]);
                  config.on && config.on.input && config.on.input(value);
                },
              },
            }, renderSlots()),
            inlineTip ? renderInlineTip(inlineTip) : null,
            tip ? renderTip(tip) : null,
          ];
        };
        const { hide, label, prop, rules } = item;
        return h(
          'FormItem',
          {
            class: {
              hide: hide,
              'ive-form-item': true,
            },
            props: {
              label,
              prop,
              rules,
            },
          },
          renderItem(item, type),
        );
      };
      // 渲染隐藏部分
      const renderHidePart = () => {
        if (!this.hideConfig.length) {
          return [];
        }
        // 渲染展示更多按钮
        const renderShowMoreButton = () => h('div', {
          class: {
            'toggle-button': true,
            hide: this.moreIsShow,
          },
          on: {
            click: () => {
              this.moreIsShow = true;
            },
          },
        }, '点击查看更多内容');
        
        // 渲染默认隐藏部分和收起按钮
        const renderHidePartWrapper = () => {
          // 渲染收起按钮
          const renderHideMoreButton = () => h('div', {
            class: 'toggle-button',
            on: {
              click: () => {
                this.moreIsShow = false;
              },
            },
          }, '收起');

          return h(
            'div',
            {
              class: {
                'hidePart-wrapper': true,
                show: this.moreIsShow,
              },
            },
            [
              this.hideConfigFormat.map(item => renderFormItem(item, 'hideConfig')),
              renderHideMoreButton(),
            ],
          );
        };

        return [
          renderShowMoreButton(),
          renderHidePartWrapper(),
        ];
      };

      return [
        this.formConfigFormat.map(item => renderFormItem(item)),
        ...renderHidePart(),
      ];
    };
    const { model, labelWidth } = this;
    return h(
      'Form',
      {
        class: 'ive-edit-form',
        props: {
          model,
          labelWidth,
        },
        nativeOn: {
          submit: (e) => {
            e.preventDefault();
          },
        },
        ref: 'form'
      },
      renderFormChilds(),
    );
  },
};
