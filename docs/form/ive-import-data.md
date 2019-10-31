# ive-import-data
## 一、代码示例
### html
```html
<template>
  <div>
    <ive-import-data
      :modal="modal"
      :importApi="importApi"
      @upload-success="uploadSuccess"
      @close="handleClose"
    />
  </div>
</template>
```
### js
```js
export default {
  data() {
    return {
      modal: false,
    }
  },
  methods: {
    importApi(formData) {},
    uploadSuccess(formData) {},
    handleClose() {
      this.modal = false;
    },
  }
}
```
## 二、属性、事件及方法说明
### 属性（props）
| 属性 | 说明 | 类型 | 默认值 |
| ------ | ------ | ------ | ------ |
| modal | 控制弹窗是否显示 | Boolean | false |
| importApi | 导入文件的接口（接收包含选择文件的formData为参数） | Function | 无（必填） |
| accept | 接受的文件格式 | String | application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet |
| format | 接受的文件格式，与 accept 不同的是，format 是识别文件的后缀名，accept 为 input 标签原生的 accept 属性，会在选择文件时过滤，可以两者结合使用 | Array | ['xls', 'xlsx'] |
### 事件（events）

| 事件名 | 说明 | 返回值 |
| ------ | ------ | ------ |
| close | 用户点击了右上角关闭按钮触发 | 无 |
| upload-success | 文件导入成功后触发 | resData（后端返回的数据） |