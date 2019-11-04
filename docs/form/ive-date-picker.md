# ive-date-picker
## 一、代码示例
### html
```html
<template>
  <div>
    <ive-date-picker
      v-model="value"
      placeholder="请选择"
      :disabledDate="new Date('2019-9-5')"
    />
  </div>
</template>
```
### js
```js
export default {
  data() {
    return {
      value: [],
    }
  },
}
```
## 二、属性、事件及方法说明
### 属性（props）
| 属性 | 说明 | 类型 | 默认值 |
| ------ | ------ | ------ | ------ |
| value | 日期 | Date \| String \| Number | null |
| placeholder | 占位文本 | String | 请选择日期 |
| type | 显示类型，可选值为 date、daterange、datetime、datetimerange、year、month | String | date |
| disabledDate | 不可选日期（为日期时，则小于该日期的时间都不可选；为函数时，直接传给iview的日期组件，参数为当前的日期，需要返回 Boolean 是否禁用这天	） | Date \| Function | () => new Date(new Date() - 24 * 60 * 60 * 1000) |
| disabled | 是否禁用选择器	 | Boolean | false |
### 事件（events）
| 事件名 | 说明 | 返回值 |
| ------ | ------ | ------ |
| input | 用户选中了日期 | 用户选中的日期 |