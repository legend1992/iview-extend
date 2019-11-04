# ive-timeline
## 一、代码示例
### html
```html
<template>
  <ive-timeline :items="items">
    <!-- <template slot="itemSlot" slot-scope="item">
      <span @click="onClick(item.id)">
        {{ item.updatedBy }}<i>更新于</i>{{ item.create_time }}
      </span>
    </template> -->
  </ive-timeline>
</template>
```
<span style="color: #999;">（支持slot，slot值必须为itemSlot。不写slot时渲染的是item.text）</span>
### js

```js
export default {
  data() {
    return {
      items: [
        { id: 1, updatedBy: 'local', create_time: '2019-06-08', status: 0 },
        { id: 2, updatedBy: 'local', create_time: '2019-06-09', status: 1 },
        { id: 3, updatedBy: 'local', create_time: '2019-06-10', status: 2 },
      ],
    }
  },
  methods: {
    onClick(id) {
      console.log(id);
    },
  },
}
```
## 二、属性、事件及方法说明
### 属性（props）
| 属性 | 说明 | 类型 | 默认值 |
| ------ | ------ | ------ | ------ |
| items | 数据 | Array | 无（必填） |
| colorMap | 颜色集合，根据item.status来匹配值（colorMap[item.status]匹配到的值会传给TimelineItem的color属性） | Object | { 0: 'gray', 1: 'orange', 2: 'green', 3: 'red' } |