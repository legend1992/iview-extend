# ive-edit-form change-list
记录ive-edit-form的变更记录

## 2019/9
### 1. 2019/9/12 fix: 修复iview bug(FormItem的props: rules为undefined和required为false时，isRequired不变，不会改为false。一定要改为rules: [required: false])
改动前
```
setDefaultRules(item) {
  ...
  } else if (item.required === false) {
    const index = item.rules ? item.rules.findIndex(rule => rule.required) : -1;
    if (index > -1) {
      item.rules[index].required = false;
      this.$nextTick(() => {
        this.validateField(item.prop);
      });
    }
  }
  ...
}
```
改动后
```
setDefaultRules(item) {
  ...
  else if (item.rules && item.rules instanceof Array) {
    const index = item.rules.findIndex(rule => rule.required);
    if (index > -1) {
      item.rules[index].required = false;
      this.$nextTick(() => {
        this.validateField(item.prop);
      });
    } else {
      item.rules.push({
        required: false,
      });
    }
  } else {
    item.rules = [{
      required: false,
    }];
  }
  ...
}
```

## 2019/8
### 1. 2019/8/23 fix: 修复model数据不同步问题
改动前
```
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
  ...
}
```
改动后
```
methods: {
  configFormat(configs) {
    configs.forEach((item) => {
      const { label, itemConfig } = item;
      item.itemConfig = this.setDefaultItemConfig(label, itemConfig);
      item.rules = this.setDefaultRules(item);
    });
    this.setModelValue();
    return configs;
  },
  setModelValue() {
    const allConfig = [..._.cloneDeep(this.formConfig), ..._.cloneDeep(this.hideConfig)];
    this.model = {};
    allConfig.forEach((item) => {
      const { prop, itemConfig } = item;
      this.$set(this.model, prop, itemConfig && itemConfig.value);
    });
  },
  ...
}
```