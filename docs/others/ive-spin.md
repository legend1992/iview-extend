# ive-spin
## 一、代码示例
### html
```html
<template>
  <div style="position: relative;">
    ...
    <span v-show="loading"><ive-spin /></span>
  </div>
</template>
```
<p style="color: #999; padding-left: 2em; text-indent: -2em;">注：1.父容器需要设置position: relative;；<br>
2.需要使用span将ive-spin包住，在span上加v-show指令控制加载圈的显示隐藏。因为如果直接将v-show写在ive-spin上的话，会在ive-spin渲染时被其行内样式覆盖v-show生成的行内样式</p>

### js
```js
export default {
  data() {
    return {
      loading: true,
    }
  },
}
```
## 二、属性及方法说明
无