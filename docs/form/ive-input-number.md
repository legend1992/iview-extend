# ive-input-number
## 一、代码示例
### html
```html
<template>
  <div>
    <ive-input-number
      v-model="value"
      :max="100"
      :min="80"
      :parseIntValue="true"
    />
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
| value | 输入值 | any | null |
| max | 可输入的最大值 | Number | '' |
| min | 可输入的最小值 | Number | '' |
| placeholder | 占位文本 | String | 请输入数字 |
| parseIntValue | 是否只可输入整数 | Boolean | false |
| step | 控件上下键点击每次改变的幅度 | Number | 1 |
| formatter | 指定输入框展示值的格式 | Function | 无 |
| parser | 指定从 formatter 里转换回数字的方式，和 formatter 搭配使用 | Function | 无 |
### 事件（events）
| 事件名 | 说明 | 返回值 |
| ------ | ------ | ------ |
| input | 用户输入值 | 用户输入的值 |