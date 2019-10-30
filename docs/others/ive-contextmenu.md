# ive-contextmenu
## 一、代码示例
### html
```html
<template>
  <div>
    <div
      title="点击右键弹出菜单"
      @contextmenu.prevent="contextmenu"
    ></div>
    <ive-contextmenu
      ref="menu"
      :options="menuOptions"
      @cancel="reset"
      @close="reset"
    />
  </div>
</template>
```
### js
```js
export default {
  data() {
    return {
      menuOptions: [
        {
          name: '选项一',
          onClick: this.methods1,
        },
        {
          name: '选项二',
          onClick: this.methods2,
          disabled: true,
        },
        ...
      ],
    }
  },
  methods: {
    methods1(data) {
      console.log(data);
    },
    contextmenu($event) {
      this.$refs.menu.open($event, { test: 1 }, this.menuOptions);
    },
    reset() {
      console.log('reset');
    }
  },
}
```
## 二、属性、事件及方法说明
### 属性（props）
| 属性 | 说明 | 类型 | 默认值 |
| ------ | ------ | ------ | ------ |
| options | 右键菜单配置: [{ <br>name: 菜单名, <br>onClick: 回调函数(参数为this.$refs.menu.open调用时传入的第二个参数{ test: 1 } }, <br>disabled: 是否禁用 <br>}] | Array | 无（必填） |
### 事件（events）
| 事件名 | 说明 | 返回值 |
| ------ | ------ | ------ |
| cancel | 菜单关闭（当用户点击了页面其它位置） | 无 |
| close | 菜单关闭（当用户点击了某个菜单选项） | 无 |
### 方法（methods）
| 方法名 | 说明 | 参数 | 返回值 |
| ------ | ------ | ------ | ------ |
| open | 打开菜单 | 1. $event：鼠标右键事件的目标对象（用于定位菜单）<br>2. data：数据（会作为menuOptions中的onClick函数的参数）<br>3. options：右键菜单配置（会覆盖在模板中传给ive-contextmenu的options属性） | 无 |