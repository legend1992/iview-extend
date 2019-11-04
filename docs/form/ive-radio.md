# ive-radio
## 一、代码示例
### html
```html
<template>
  <div>
    <ive-radio
      v-model="value"
      :options="options"
      :parseIntKey="true"
    />
  </div>
</template>
```
### js
```js
export default {
  data() {
    return {
      value: 1,
      options: {
        0: '选项1',
        1: '选项2',
        2: '选项3',
      },
    }
  },
}
```
## 二、属性、事件及方法说明
### 属性（props）
| 属性 | 说明 | 类型 | 默认值 |
| ------ | ------ | ------ | ------ |
| value | 选中值 | any | '' |
| options | 选项 | Array \| Object | {} |
| parseIntKey | 将options中的key格式化为数字 | Boolean | false |
| noDataMessage | 无选项时展示的文字 | String | 无可选数据 |
| disabled | 是否禁用控件 | Boolean | false |
| type | 可选值为 button 或不填，为 button 时使用按钮样式 | String | 无 |
### 事件（events）
| 事件名 | 说明 | 返回值 |
| ------ | ------ | ------ |
| input | 用户选中了某个单选框 | 用户选中的单选框的值 |