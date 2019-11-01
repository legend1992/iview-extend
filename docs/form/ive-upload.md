# ive-upload
## 一、代码示例
### html
```html
<template>
  <div>
    <ive-upload
      ref="upload"
      action="/cgi/upload/image/"
      v-model="value"
      :maxSize="1024"
      :name="image"
      :data="data"
      :resolutionRatio="resolutionRatio",
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
      data: {
        a: 1,
        b: 2,
      },
      resolutionRatio: {
        width: 300,
        height: 500,
      }
    }
  },
}
```
## 二、属性、事件及方法说明
### 属性（props）
| 属性 | 说明 | 类型 | 默认值 |
| ------ | ------ | ------ | ------ |
| value | 文件的url | any | 无 |
| action | 上传文件的地址 | String | '' |
| data | 上传时附带的额外参数 | Object | {} |
| name | 上传的文件字段名 | String | file |
| accept | 接受的文件类型 | String | image/jpg, image/png, image/jpeg |
| format | 接受的文件格式，与 accept 不同的是，format 是识别文件的后缀名，accept 为 input 标签原生的 accept 属性，会在选择文件时过滤，可以两者结合使用 | Array | ['jpg', 'png', 'jpeg'] |
| maxSize | 文件大小限制，单位 kb | Number | 无 |
### 事件（events）
| 事件名 | 说明 | 返回值 |
| ------ | ------ | ------ |
| format-error | 文件格式验证失败时触发 | 参数1：上传文件格式<br>参数2：支持的格式 |
| resolution-ratio-error | 图片分辨率验证失败时触发 | 验证结果 |
| on-error | 文件上传失败时的触发 | 事件对象 |
| on-progress | 文件上传时触发 | 事件对象 |
| input | 文件上传成功时触发 | 后端响应结果 |
| on-success | 文件上传成功时触发 | 后端响应结果 |
| on-exceeded-size | 文件超出指定大小限制时触发 | 事件对象 |