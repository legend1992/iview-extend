# ive-textarea
## 一、代码示例
### html
```html
<template>
  <div>
    <ive-textarea
      v-model="value"
      :placeholder="placeholder"
      :maxlength="maxlength"
    />
  </div>
</template>
```
### js
```js
export default {
  data() {
    return {
      value: "值"
      placeholder: '请输入文字',
      maxlength: 100,
      disabled: true
    }
  },
}
```
## 二、属性、事件及方法说明
### 属性（props）
| 属性 | 说明 | 类型 | 默认值 |
| ------ | ------ | ------ | ------ |
| value | 输入值 | String \| Number | '' |
| autosize | 行数范围 | Object | { minRows: 2, maxRows: 5 } |
| placeholder | 占位文本 | String | 请输入内容 |
| maxlength | 最大长度 | Number | 255 |
| disabled | 是否禁用控件 | Boolean | false |
### 事件（events）
| 事件名 | 说明 | 返回值 |
| ------ | ------ | ------ |
| input | 用户输入值 | 用户输入的值trim()去除两边空格 |
| on-blur | 控件失去焦点 | 未处理过的用户输入的值 |