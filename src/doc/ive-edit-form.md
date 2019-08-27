# ive-edit-form change-list
记录ive-edit-form的变更记录

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