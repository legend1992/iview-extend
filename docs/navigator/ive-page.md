# ive-page
## 一、代码示例
### html
```html
<template>
  <ive-page
    :total="total"
    :pageIndex="pageIndex"
    @on-page-size-change="onPageSizeChanged"
    @on-change="onPageChanged"
  />
</template>
```
### js
```js
export default {
  data() {
    return {
      total: 100,
      pageIndex: 1,
    }
  },
  methods: {
    onPageSizeChanged(size) {
      this.pageIndex = 1;
      this.pageSize = size;
    },
    onPageChanged(index) {
      this.pageIndex = index;
    },
  },
}
```
## 二、属性、事件及方法说明
### 属性（props）
| 属性 | 说明 | 类型 | 默认值 |
| ------ | ------ | ------ | ------ |
| total | 数据总数 | Number | null |
| pageIndex | 当前页码 | Number | 1 |
| pageSize | 当前页码 | Number | 1 |
| pageSizeOpts | 每页条数切换的配置 | Number | [30, 50, 100] |
| showTotal | 显示总数 | Boolean | true |
| showElevator | 显示电梯，可以快速切换到某一页 | Boolean | true |
| showSizer | 显示分页，用来改变page-size | Boolean | true |
### 事件（events）
| 事件名 | 说明 | 返回值 |
| ------ | ------ | ------ |
| on-change | 页码改变的回调，返回改变后的页码 | 页码 |
| on-page-size-change | 切换每页条数时的回调，返回切换后的每页条数 | page-size |