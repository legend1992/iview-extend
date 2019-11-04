# ive-editor
## 一、代码示例
### html
```html
<template>
  <div>
    <ive-editor
      v-model="contentMd"
      :inEditMode="inEditMode"
      :uploadApi="uploadApi"
      @change="onEditorChanged"
    />
  </div>
</template>
```
### js
```js
export default {
  data() {
    return {
      contentMd: '',
      inEditMode: true,
    }
  },
  methods: {
    async uploadApi(img) {
      try {
        // 这部分逻辑需要自行处理，将图片img传给后台，拿到一个url然后return
        // const formData = new FormData();
        // formData.append('image', img);
        // const url = await upload(formData);
        return url;
      } catch (error) {
        this.$Message.error(error);
        throw (error);
      }
    },
    onEditorChanged(value, render) {
      console.log(value, render);
    },
  },
}
```
## 二、属性、事件及方法说明
### 属性（props）
| 属性 | 说明 | 类型 | 默认值 |
| ------ | ------ | ------ | ------ |
| value | 初始值 | String | '' |
| inEditMode | 初始值 | Boolean | true |
| uploadApi | 图片上传处理函数（接收一个参数为用户在编辑器选中的图片，返回值需要是可访问的图片src） | Function | 无 |
### 事件（events）
| 事件名 | 说明 | 返回值 |
| ------ | ------ | ------ |
| input | 用户输入 | 用户在编辑器中输入的值 |
| change | 用户输入 | 1. 用户在编辑器中输入的值<br>2. 用户在编辑器中输入的值markdown格式转换成html |