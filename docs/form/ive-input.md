# ive-input
## 一、代码示例
### html
```html
<template>
  <div>
    <ive-input
      v-model="value"
      :maxlength="128"
    >
      <template slot="prepend">前置插槽内容</template>
      <template slot="append">后置插槽内容</template>
    </ive-input>
  </div>
</template>
```
### js
```js
export default {
  data() {
    return {
      value: '',
    }
  },
}
```
## 二、属性、事件及方法说明
### 属性（props）
| 属性 | 说明 | 类型 | 默认值 |
| ------ | ------ | ------ | ------ |
| value | 输入值 | String \| Number | '' |
| placeholder | 占位文本 | String | 请输入内容 |
| maxlength | 最大长度 | Number | 128 |
| type | 输入框类型，可选值为 text、password、textarea、url、email、date、number、tel | String | text |
| disabled | 是否禁用控件 | Boolean | false |
### 事件（events）
| 事件名 | 说明 | 返回值 |
| ------ | ------ | ------ |
| input | 用户输入值 | 用户输入的值 |
### 插槽（slots）
| 名称 | 说明 |
| ------ | ------ |
| prepend | 前置内容，仅在 text 类型下有效 |
| append | 后置内容，仅在 text 类型下有效 |