# ive-filter-form
## 一、代码示例
### html
```html
<template>
  <div>
    <ive-filter-form
      :formConfig="formConfig"
      @query="handleQuery"
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
    }
  },
}
```
## 二、属性、事件及方法说明
### 属性（props）
| 属性 | 说明 | 类型 | 默认值 |
| ------ | ------ | ------ | ------ |
| labelWidth | 每个控件label所占宽度 | Number | 80 |
| inline | 是否行内模式（若为false则每个控件独占一行） | Boolean | true |
| formConfig | 表单配置，详见后文 | Array\<Object\> | 必填 |
### 事件（events）
| 事件名 | 说明 | 返回值 |
| ------ | ------ | ------ |
| query | 用户点击查询或重置按钮时触发 | 用户输入的查询条件值的集合 |
### config\<Object\>（formConfig的子项）
| 属性 | 说明 | 类型 | 默认值 |
| ------ | ------ | ------ | ------ |
| prop | 对应表单域 model 里的字段 | String | 无 |
| label | 标签文本 | String | 无 |
| itemConfig | 控件的配置 | Object | 无 |
| itemConfig.tagName | 控件名 | String | ive-input |
| itemConfig.value | 控件值 | any | 无 |
| itemConfig.props | 除value外控件的其它属性（需要符合每个控件自身能支持的props，故此处无法一一列举props中有哪些prop。<br>如ive-input中可以支持placeholders，maxlength等，ive-select支持options等） | {} | 无 |
| itemConfig.on | 监听事件集合（如props一样，此对象集合只支持对应控件能触发的事件的监听。<br>如所有组件都可监听input事件。则可按如下方式监听：<br>{ input: (e) => { console.log(e) } }） | {} | 无 |