# ive-select
## 一、代码示例
### html
```html
<template>
  <div>
    <!-- 单选 -->
    <ive-select
      v-modal="value1"
      :options="options"
      :parseIntKey="true"
      :clearable="true"
      :filterable="true"
    />
    <!-- 多选 -->
    <ive-select
      v-modal="value2"
      :options="options"
      :multiple="true"
      :maxTagCount="2"
      :maxTagPlaceholder="maxTagPlaceholder"
      :maxTagSelect="3"
      @queryChanged="queryChanged"
    />
  </div>
</template>
```
### js
```js
export default {
  data() {
    return {
      value1: 1,
      value2: [0, 1, 2],
      options: {
        0: '选项1',
        1: '选项2',
        2: '选项3',
      },
    }
  },
  methods: {
    maxTagPlaceholder(e) {
      return `more ${e}`;
    },
    queryChanged(e) {
      console.log(e);
    }
  }
}
```
## 二、属性、事件及方法说明
### 属性（props）
| 属性 | 说明 | 类型 | 默认值 |
| ------ | ------ | ------ | ------ |
| value | 选中值 | any | '' |
| options | 选项 | Array \| Object | {} |
| parseIntKey | 将options中的key格式化为数字 | Boolean | false |
| filterable | 是否支持搜索 | Boolean |	false |
| multiple |	是否支持多选 | Boolean | false |
| clearable |	是否可以清空选项，只在单选时有效 | Boolean | false |
| placeholder |	选择框默认文字 | String | 请选择 |
| disabled | 是否禁用控件 | Boolean | false |
| maxTagCount | 多选时最多显示多少个tag | Number | 无 |
| maxTagPlaceholder | 隐藏 tag 时显示的内容，参数是剩余项数量 | Function | 无 |
| maxTagSelect | 多选时最多可选择多少个tag | Number | 无 |
### 事件（events）
| 事件名 | 说明 | 返回值 |
| ------ | ------ | ------ |
| input | 用户改变了某个选项的状态 | 用户选中的所有选项的值 |
| queryChanged | 搜索词改变时触发 | 用户输入的搜索词 |