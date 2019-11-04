# ive-edit-modal
## 一、代码示例
### html
```html
<template>
  <div>
    <ive-edit-modal
      ref="modal"
      :id="id"
      :modal="modal"
      :formConfig.sync="formConfigEdit"
      :getDetailApi="getDetailApi()"
      :editApi="editApi()"
      @close="hideEditModal"
      @success="editSuccess"
    />
  </div>
</template>
```
### js
```js
export default {
  data() {
    return {
      id: 1,
      modal: false,
      formConfigEdit: [
        {
          prop: 'title',
          label: '消息标题',
        },
        {
          prop: 'jumpType',
          label: '跳转类型',
          itemConfig: {
            tagName: 'ive-select',
            props: {
              options: [1, 2],
            },
            on: {
              input: (e) => {
                console.log(e);
              }
            }
          },
        },
      ],
    }
  },
  methods: {
    getDetailApi() {
      return axios.get;
    },
    editApi() {
      return axios.post;
    },
    hideEditModal() {
      this.modal = false;
      this.id = '';
    },
    editSuccess() {
      console.log('编辑成功');
      this.hideEditModal();
    },
  }
}
```
## 二、属性、事件及方法说明
### 属性（props）
| 属性 | 说明 | 类型 | 默认值 |
| ------ | ------ | ------ | ------ |
| width | 编辑弹窗本身宽度 | Number | 570 |
| id | 被编辑对象的标识 | String \| Number | '' |
| modal | 编辑弹窗是否展示 | Boolean | false |
| title | 编辑弹窗标题 | String | 编辑弹框 |
| formConfig | <a href="./ive-edit-form.html">同ive-edit-form</a> | Array | [] |
| hideConfig | <a href="./ive-edit-form.html">同ive-edit-form</a> | Array | [] |
| getDetailApi | 根据id获取编辑对象详情 | Function | null |
| editApi | 根据id编辑详情 | Function | null |
| labelWidth | 表单控件label宽度 | Number | 80 |
### 事件（events）
| 事件名 | 说明 | 返回值 |
| ------ | ------ | ------ |
| close | 用户关闭弹窗时触发 | 无 |
| update:formConfig | <a href="./ive-edit-form.html">同ive-edit-form</a> | 无 |
| update:hideConfig | <a href="./ive-edit-form.html">同ive-edit-form</a> | 无 |
| success | editApi已配置并且用户编辑成功时触发 | 表单数据集合 |
| submit | 用户点击弹窗确定按钮，并且editApi未配置时触发 | 无 |
### 方法（methods）
| 方法名 | 说明 |
| ------ | ------ |
| validateField | <a href="./ive-edit-form.html">同ive-edit-form</a> |
