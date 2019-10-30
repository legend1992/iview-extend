# ive-checkbox-group
## 一、代码示例
### html
```html
<template>
  <div>
    <ive-checkbox-group
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
      value: [],
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
| value | 选中值 | Array | [] |
| options | 选项 | Array \| Object | {} |
| parseIntKey | 将options中的key格式化为数字 | Boolean | false |
| noDataMessage | 无选项时展示的文字 | String | 无可选数据 |
### 事件（events）
| 事件名 | 说明 | 返回值 |
| ------ | ------ | ------ |
| input | 用户改变了复选框状态 | 用户选中的复选框集合 |