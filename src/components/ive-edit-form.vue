<template>
  <Form class="ive-edit-form" ref="form" :model="model" :label-width="labelWidth">
    <iveFormItem
      v-for="item in formConfigFormat"
      :key="item.prop"
      :item="item"
      v-model="model[item.prop]"
      @input="itemInput($event, item, 'formConfig')"
    />

    <div
      v-show="hideConfig.length && !moreIsShow"
      class="toggle-button"
      :class="{ hide: this.moreIsShow }"
      @click="moreIsShow = true;"
    >点击查看更多内容</div>

    <div
      v-show="moreIsShow"
      class="hidePart-wrapper"
      :class="{ show: this.moreIsShow }"
    >
      <iveFormItem
        v-for="item in hideConfigFormat"
        :key="item.prop"
        :item="item"
        v-model="model[item.prop]"
        @input="itemInput($event, item, 'hideConfig')"
      />
      <div class="toggle-button" @click="moreIsShow = false;">收起</div>
    </div>
  </Form>
</template>
<script>
import _ from "lodash";
import baseForm_mixin from '../mixins/baseForm_mixin';
import iveFormItem from './form/form-item.vue';

export default {
  name: "ive-form",
  mixins: [baseForm_mixin],
  components: {
    iveFormItem,
  },
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
        this.$set(this.model, prop, (itemConfig && itemConfig.value) || "");
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
            return rule.required;
          });
          if (!requiredRule) {
            item.rules.unshift({
              required: true,
              message: `${item.label}不为空`
            });
          } else if (requiredRule.message === undefined) {
            requiredRule.message = `${item.label}不为空`;
          }
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
    // 控件输入，更新源数据formConfig/hideConfig
    itemInput(value, item, type) {
      item.itemConfig.value = value;
      this.$emit(`update:${type}`, this[`${type}Format`]);
      item.itemConfig.on && item.itemConfig.on.input && item.itemConfig.on.input(value);
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
      this.$emit('update:formConfig', this.formConfigOriginal);
      this.$emit('update:hideConfig', this.hideConfigOriginal);
      this.$refs.form.resetFields();
    },
  },
};
</script>
