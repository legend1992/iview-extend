# ive-edit-form
## 一、代码示例
### html
```html
<template>
  <div>
    <ive-edit-form
      ref="baseForm"
      :labelWidth="labelWidth"
      :formConfig.sync="formConfig"
      :hideConfig.sync="hideConfig"
    />
  </div>
</template>
```
### js
```js
export default {
  data() {
    return {
      labelWidth: 100,
      formConfig: [
        {
          prop: 'title',
          label: '消息标题',
        },
        {
          prop: 'jumpType',
          label: '跳转类型',
          itemConfig: {
            tagName: 'ive-select',
            props: {
              options: [1, 2],
            },
            on: {
              input: (e) => {
                console.log(e);
              }
            }
          },
        },
      ],
      hideConfig: [{
        prop: 'title-hide',
        label: '默认隐藏',
      }],
    }
  },
}
```
## 二、属性、事件及方法说明
### 属性（props）
| 属性 | 说明 | 类型 | 默认值 |
| ------ | ------ | ------ | ------ |
| labelWidth | 每个控件label所占宽度 | Number | 80 |
| formConfig | 表单配置，详见后文 | Array\<Object\> | 必填 |
### 事件（events）
| 事件名 | 说明 | 返回值 |
| ------ | ------ | ------ |
| update:formConfig | formConfig中控件的值有变动时触发 | 子项对象的itemConfig.value被更新后的formConfig副本 |
| update:hideConfig | hideConfig中控件的值有变动时触发 | 子项对象的itemConfig.value被更新后的hideConfig副本 |
### 方法（methods）
| 方法名 | 说明 | 参数 | 返回值 |
| ------ | ------ | ------ | ------ |
| reset | 将formConfig和hideConfig中每个控件的value重置为第一次传入时的值（根据业务需求，除了value属性被重置，其它属性不会重置），然后调用iview form组件的resetFields方法重置每个控件的校验状态 | 无 | 无 |
| validateField | 验证某个控件的校验状态 | prop（控件的prop属性） | 控件的校验状态（调用iview form组件的validateField方法） |
| getData | 获取所有控件值的集合 | 参数1：needValidate（是否需要校验。默认为true，若传入false，则不用校验可直接拿到数据） | 所有控件值的集合 |
### config\<Object\>（formConfig的子项）
| 属性 | 说明 | 类型 | 默认值 |
| ------ | ------ | ------ | ------ |
| required | 该控件是否必填 | Boolean | 无 |
| rules | <a href="http://v3.iviewui.com/components/form#Form_props" target="_blank">该控件的校验规则集合</a> | Array\<Object\> | 无 |
| 其它 | <a href="./ive-filter-form.html#二、属性、事件及方法说明">同ive-filter-form</a> | Object | 无 |